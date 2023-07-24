import { AtomType } from 'src/constants';
import {
  Read,
  Write,
  ReadableAtomAbstract,
  WritableAtomAbstract,
  ArgsType,
  Getter,
  Setter,
} from '../types';

/** 从可读状态中获取当前状态值 */
const getter: Getter = (atom, ...args) => atom._read(...args);
/** 往可写入状态中写入新数据 */
const setter: Setter = (atom, ...args) => atom._write(...args);

export class ReadableAtom<
  Value = unknown,
  Args extends unknown[] = unknown[]
> implements ReadableAtomAbstract<Value, Args> {
  // 都保存为 getter 函数的形式
  #getter: Read<Value, Args>;
  #id: string;

  constructor(id: string, getter: Read<Value, Args>) {
    this.#getter = getter;
    this.#id = id;
  }

  get type() {
    return AtomType.Readable;
  }

  get id() {
    return this.#id;
  }


  /** 从状态中读取当前状态值 */
  _read = (...args: ArgsType<Args>) => this.#getter(getter, ...args);

  /** 将状态转为 string */
  _stringify = (...args: ArgsType<Args>) => {
    try {
      return JSON.stringify(this._read(...args));
    } catch (e) {
      return null;
    }
  };
}


export class WritableAtom<
  Args extends unknown[] = unknown[],
  Result = unknown,
> implements WritableAtomAbstract<Args, Result> {
  #setter: Write<Args, Result>;
  #id: string;

  constructor(id: string, setter: Write<Args, Result>) {
    this.#id = id;
    this.#setter = setter;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return AtomType.Writable;
  }

  // write new atom state
  _write = (...args: ArgsType<Args>) =>
    this.#setter(
      { get: getter, set: setter },
      ...args,
    );
}

/** 可读可写的 Atom */
export class ReadWriteAtom<
  Value = unknown,
  ReadArgs extends unknown[] = unknown[],
  WriteArgs extends unknown[] = unknown[],
  Result = unknown,
> implements ReadableAtomAbstract<Value, ReadArgs>, WritableAtomAbstract<WriteArgs, Result> {
  #readableAtom: ReadableAtom<Value, ReadArgs>;
  #writableAtom: WritableAtom<WriteArgs, Result>;
  #id: string;

  constructor(id: string, getter: Read<Value, ReadArgs>, setter: Write<WriteArgs, Result>) {
    this.#id = id;
    this.#readableAtom = new ReadableAtom(id, getter);
    this.#writableAtom = new WritableAtom(id, setter);
  }

  get id() {
    return this.#id;
  }

  get type() {
    return AtomType.ReadWrite;
  }

  _stringify = (...args: ArgsType<ReadArgs>) => this.#readableAtom._stringify(...args);

  _read = (...args: ArgsType<ReadArgs>) => this.#readableAtom._read(...args);

  _write = (...args: ArgsType<WriteArgs>) => this.#writableAtom._write(...args);
}

export class PrimitiveAtom<Value> extends ReadWriteAtom<Value, [], [Value], Value> {
  constructor(id: string, getter: Read<Value, []>, setter: Write<[Value], Value>) {
    super(id, getter, setter);
  }

  get type() {
    return AtomType.Primitive;
  }
}