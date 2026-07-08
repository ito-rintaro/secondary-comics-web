import type { MarketSummary } from '../../../domain/market/MarketSummary';
import type { MarketRepository } from '../ports/MarketRepository';

/**
 * catalog 単位の相場サマリを全件取得する。
 * 検索/ソートは applyMarketQuery、概況集計は summarizeMarket で
 * Presentation の派生状態として算出する。
 */
export class ListMarketSummaries {
  private readonly repo: MarketRepository;

  constructor(repo: MarketRepository) {
    this.repo = repo;
  }

  async execute(): Promise<MarketSummary[]> {
    return this.repo.listSummaries();
  }
}
