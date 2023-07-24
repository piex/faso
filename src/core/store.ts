import {
  ReadableArgs,
  WritableArgs,
  ReadWriteArgs,
  PrimitiveArgs,
  ReadableAtomMap,
  ReadableAtomAbstract,
  WritableAtomAbstract,
  ReadAtomWithArgs,
  Read,
  Getter,
  ArgsType,
  AtomValue,
  ReadArgs,
  Write,
} from '../types';
import { Watch } from './watch';
import { generateUniqueId } from '../utils';
import { DirectedAcyclicGraph } from './dcg';
import { PrimitiveAtom, ReadWriteAtom, ReadableAtom, WritableAtom } from './atom';

/** 状态管理器 */
class Store {
  #readableAtomMap: ReadableAtomMap = {};
  #dcg = new DirectedAcyclicGraph();
  #watch = new Watch();

  // 更新可写 Atom
  public setState = <Args extends unknown[] = unknown[], Result = unknown>(
    atom: WritableAtomAbstract<Args, Result>,
    ...args: ArgsType<Args>
  ) => {
    // 清除之前的状态缓存
    this.#dcg.clearCachedUpdatedSource();
    // 更新状态，会收集所有被更新的 PrimitiveAtom
    const result = atom._write(...args);
    // 触发所有监听函数回调
    this.#notificationUpdate();
    return result;
  };

  /** subscribe atom update */
  public subscribe = <Atom extends ReadableAtomAbstract<any, any[]>>(
    atom: ReadAtomWithArgs<Atom>,
    cb: (v: AtomValue<Atom>) => void
  ) => {
    if (Array.isArray(atom)) {
      this.#watch.addSource(atom?.[0]?.id, () => cb(atom?.[0]?._read(...atom?.[1] as ReadArgs<Atom>)));
    } else {
      this.#watch.addSource(atom.id, () => cb(atom._read()));
    }
  };

  /** 生成可读 Atom */
  public generateReadableAtom = <Value, Args extends unknown[]>(
    { key, get }: ReadableArgs<Value, Args>
  ) => {
    const id = this.#getUniqueId(key);

    const getter = this.#getObserverGetter<Value, Args>(id, get);

    const atom = new ReadableAtom<Value, Args>(id, getter);

    // 将相关能力写入到 map 中缓存
    this.#readableAtomMap = {
      ...this.#readableAtomMap,
      [id]: atom as unknown as ReadableAtomAbstract<any, any[]>,
    };

    return atom;
  };

  /** 生成可写 Atom */
  public generateWritableAtom = <Args extends unknown[], Result>({ key, set }: WritableArgs<Args, Result>) => {
    const id = this.#getUniqueId(key);

    const atom = new WritableAtom(id, set);

    return atom;
  };

  /** 生成可读写 Atom */
  public generateReadWriteAtom = <Value, ReadArgs extends unknown[], WritArgs extends unknown[], Result>(
    { key, get, set }: ReadWriteArgs<Value, ReadArgs, WritArgs, Result>,
  ) => {
    const id = this.#getUniqueId(key);

    const getter = this.#getObserverGetter<Value, ReadArgs>(id, get);

    const atom = new ReadWriteAtom<Value, ReadArgs, WritArgs, Result>(id, getter, set);

    this.#readableAtomMap = {
      ...this.#readableAtomMap,
      [id]: atom as unknown as ReadableAtomAbstract<any, any[]>,
    };

    return atom;
  };

  /** 生成可读写 Primitive Atom */
  public generatePrimitiveAtom = <Value = unknown>(args: PrimitiveArgs<Value>) => {
    const id = this.#getUniqueId(args.key);

    // 通过闭包保存 value
    let value = args.default as Value;
    // 自定义 getter 读取 value
    const getter: Read<Value, []> = () => value;
    // 自定义 setter 修改 value
    const setter: Write<[Value], Value> = (_, v) => {
      this.#dcg.cacheUpdatedSource(id); // 缓存下所有更新过的 Primitive Atom
      return value = v;
    };

    const atom = new PrimitiveAtom<Value>(id, getter, setter);

    this.#readableAtomMap = {
      ...this.#readableAtomMap,
      [id]: atom as unknown as ReadableAtomAbstract<any, any[]>,
    };

    return atom;
  };

  // DAG 更新所有订阅和监听
  #notificationUpdate() {
    // 获取所有需要更新的状态
    const shouldUpdateAtomIds = this.#dcg.visitEffectNodes();
    // 触发状态监听函数
    this.#watch.notification(shouldUpdateAtomIds);
    // 清理缓存的状态
    this.#dcg.clearCachedUpdatedSource();
  }

  /** 包装 get 为 observerGetter，收集状态依赖关系放入 dcg 中 */
  #getObserverGetter = <Value, Args extends unknown[]>(id: string, get: Read<Value, Args>) => {
    const getter: Read<Value, Args> = (read, ...args) => {
      // 通过 observerGet 处理 atom 依赖关系
      const observerGet: Getter = (atom, ...args) => {
        // 添加依赖关系
        this.#dcg.addEdge(atom.id, id);
        return read(atom, ...args);
      };

      return get(observerGet, ...args) as Value;
    };

    return getter;
  };

  /** 生成唯一 Id */
  #getUniqueId = (key?: string) => {
    if (!key) {
      // 未指定 key，生成唯一 id
      return generateUniqueId();
    }

    // 判断 key 是否重复
    if (this.#readableAtomMap[key]) {
      throw new Error(`Atom Key duplicate: ${key}`);
    }

    return key;
  };
}

export const globalStore = new Store();
