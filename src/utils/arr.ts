/** 字符串数组去重，保持顺序，时间复杂度 O(n) */
export const uniqueStringArray = (arr: string[]) => {
  const map: { [key: string]: true } = {};
  const uniqueArr: string[] = [];

  arr.forEach(item => {
    if (map[item]) {
      return;
    }
    uniqueArr.push(item);
    map[item] = true;
  });

  return uniqueArr;
};

/** 通用数组去重, 时间复杂度 O(n^2) */
export const uniqueArray = <T = unknown>(arr: T[]) => {
  const uniqueArr: T[] = [];

  arr.forEach(item => {
    if (!uniqueArr.includes(item)) {
      uniqueArr.push(item);
    }
  });

  return uniqueArr;
};
