import { useMemo, useState } from 'react';
import type { Catalog } from '../../../domain/catalog/Catalog';
import type { Condition } from '../../../domain/collection/Condition';
import { CONDITIONS, CONDITION_LABELS } from '../../../domain/collection/Condition';
import type { NewCollectionInput } from '../../../application/collection/dto/NewCollectionInput';
import { useCatalogs } from '../../hooks/useCatalogs';
import { resolveImageSrc } from '../../imageSrc';
import { Modal } from '../common/Modal';

interface CreateItemModalProps {
  onClose: () => void;
  onCreate: (input: NewCollectionInput) => Promise<void>;
}

/**
 * 所有インスタンス固有の入力（書誌は選択した Catalog 由来）。
 * 相場（market / marketSource）はマーケットからサーバが導出するため入力しない。
 */
interface OwnerForm {
  condition: Condition;
  qty: number;
  cost: number;
  purchaseDate: string;
  store: string;
  location: string;
  memo: string;
}

const emptyOwnerForm = (): OwnerForm => ({
  condition: 'A',
  qty: 1,
  cost: 0,
  purchaseDate: '',
  store: '',
  location: '',
  memo: '',
});

/** カタログを検索クエリで絞り込む（タイトル / 著者 / 出版社 / 巻数）。 */
const matches = (catalog: Catalog, q: string): boolean => {
  if (!q) return true;
  const haystack = [
    catalog.title,
    catalog.author,
    catalog.publisher,
    catalog.volume,
    catalog.year,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
};

/**
 * 新規作成モーダル（POST /collection）。
 * 書誌は GET /catalogs から取得した Catalog を検索・選択して catalogId で参照し、
 * ユーザーは所有インスタンス固有の情報（condition / qty / cost ...）だけを入力する。
 */
export function CreateItemModal({ onClose, onCreate }: CreateItemModalProps) {
  const { catalogs, loading, error: loadError, reload } = useCatalogs();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState<OwnerForm>(emptyOwnerForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () => catalogs.filter((c) => matches(c, search.trim())),
    [catalogs, search],
  );
  const selected = useMemo(
    () => catalogs.find((c) => c.id === selectedId) ?? null,
    [catalogs, selectedId],
  );

  const set = <K extends keyof OwnerForm>(key: K, value: OwnerForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!selected) {
      setError('カタログを選択してください');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onCreate({
        catalogId: selected.id,
        condition: form.condition,
        qty: Math.max(1, Number(form.qty) || 1),
        cost: Math.max(0, Number(form.cost) || 0),
        purchaseDate: form.purchaseDate,
        store: form.store.trim(),
        location: form.location.trim(),
        memo: form.memo.trim(),
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '登録に失敗しました');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <h2>作品を登録</h2>

      {loading ? (
        <div className="empty">カタログを読み込み中…</div>
      ) : loadError ? (
        <div className="empty">
          {loadError}
          <div style={{ marginTop: 12 }}>
            <button className="ghost" onClick={() => void reload()}>
              再読み込み
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="field-block">
            <label className="field">カタログ（書誌）を選択＊</label>
            <input
              value={search}
              placeholder="タイトル・著者・出版社で検索"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="catalog-picker">
              {filtered.length === 0 ? (
                <div className="catalog-empty">
                  該当するカタログがありません。
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`catalog-option${
                      c.id === selectedId ? ' selected' : ''
                    }`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <CatalogThumb catalog={c} />
                    <span className="catalog-info">
                      <span className="catalog-title">{c.title}</span>
                      <span className="catalog-meta">
                        {[c.author, c.volume, c.publisher, c.year]
                          .filter(Boolean)
                          .join(' ・ ') || '—'}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {selected && (
            <div className="form-grid" style={{ marginTop: 18 }}>
              <div>
                <label className="field">コンディション＊</label>
                <select
                  value={form.condition}
                  onChange={(e) => set('condition', e.target.value as Condition)}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {CONDITION_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field">所有数</label>
                <input
                  type="number"
                  min={1}
                  value={form.qty}
                  onChange={(e) => set('qty', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="field">取得価格（1点）</label>
                <input
                  type="number"
                  min={0}
                  value={form.cost}
                  onChange={(e) => set('cost', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="field">購入日</label>
                <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) => set('purchaseDate', e.target.value)}
                />
              </div>
              <div>
                <label className="field">購入店舗 / 経路</label>
                <input
                  value={form.store}
                  placeholder="まんだらけ / メルカリ など"
                  onChange={(e) => set('store', e.target.value)}
                />
              </div>
              <div>
                <label className="field">保管場所</label>
                <input
                  value={form.location}
                  placeholder="本棚A / 防湿庫 など"
                  onChange={(e) => set('location', e.target.value)}
                />
              </div>
              <div className="full">
                <label className="field">メモ</label>
                <textarea
                  rows={2}
                  value={form.memo}
                  placeholder="傷の場所、付属物、購入時のメモなど"
                  onChange={(e) => set('memo', e.target.value)}
                />
              </div>
            </div>
          )}
        </>
      )}

      {error && <div className="form-error">{error}</div>}

      <div className="modal-actions">
        <div className="grow" />
        <button className="ghost" disabled={busy} onClick={onClose}>
          キャンセル
        </button>
        <button
          className="primary"
          disabled={busy || loading || !selected}
          onClick={() => void handleSave()}
        >
          登録
        </button>
      </div>
    </Modal>
  );
}

/** カタログ候補のサムネイル（画像が無ければプレースホルダ）。 */
function CatalogThumb({ catalog }: { catalog: Catalog }) {
  const [broken, setBroken] = useState(false);
  const src = resolveImageSrc(catalog.imageUrl);
  if (src && !broken) {
    return (
      <img
        className="catalog-thumb"
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  }
  return <span className="catalog-thumb ph">📖</span>;
}
