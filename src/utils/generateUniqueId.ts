/** 生成唯一不重复 id */
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
