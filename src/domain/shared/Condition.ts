/**
 * コンディション（状態ランク）。コレクションとマーケットで共有する値オブジェクト。
 * デモの 'S（新品・美品）' 等を記号に正規化。
 */
export type Condition = 'S' | 'A' | 'B' | 'C';

export const CONDITIONS: readonly Condition[] = ['S', 'A', 'B', 'C'];

export const CONDITION_LABELS: Record<Condition, string> = {
  S: 'S（新品・美品）',
  A: 'A（良い）',
  B: 'B（並）',
  C: 'C（傷み・難あり）',
};
