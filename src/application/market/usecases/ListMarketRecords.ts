import type { MarketRecord } from '../../../domain/market/MarketRecord';
import type { MarketRepository } from '../ports/MarketRepository';

/**
 * マーケット出品を全件取得する。
 * 検索/ソートは applyMarketQuery、集計は summarizeMarket で
 * Presentation の派生状態として算出する。
 */
export class ListMarketRecords {
  private readonly repo: MarketRepository;

  constructor(repo: MarketRepository) {
    this.repo = repo;
  }

  async execute(): Promise<MarketRecord[]> {
    return this.repo.list();
  }
}
