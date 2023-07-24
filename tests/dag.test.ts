/**
graph LR
A-->A1
A1-->A2B1
B-->A2B1
A2B1-->A3B2C1
C-->A3B2C1
A3B2C1-->A4B3C2D2
A3B2C1-->A4B3C2D3D2D1E3F4
A4B3C2D2-->A5B4C3D3D2D1
D-->D1
D-->A5B4C3D3D2D1
D-->A4B3C2D3D2D1E3F4
D1-->A4B3C2D2
D1-->A5B4C3D3D2D1
D1-->D2E2F3
D1-->A4B3C2D3D2D1E3F4
E-->E1
F-->F1
F1-->F2
E1-->D2E2F3
F2-->D2E2F3
E1-->A4B3C2D3D2D1E3F4
D2E2F3-->A4B3C2D3D2D1E3F4
A2B1-->A3B2E2
E1-->A3B2E2
E1-->E2F3
F2-->E2F3
A3B2E2-->A4B3E3F1
F-->A4B3E3F1
A3B2E2-->A4B3E3F4
E2F3-->A4B3E3F4
 */

import { DirectedAcyclicGraph } from '../src/core/dcg';

describe('DirectedAcyclicGraph', () => {
  const dag = new DirectedAcyclicGraph();

  dag.addEdge('A', 'A1');
  dag.addEdge('A1', 'A2B1');
  dag.addEdge('B', 'A2B1');
  dag.addEdge('A2B1', 'A3B2C1');
  dag.addEdge('C', 'A3B2C1');
  dag.addEdge('A3B2C1', 'A4B3C2D2');
  dag.addEdge('A3B2C1', 'A4B3C2D3D2D1E3F4');
  dag.addEdge('A4B3C2D2', 'A5B4C3D3D2D1');
  dag.addEdge('D', 'D1');
  dag.addEdge('D', 'A5B4C3D3D2D1');
  dag.addEdge('D', 'A4B3C2D3D2D1E3F4');
  dag.addEdge('D1', 'A4B3C2D2');
  dag.addEdge('D1', 'A5B4C3D3D2D1');
  dag.addEdge('D1', 'D2E2F3');
  dag.addEdge('D1', 'A4B3C2D3D2D1E3F4');
  dag.addEdge('E', 'E1');
  dag.addEdge('F', 'F1');
  dag.addEdge('F1', 'F2');
  dag.addEdge('E1', 'D2E2F3');
  dag.addEdge('F2', 'D2E2F3');
  dag.addEdge('E1', 'A4B3C2D3D2D1E3F4');
  dag.addEdge('D2E2F3', 'A4B3C2D3D2D1E3F4');
  dag.addEdge('A2B1', 'A3B2E2');
  dag.addEdge('E1', 'A3B2E2');
  dag.addEdge('E1', 'E2F3');
  dag.addEdge('F2', 'E2F3');
  dag.addEdge('A3B2E2', 'A4B3E3F1');
  dag.addEdge('F', 'A4B3E3F1');
  dag.addEdge('A3B2E2', 'A4B3E3F4');
  dag.addEdge('E2F3', 'A4B3E3F4');

  it('Should return effect nodes ordered with a single source.', () => {
    dag.cacheUpdatedSource('A');
    expect(dag.visitEffectNodes()).toEqual(['A', 'A1', 'A2B1', 'A3B2C1', 'A3B2E2', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('B');
    expect(dag.visitEffectNodes()).toEqual(['B', 'A2B1', 'A3B2C1', 'A3B2E2', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('C');
    expect(dag.visitEffectNodes()).toEqual(['C', 'A3B2C1', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('D');
    expect(dag.visitEffectNodes()).toEqual(['D', 'D1', 'A4B3C2D2', 'D2E2F3', 'A5B4C3D3D2D1', 'A4B3C2D3D2D1E3F4']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('E');
    expect(dag.visitEffectNodes()).toEqual(['E', 'E1', 'D2E2F3', 'A3B2E2', 'E2F3', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('F');
    expect(dag.visitEffectNodes()).toEqual(['F', 'F1', 'A4B3E3F1', 'F2', 'D2E2F3', 'E2F3', 'A4B3C2D3D2D1E3F4', 'A4B3E3F4']);
  });

  it('Should return effect nodes ordered with multi source.', () => {
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('A');
    dag.cacheUpdatedSource('B');
    expect(dag.visitEffectNodes()).toEqual(['A', 'B', 'A1', 'A2B1', 'A3B2C1', 'A3B2E2', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('B');
    dag.cacheUpdatedSource('C');
    expect(dag.visitEffectNodes()).toEqual(['B', 'C', 'A2B1', 'A3B2C1', 'A3B2E2', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('D');
    dag.cacheUpdatedSource('C');
    expect(dag.visitEffectNodes()).toEqual(['D', 'C', 'D1', 'A3B2C1', 'A4B3C2D2', 'D2E2F3', 'A5B4C3D3D2D1', 'A4B3C2D3D2D1E3F4']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('D');
    dag.cacheUpdatedSource('E');
    expect(dag.visitEffectNodes()).toEqual(['D', 'E', 'D1', 'E1', 'A4B3C2D2', 'D2E2F3', 'A3B2E2', 'E2F3', 'A5B4C3D3D2D1', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('E');
    dag.cacheUpdatedSource('C');
    expect(dag.visitEffectNodes()).toEqual(['E', 'C', 'E1', 'A3B2C1', 'D2E2F3', 'A3B2E2', 'E2F3', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('F');
    dag.cacheUpdatedSource('B');
    expect(dag.visitEffectNodes()).toEqual(['F', 'B', 'F1', 'A2B1', 'F2', 'A3B2C1', 'A3B2E2', 'D2E2F3', 'E2F3', 'A4B3E3F1', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('E');
    dag.cacheUpdatedSource('C');
    dag.cacheUpdatedSource('D');
    expect(dag.visitEffectNodes()).toEqual(['E', 'C', 'D', 'E1', 'A3B2C1', 'D1', 'D2E2F3', 'A3B2E2', 'E2F3', 'A4B3C2D2', 'A4B3C2D3D2D1E3F4', 'A4B3E3F1', 'A4B3E3F4', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
  });

  it('Permutation.', () => {
    dag.clearCachedUpdatedSource();
    dag.cacheUpdatedSource('F');
    dag.cacheUpdatedSource('E');
    dag.cacheUpdatedSource('C');
    dag.cacheUpdatedSource('B');
    dag.cacheUpdatedSource('A');
    dag.cacheUpdatedSource('D');
    expect(dag.visitEffectNodes()).toEqual(['F', 'E', 'C', 'B', 'A', 'D', 'F1', 'E1', 'A1', 'D1', 'F2', 'A2B1', 'D2E2F3', 'E2F3', 'A3B2E2', 'A3B2C1', 'A4B3C2D3D2D1E3F4', 'A4B3E3F4', 'A4B3E3F1', 'A4B3C2D2', 'A5B4C3D3D2D1']);
    dag.clearCachedUpdatedSource();
  });
});