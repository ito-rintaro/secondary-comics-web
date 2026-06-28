import type { ConditionFlags } from '../shared/ConditionFlags';

/**
 * 書誌マスタ（Catalog）。Collection / MarketRecord が catalogId で参照する hub。
 * OpenAPI の Catalog スキーマと一致させる。
 * 所有インスタンス固有の情報（condition / qty / cost など）は持たず、
 * 作品そのものの書誌（title / author / ... / flags / imageUrl）だけを表す。
 */
export interface Catalog {
  id: string; // カタログ識別子（システム生成。cat-xxx）
  title: string;
  author: string;
  publisher: string;
  volume: string;
  year: string;
  flags: ConditionFlags;
  imageUrl: string; // S3 オブジェクトキー（空文字可）
}
