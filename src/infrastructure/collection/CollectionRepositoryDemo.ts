import type { CollectionItem } from '../../domain/collection/CollectionItem';
import type { CollectionRepository } from '../../application/collection/ports/CollectionRepository';
import { collectionSeed } from './seed/collectionSeed';

const STORAGE_KEY = 'secondary-comics:collection:v1';

/**
 * デモ実装：localStorage に保存する CollectionRepository。
 * 初回（未保存）は seed を返す。何らかの変更が入った時点で永続化される（デモ挙動を踏襲）。
 * 将来この兄弟として CollectionRepositoryImpl（API）を追加し、DI で差し替える。
 */
export class CollectionRepositoryDemo implements CollectionRepository {
  private read(): CollectionItem[] {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      if (rawValue === null) return [...collectionSeed];
      const data: unknown = JSON.parse(rawValue);
      return Array.isArray(data) ? (data as CollectionItem[]) : [];
    } catch {
      return [];
    }
  }

  private write(items: CollectionItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  async list(): Promise<CollectionItem[]> {
    return this.read();
  }

  async getById(id: string): Promise<CollectionItem | null> {
    return this.read().find((x) => x.id === id) ?? null;
  }

  async save(item: CollectionItem): Promise<void> {
    const items = this.read();
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    this.write(items);
  }

  async delete(id: string): Promise<void> {
    this.write(this.read().filter((x) => x.id !== id));
  }

  async replaceAll(items: CollectionItem[]): Promise<void> {
    this.write(items);
  }
}
