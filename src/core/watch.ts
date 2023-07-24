import { uniqueArray } from '../utils';

interface WatchSources {
  [key: string]: (() => void)[];
}

/** watch 管理 */
export class Watch {
  sources: WatchSources = {};

  // 添加 watch 监听
  addSource = (id: string, source: () => void) => {
    if (!this.sources[id]) {
      this.sources[id] = [source];
    } else {
      this.sources[id] = uniqueArray([...this.sources[id], source]);
    }
  };

  // 移除 watch 监听
  removeSource = (id: string, source: () => void) => {
    this.sources[id] = this.sources[id].filter(cb => cb !== source);
  };

  // 触发所有监听回调
  notification = (ids: string[]) => {
    const watches = ids.map(id => this.sources[id]).flat();
    uniqueArray(watches).forEach(w => w?.());
  };
}
