/**
 * 価格に強く効く状態フラグ。コレクションとマーケットで共有する値オブジェクト。
 * デモの firstEd/obi/special を1つにまとめたもの。
 */
export interface ConditionFlags {
  firstEd: boolean; // 初版
  obi: boolean; // 帯付き
  special: boolean; // 特装版 / サイン本
}
