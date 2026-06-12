import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import type { Condition } from '../../../domain/collection/Condition';
import { ValidationError } from '../errors';
import type { CollectionRepository } from '../ports/CollectionRepository';

const toCondition = (raw: unknown): Condition => {
  const s = String(raw ?? '').charAt(0).toUpperCase();
  return s === 'S' || s === 'A' || s === 'B' || s === 'C' ? s : 'A';
};

const num = (raw: unknown, fallback = 0): number => {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

const str = (raw: unknown): string => (raw == null ? '' : String(raw));

/**
 * 取り込んだ生データ1件をドメイン形に正規化。
 * 本アプリのエクスポート形に加え、デモの平坦な旧形（firstEd/obi/special が直下、
 * condition が 'A（良い）' 形式、image=dataURL）も許容する（FR-C3）。
 */
const normalize = (raw: Record<string, unknown>, index: number): CollectionItem => {
  const flags = (raw.flags as Record<string, unknown> | undefined) ?? raw;
  return {
    id: str(raw.id) || `import-${Date.now().toString(36)}-${index}`,
    title: str(raw.title),
    author: str(raw.author),
    publisher: str(raw.publisher),
    volume: str(raw.volume),
    year: str(raw.year),
    condition: toCondition(raw.condition),
    qty: Math.max(1, num(raw.qty, 1)),
    cost: num(raw.cost),
    market: num(raw.market),
    marketSource: 'manual',
    flags: {
      firstEd: Boolean(flags.firstEd),
      obi: Boolean(flags.obi),
      special: Boolean(flags.special),
    },
    purchaseDate: str(raw.purchaseDate ?? raw.date),
    store: str(raw.store),
    location: str(raw.location),
    memo: str(raw.memo),
    imageUrl: str(raw.imageUrl ?? raw.image),
    updatedAt: num(raw.updatedAt ?? raw.updated, Date.now()),
  };
};

/** JSON 読込（全置換）。デモJSONの取込にも対応（FR-A7 / FR-C3）。 */
export class ImportCollection {
  private readonly repo: CollectionRepository;

  constructor(repo: CollectionRepository) {
    this.repo = repo;
  }

  async execute(data: unknown): Promise<number> {
    if (!Array.isArray(data)) {
      throw new ValidationError('正しいバックアップファイル（配列）ではありません');
    }
    const items = data.map((raw, i) =>
      normalize((raw ?? {}) as Record<string, unknown>, i),
    );
    await this.repo.replaceAll(items);
    return items.length;
  }
}
