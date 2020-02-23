export function pluck<K>(source: any, target: K): K {
  let result: K = target;
  for (const key in result) {
    if (source.hasOwnProperty(key)) {
      const element = source[key];
      result[key] = element;
    }
  }
  return result;
};