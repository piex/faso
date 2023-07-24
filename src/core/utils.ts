import {
  Getter,
  ReadableAtomAbstract,
  WritableAtomAbstract,
  AtomResult,
  SetStateParams,
  ReadAtomWithArgs,
  AtomValue,
} from '../types';
import { globalStore } from './store';

export const setState = <Atom extends WritableAtomAbstract<any[], any> = any>(
  ...[atom, ...args]: SetStateParams<Atom>
) => globalStore.setState(atom, ...args) as AtomResult<Atom>;

export const subscribe = <Atom extends ReadableAtomAbstract<any, any[]> = any>(
  atom: ReadAtomWithArgs<Atom>,
  cb: (v: AtomValue<Atom>) => void,
) => {
  globalStore.subscribe(atom, cb);
};

export const watch = (cb: (get: Getter) => void) => {
  const subs: { [key: string]: true } = {};

  const getter: Getter = (atom, ...args) => {
    if (!subs[atom.id]) {
      subs[atom.id] = true;
      subscribe(atom as ReadAtomWithArgs<ReadableAtomAbstract<any, any>>, () => cb(getter));
    }

    return atom._read(...args);
  };

  cb(getter);
};

// export const subscribeAll = <T extends SubscribeAllAtom<any>[]>(
//   atoms: T,
//   cb: (...states: ReadableAtomValueTuple<T>) => void
// ) => {
//   const cbPrams = atoms.map(atom => {
//     if (Array.isArray(atom)) {
//       return atom[0]._read(atom[1]);
//     }
//     return atom._read();
//   });

//   const acb = () => cb(...cbPrams as ReadableAtomValueTuple<T>);

//   atoms.forEach((atom) => {
//     if (Array.isArray(atom)) {
//       subscribe(atom[0], acb, atom[1]);
//     } else { 
//       subscribe(atom, acb);
//     }
//   });
// };
