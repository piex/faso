import { uniqueStringArray } from '../utils';

// Source: 只有出边，没有入边的点
// Sink: 只有入边，没有出边的点

/** 依赖关系描述 */
interface DependenceMap {
  [key: string]: string[];
}

export class DirectedAcyclicGraph {
  #dependenceMap: DependenceMap = {};
  #cachedUpdatedSource: string[] = [];

  /** 缓存被更新的 source */
  cacheUpdatedSource = (source: string) => {
    this.#cachedUpdatedSource = uniqueStringArray([...this.#cachedUpdatedSource, source]);
  };

  /** 清理被更新的 source */
  clearCachedUpdatedSource() {
    this.#cachedUpdatedSource = [];
  }

  /** 在DAG中添加一条边 */
  addEdge(from: string, to: string) {
    if (!this.#dependenceMap[from]) {
      this.#dependenceMap[from] = [];
    }
    this.#dependenceMap[from] = uniqueStringArray([...this.#dependenceMap[from], to]);
  }

  /** 找到被影响到的所有节点，并排序 */
  visitEffectNodes(): string[] {
    // source 的权重设置为 0
    const weightMap = this.#cachedUpdatedSource
      .reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as { [key: string]: number });

    // 递归所有被影响的需要更新的节点，并计算权重
    const resolveNodeWeight = (weight: number, id: string) => {
      this.#dependenceMap[id]?.forEach(did => {
        weightMap[did] = Math.max(weight, weightMap[did] || 1);
        // 递归计算依赖
        resolveNodeWeight(weight + 1, did);
      });
    };

    // 从 source 节点开始计算
    this.#cachedUpdatedSource.forEach(sid => resolveNodeWeight(1, sid));

    return Object.keys(weightMap).sort((a, b) => weightMap[a] - weightMap[b]);
  }
}
