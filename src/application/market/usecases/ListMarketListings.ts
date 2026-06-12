import type { MarketListing } from '../../../domain/market/MarketListing';
import type { MarketRepository } from '../ports/MarketRepository';

/**
 * マーケット出品を全件取得する。
 * 検索/ソートは applyMarketQuery、集計は summarizeMarket で
 * Presentation の派生状態として算出する。
 */
export class ListMarketListings {
  private readonly repo: MarketRepository;

  constructor(repo: MarketRepository) {
    this.repo = repo;
  }

  async execute(): Promise<MarketListing[]> {
    return this.repo.list();
  }
}
