import {
  ReadableAtom,
  WritableAtom,
  ReadWriteAtom,
} from '../src/core/atom';

const text = 'Hello World!';
const newText = 'Hi Faso!';

const createPrimitiveAtom = <Value>(v: Value) => {
  let value = v;
  return new ReadWriteAtom('', () => value, (_, _v: Value) => value = _v);
};

describe('PrimitiveAtom', () => {
  it('read value and stringify', () => {
    const obj = { a: 123, b: text };
    const countState = createPrimitiveAtom(0);
    const textState = createPrimitiveAtom(text);
    const objState = createPrimitiveAtom(obj);

    expect(countState._read()).toBe(0);
    expect(textState._read()).toBe(text);
    expect(objState._read()).toBe(obj);

    expect(countState._stringify()).toBe('0');
    expect(textState._stringify()).toBe(JSON.stringify(text));
    expect(objState._stringify()).toBe(JSON.stringify(obj));
  });

  it('set value', () => {
    const text = 'Hello World!';
    const obj = { a: 123, b: text };
    const countState = createPrimitiveAtom(1);
    const textState = createPrimitiveAtom(text);
    const objState = createPrimitiveAtom(obj);

    expect(countState._read()).toBe(1);
    countState._write(10);
    expect(countState._read()).toBe(10);
    countState._write(99);
    expect(countState._read()).toBe(99);

    expect(textState._stringify()).toBe(JSON.stringify(text));
    textState._write('Hi Faso');
    expect(textState._stringify()).toBe(JSON.stringify('Hi Faso'));

    expect(objState._read()).toBe(obj);
    objState._write({ ...obj, a: 1, b: 'Hi Faso' });
    expect(objState._read()).not.toBe(obj);
  });
});

describe('ReadableAtom', () => {
  it('Read State from ReadableAtom', () => {
    const countState = createPrimitiveAtom(0);
    const textState = createPrimitiveAtom(text);

    const readableState = new ReadableAtom(
      '',
      get => `text: ${get(textState)}，count: ${get(countState)}`,
    );

    const objState = new ReadableAtom(
      '',
      get => ({
        count: get(countState),
        text: get(textState),
      }),
    );

    expect(readableState._read()).toBe(`text: ${text}，count: 0`);
    expect(objState._read()).toEqual({ count: 0, text });
    expect(objState._stringify()).toEqual(JSON.stringify({ count: 0, text }));

    countState._write(9);
    textState._write(newText);
    expect(readableState._read()).toBe(`text: ${newText}，count: 9`);
    expect(objState._read()).toEqual({ count: 9, text: newText });
    expect(objState._stringify()).toEqual(
      JSON.stringify({ count: 9, text: newText }),
    );
  });

  it('ReadableAtom support get params', () => {
    const countState = createPrimitiveAtom(0);
    const textState = createPrimitiveAtom(text);

    const readableState = new ReadableAtom(
      '',
      (get, offset: number) => `text: ${get(textState)}，count: ${get(countState) + offset}`,
    );

    const objState = new ReadableAtom(
      '',
      get => ({
        count: get(countState),
        text: get(textState),
      }),
    );

    expect(readableState._read(0)).toBe(`text: ${text}，count: 0`);
    expect(objState._read()).toEqual({ count: 0, text });
    expect(objState._stringify()).toEqual(JSON.stringify({ count: 0, text }));

    countState._write(9);
    textState._write(newText);
    expect(readableState._read(1)).toBe(`text: ${newText}，count: 10`);
    expect(objState._read()).toEqual({ count: 9, text: newText });
    expect(objState._stringify()).toEqual(
      JSON.stringify({ count: 9, text: newText }),
    );
  });

  it('ReadableAtom support nested get params', () => {
    const countState = createPrimitiveAtom(0);
    const textState = createPrimitiveAtom(text);

    const offsetCountAtom = new ReadableAtom(
      '',
      (get, offset: number) => get(countState) + offset,
    );

    const objState = new ReadableAtom(
      '',
      (get, offset1: number, offset2: number) => ({
        count: get(offsetCountAtom, offset1) + offset2,
        text: get(textState),
      }),
    );

    expect(offsetCountAtom._read(0)).toBe(0);
    expect(objState._read(1, 2)).toEqual({ count: 3, text });
    expect(objState._stringify(1, 2)).toEqual(JSON.stringify({ count: 3, text }));

    countState._write(9);
    textState._write(newText);
    expect(objState._read(3, 3)).toEqual({ count: 15, text: newText });
    expect(objState._stringify(3, 3)).toEqual(
      JSON.stringify({ count: 15, text: newText }),
    );
  });
});

describe('WritableAtom', () => {
  const countState = createPrimitiveAtom(0);
  const textState = createPrimitiveAtom(text);

  it('Set State from WritableAtom', () => {
    const writeState = new WritableAtom('', ({ set }, c: number, t: string) => {
      set(countState, c);
      set(textState, t);
    });

    expect(countState._read()).toBe(0);
    expect(textState._read()).toBe(text);

    writeState._write(99, newText);
    expect(countState._read()).toBe(99);
    expect(textState._read()).toBe(newText);
  });
});

describe('ReadWriteAtom', () => {
  const countState = createPrimitiveAtom(0);
  const textState = createPrimitiveAtom(text);

  it('Set State from WritableAtom', () => {
    const rwState = new ReadWriteAtom(
      '',
      get => `text: ${get(textState)}，count: ${get(countState)}`,
      ({ set }, c: number, t: string) => {
        set(countState, c);
        set(textState, t);
      },
    );

    expect(countState._read()).toBe(0);
    expect(textState._read()).toBe(text);
    expect(rwState._read()).toBe(`text: ${text}，count: 0`);
    expect(rwState._stringify()).toEqual(
      JSON.stringify(`text: ${text}，count: 0`),
    );

    rwState._write(99, newText);
    expect(countState._read()).toBe(99);
    expect(textState._read()).toBe(newText);
    expect(rwState._read()).toBe(`text: ${newText}，count: 99`);
    expect(rwState._stringify()).toEqual(
      JSON.stringify(`text: ${newText}，count: 99`),
    );
  });
});