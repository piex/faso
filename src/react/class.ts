// import { setState, subscribe } from '..';
// import { ReadableAtomAbstract, WritableAtomAbstract } from '../types';

// interface Component<Props = any, State = any>{
//   props: Props;
//   state: State;
//   setState: (state: Partial<State>) => void;
// }

// export const bindFasoValue = <V = any, Args extends unknown[] = any[]>(
//   comp: Component,
//   key: string,
//   atom: ReadableAtomAbstract<V, Args>,
//   args: Args
// ) => {
//   subscribe(
//     atom,
//     state => {
//       comp?.setState?.({
//         [key]: state,
//       });
//     },
//   );

//   return atom._read(...args);
// };

// export const bindSetFasoState = <
//   Args extends unknown[] = any[],
//   Result = any,
// >(_: Component, atom: WritableAtomAbstract<Args, Result>) => (...v: Args) 
//   => setState(atom, ...v);

// export const bindFasoState = <
//   Value = any,
//   ReadArgs extends unknown[] = any[],
//   WriteArgs extends unknown[] = any[],
//   Result = any,
// >(
//     comp: Component,
//     key: string,
//     atom: ReadableAtomAbstract<Value, ReadArgs> & WritableAtomAbstract<WriteArgs, Result>,
//     ...args: ReadArgs
//   ) => {
//   const _state = bindFasoValue<Value, ReadArgs>(comp, key, atom, ...args);
//   const _setState = bindSetFasoState<WriteArgs, Result>(comp, atom);

//   return [_state, _setState];
// };
