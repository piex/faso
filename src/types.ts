import { AtomType } from "./constants";

export type Getter = <
  Value = any,
  Args extends any[] = any[],
>(atom: ReadableAtomAbstract<Value, Args>, ...args: ArgsType<Args>) => Value

export type Setter = <Args extends unknown[], Result>(
  atom: WritableAtomAbstract<Args, Result>,
  ...args: ArgsType<Args>
) => Result;

export type ArgsType<Arg> = Arg extends [] ? [] : Arg;

export type Read<Value, Args extends unknown[]> = (get: Getter, ...args: ArgsType<Args>) => Value;

export type Write<Args extends unknown[], Result> = (
  operator: { get: Getter; set: Setter },
  ...args: ArgsType<Args>
) => Result;

export interface PrimitiveArgs<Value> {
  key?: string;
  default: Value;
}

export interface ReadableArgs<Value = unknown, Args extends unknown[] = unknown[]> {
  key?: string;
  get: Read<Value, Args>;
}

export interface WritableArgs<Args extends unknown[], Result>  {
  key?: string;
  set: Write<Args, Result>;
}

export interface ReadWriteArgs<
  Value = unknown,
  ReadArgs extends unknown[] = unknown[],
  WritArgs extends unknown[] = unknown[],
  Result = unknown,
> extends ReadableArgs<Value, ReadArgs>, WritableArgs<WritArgs, Result>{ }

/** 可读 Atom 抽象接口 */
export interface ReadableAtomAbstract<Value, Args extends unknown[]> {
  readonly id: string;
  readonly type: AtomType,
  _stringify: (...args: ArgsType<Args>) => string | null;
  _read: (...args: ArgsType<Args>) => Value;
}

/** 可写 Atom 抽象接口 */
export interface WritableAtomAbstract<Args extends unknown[], Result> {
  readonly id: string;
  readonly type: AtomType,
  _write: (...args: ArgsType<Args>) => Result;
}

export interface ReadableAtomMap<Value = any, Args extends unknown[] = any[]> {
  [key: string]: ReadableAtomAbstract<Value, Args>;
}

export interface WritableAtomMap {
  [key: string]: {
    atom: WritableAtomAbstract<unknown[], unknown>;
    dependencies: WritableAtomAbstract<unknown[], unknown>;
    level: number;
  };
}

export type SubscribeArgs<Value = unknown, Args extends unknown[] = unknown[]> =
  Args extends [] ?
  [ReadableAtomAbstract<Value, Args>, (v: Value) => void]
  : [ReadableAtomAbstract<Value, Args>, (v: Value) => void, Args];

export type WritArgs<Atom> = Atom extends WritableAtomAbstract<infer Args, any> ? Args : never;
export type AtomResult<Atom> = Atom extends WritableAtomAbstract<any[], infer Result> ? Result : never;
export type ReadArgs<Atom> = Atom extends ReadableAtomAbstract<any, infer Args> ? Args : never;
export type AtomValue<Atom> = Atom extends ReadableAtomAbstract<infer Value, any> ? Value : never;

export type SetStateParams<Atom extends WritableAtomAbstract<unknown[], unknown>> =
  WritArgs<Atom> extends [] ? [atom: Atom] : [atom: Atom, ...args: WritArgs<Atom>];

export type SubscribeParams<Atom extends ReadableAtomAbstract<unknown, any[]>> =
  ReadArgs<Atom> extends [] ?
  [atom: Atom, cb: (v: AtomValue<Atom>) => void] :
  [atom: [atom: Atom, args: ReadArgs<Atom>], cb: (v: AtomValue<Atom>) => void];

export type ReadAtomWithArgs<Atom extends ReadableAtomAbstract<any, any>> =
  ReadArgs<Atom> extends [] ? Atom : [Atom, ReadArgs<Atom>];

export interface ReadVisitor {
  /** Atom Id */
  id: string;
  /** Atom 类型 */
  type: AtomType;
}

export interface WriteVisitor {
  /** Atom Id */
  id: string;
  /** Atom 类型 */
  type: AtomType;
}

export interface Plugin {
  read?: Read<any, any[]>;
  writ?: Write<any[], any>;
}
