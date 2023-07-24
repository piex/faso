/** 通过简单工厂模式，只需要 atom 方法即可创建不同的 Atom 处理对象 */
import {
  PrimitiveArgs,
  ReadableArgs,
  WritableArgs,
  ReadWriteArgs,
} from '../types';
import {
  ReadWriteAtom,
  ReadableAtom,
  WritableAtom,
} from './atom';
import { globalStore } from './store';

// primitive atom
export function atom<Value>(args: PrimitiveArgs<Value>): ReadWriteAtom<Value, [], [Value], Value>;

// readable atom
export function atom<Value, ReadArgs extends unknown[]>(args: ReadableArgs<Value, ReadArgs>)
  : ReadableAtom<Value, ReadArgs>;

// writable atom
export function atom<WritArgs extends unknown[], Result>(args: WritableArgs<WritArgs, Result>)
  : WritableAtom<WritArgs, Result>;

// read write atom
export function atom<Value, ReadArgs extends unknown[], WritArgs extends unknown[], Result>(
  args: ReadWriteArgs<Value, ReadArgs, WritArgs, Result>,
): ReadWriteAtom<Value, ReadArgs, WritArgs, Result>;

export function atom<Value, ReadArgs extends unknown[], WritArgs extends unknown[], Result>(
  args: Partial<PrimitiveArgs<Value> & ReadWriteArgs<Value, ReadArgs, WritArgs>>,
) {
  // 生成可读可写的 Atom
  if (args.get && args.set) {
    return globalStore.generateReadWriteAtom(args as ReadWriteArgs<Value, ReadArgs, WritArgs, Result>);
  }

  // 生成只读的 Atom
  if (args.get) {
    return globalStore.generateReadableAtom(args as ReadableArgs<Value, ReadArgs>);
  }

  // 生成只写的 Atom
  if (args.set) {
    return globalStore.generateWritableAtom(args as WritableArgs<WritArgs, Result>);
  }

  // PrimitiveAtom
  return globalStore.generatePrimitiveAtom(args as PrimitiveArgs<Value>);
}
