import type { Condition } from '../../../domain/shared/Condition';
import type { ConditionFlags } from '../../../domain/shared/ConditionFlags';

/**
 * 擬似成約の生成元（デモ index.html の MARKET 配列を移植）。
 * base/trend/vol から catalog ごとの成約イベント列を作り、それを畳んで相場サマリを導く。
 */
export interface MarketSeed {
  catalogId: string; // 集計単位（Catalog の id）
  title: string;
  author: string;
  publisher: string;
  volume: string;
  seller: string;
  condition: Condition;
  flags: ConditionFlags;
  base: number; // 基準価格
  trend: number; // 期間トレンド（上昇/下降）
  vol: number; // ぶれ幅
}

export const marketSeed: MarketSeed[] = [
  { catalogId: 'cat-001', title: 'AKIRA 全6巻 初版帯付 美品セット', author: '大友克洋', publisher: '講談社', volume: '全6巻', seller: 'コレクター田中', condition: 'A', flags: { firstEd: true, obi: true, special: false }, base: 30000, trend: 0.18, vol: 0.06 },
  { catalogId: 'cat-002', title: '幽☆遊☆白書 直筆サイン入り 第1巻', author: '冨樫義博', publisher: '集英社', volume: '第1巻', seller: 'mangavault', condition: 'A', flags: { firstEd: true, obi: true, special: true }, base: 52000, trend: 0.3, vol: 0.08 },
  { catalogId: 'cat-003', title: 'ドラゴンボール 1〜42巻 初版多数', author: '鳥山明', publisher: '集英社', volume: '全42巻', seller: '昭和書房', condition: 'B', flags: { firstEd: true, obi: false, special: false }, base: 68000, trend: 0.12, vol: 0.05 },
  { catalogId: 'cat-004', title: 'ジョジョの奇妙な冒険 第1巻 初版', author: '荒木飛呂彦', publisher: '集英社', volume: '第1巻', seller: 'ぬのまる', condition: 'B', flags: { firstEd: true, obi: false, special: false }, base: 19000, trend: 0.22, vol: 0.1 },
  { catalogId: 'cat-005', title: 'ベルセルク 第1巻 初版', author: '三浦建太郎', publisher: '白泉社', volume: '第1巻', seller: '剣の墓場', condition: 'B', flags: { firstEd: true, obi: false, special: false }, base: 15000, trend: 0.4, vol: 0.09 },
  { catalogId: 'cat-006', title: 'NARUTO 1巻 初版帯付', author: '岸本斉史', publisher: '集英社', volume: '第1巻', seller: '忍里', condition: 'A', flags: { firstEd: true, obi: true, special: false }, base: 8000, trend: 0.1, vol: 0.07 },
  { catalogId: 'cat-007', title: '鬼滅の刃 1巻 初版帯付', author: '吾峠呼世晴', publisher: '集英社', volume: '第1巻', seller: '柱コレクション', condition: 'S', flags: { firstEd: true, obi: true, special: false }, base: 9500, trend: -0.08, vol: 0.11 },
  { catalogId: 'cat-008', title: 'ハンター×ハンター 1巻 初版', author: '冨樫義博', publisher: '集英社', volume: '第1巻', seller: 'mangavault', condition: 'A', flags: { firstEd: true, obi: true, special: false }, base: 11000, trend: 0.15, vol: 0.06 },
  { catalogId: 'cat-009', title: 'るろうに剣心 全28巻 初版セット', author: '和月伸宏', publisher: '集英社', volume: '全28巻', seller: '明治堂', condition: 'A', flags: { firstEd: true, obi: false, special: false }, base: 22000, trend: 0.09, vol: 0.04 },
  { catalogId: 'cat-010', title: '寄生獣 全10巻 初版', author: '岩明均', publisher: '講談社', volume: '全10巻', seller: 'ミギー', condition: 'A', flags: { firstEd: true, obi: false, special: false }, base: 13000, trend: 0.14, vol: 0.05 },
  { catalogId: 'cat-011', title: '美味しんぼ 直筆サイン本', author: '雁屋哲/花咲アキラ', publisher: '小学館', volume: '第1巻', seller: '究極の', condition: 'B', flags: { firstEd: true, obi: false, special: true }, base: 28000, trend: 0.05, vol: 0.06 },
  { catalogId: 'cat-012', title: 'ワンピース 1巻 初版帯付', author: '尾田栄一郎', publisher: '集英社', volume: '第1巻', seller: 'グランドライン', condition: 'S', flags: { firstEd: true, obi: true, special: false }, base: 16000, trend: 0.2, vol: 0.08 },
];
