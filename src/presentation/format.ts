/** 表示用フォーマッタ（Presentation の関心事）。デモの yen 相当。 */
export const formatYen = (n: number): string =>
  '¥' + Math.round(n || 0).toLocaleString('ja-JP');

/** 符号付き（含み損益用）。 */
export const formatSignedYen = (n: number): string =>
  (n > 0 ? '+' : '') + formatYen(n);

/** 損益に応じた CSS クラス（plus / minus / ''）。 */
export const plClass = (n: number): string =>
  n > 0 ? 'plus' : n < 0 ? 'minus' : '';
