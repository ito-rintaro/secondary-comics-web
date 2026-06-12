/**
 * シード可能な擬似乱数（mulberry32）。
 * デモの genHistory は Math.random を使っていたが、テスト再現性とリロード間の
 * チャート安定のため固定シードの PRNG を用いる（architecture.md §7 の注）。
 */
export const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
