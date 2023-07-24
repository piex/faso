import { atom, setState, subscribe, watch } from '../src';

const text = 'Faso';
const world = 'World';

describe('atom factory', () => {
  it('primitive atom', () => {
    const textState = atom({
      default: text,
    });

    expect(textState._read()).toBe(text);
  });

  it('selector atom', () => {
    const textState = atom({
      key: 'basic_text_1',
      default: text,
    });


    const hiState = atom({
      get: get => `Hi, ${get(textState)}`,
    });

    expect(hiState._read()).toBe(`Hi, ${text}`);
    textState._write(world);
    expect(hiState._read()).toBe(`Hi, ${world}`);
  });
});

describe('subscribe atom', () => {
  it('basic', () => {
    const textState = atom({
      default: '',
    });

    const mockCallback = jest.fn<void, [string]>(str => str);

    subscribe(textState, mockCallback);
    expect(mockCallback.mock.calls).toHaveLength(0);
    setState(textState, text);
    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toBe(text);
    setState(textState, world);
    expect(mockCallback.mock.calls).toHaveLength(2);
    expect(mockCallback.mock.calls[1][0]).toBe(world);
  });

  it('watch', () => {
    const textState = atom({
      default: '',
    });

    const priceState = atom({
      default: 0,
    });

    const mockCallback = jest.fn<void, [string, number]>(() => { });

    watch(get => {
      mockCallback(get(textState), get(priceState));
    });

    expect(mockCallback.mock.calls).toHaveLength(1);
    setState(textState, text);
    expect(mockCallback.mock.calls).toHaveLength(2);
    expect(mockCallback.mock.calls[1]).toEqual([text, 0]);
    setState(priceState, 66);
    expect(mockCallback.mock.calls).toHaveLength(3);
    expect(mockCallback.mock.calls[2]).toEqual([text, 66]);
    setState(textState, world);
    setState(priceState, 88);
    expect(mockCallback.mock.calls).toHaveLength(5);
    expect(mockCallback.mock.calls[4]).toEqual([world, 88]);
  });
});

describe('readwrite atom', () => {
  it('write atom', () => {
    const priceState = atom({
      default: 1,
    });

    const doublePriceAtom = atom({
      set: ({ set, get }) => {
        set(priceState, get(priceState) * 2);
      }
    });

    const mockCallback = jest.fn<void, [number]>(() => { });

    subscribe(priceState, mockCallback);

    expect(mockCallback.mock.calls).toHaveLength(0);
    setState(doublePriceAtom);
    expect(mockCallback.mock.calls).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0]).toEqual(2);
    setState(doublePriceAtom);
    expect(mockCallback.mock.calls).toHaveLength(2);
    expect(mockCallback.mock.calls[1][0]).toEqual(4);
  });

  it('readwrite atom', () => { });
});