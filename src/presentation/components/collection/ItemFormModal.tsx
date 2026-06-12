import { useState } from 'react';
import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import { CONDITIONS, CONDITION_LABELS } from '../../../domain/collection/Condition';
import type { CollectionItemInput } from '../../../application/collection/dto/CollectionItemInput';
import { resizeImageToDataUrl } from '../../../infrastructure/image/CanvasImageResizer';
import { Modal } from '../common/Modal';

interface ItemFormModalProps {
  /** 編集対象。null なら新規登録。親は key で再マウントして初期化する。 */
  editing: CollectionItem | null;
  onClose: () => void;
  onSave: (input: CollectionItemInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyInput = (): CollectionItemInput => ({
  title: '',
  author: '',
  publisher: '',
  volume: '',
  year: '',
  condition: 'A',
  qty: 1,
  cost: 0,
  market: 0,
  purchaseDate: '',
  store: '',
  location: '',
  firstEd: false,
  obi: false,
  special: false,
  memo: '',
  imageUrl: '',
});

const toInput = (item: CollectionItem): CollectionItemInput => ({
  id: item.id,
  title: item.title,
  author: item.author,
  publisher: item.publisher,
  volume: item.volume,
  year: item.year,
  condition: item.condition,
  qty: item.qty,
  cost: item.cost,
  market: item.market,
  purchaseDate: item.purchaseDate,
  store: item.store,
  location: item.location,
  firstEd: item.flags.firstEd,
  obi: item.flags.obi,
  special: item.flags.special,
  memo: item.memo,
  imageUrl: item.imageUrl,
});

export function ItemFormModal({
  editing,
  onClose,
  onSave,
  onDelete,
}: ItemFormModalProps) {
  const [form, setForm] = useState<CollectionItemInput>(() =>
    editing ? toInput(editing) : emptyInput(),
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof CollectionItemInput>(
    key: K,
    value: CollectionItemInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const onPickImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      set('imageUrl', await resizeImageToDataUrl(file));
    } catch {
      setError('画像の取り込みに失敗しました');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    setBusy(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存に失敗しました');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (!confirm('この作品を削除しますか？')) return;
    setBusy(true);
    try {
      await onDelete(form.id);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <h2>{editing ? '作品を編集' : '作品を登録'}</h2>
      <div className="form-grid">
        <div className="full">
          <label className="field">タイトル＊</label>
          <input
            value={form.title}
            placeholder="例）AKIRA 全6巻 初版帯付セット"
            onChange={(e) => set('title', e.target.value)}
          />
        </div>
        <div>
          <label className="field">著者</label>
          <input
            value={form.author}
            placeholder="大友克洋"
            onChange={(e) => set('author', e.target.value)}
          />
        </div>
        <div>
          <label className="field">出版社 / レーベル</label>
          <input
            value={form.publisher}
            placeholder="講談社 / KCデラックス"
            onChange={(e) => set('publisher', e.target.value)}
          />
        </div>
        <div>
          <label className="field">巻数 / セット</label>
          <input
            value={form.volume}
            placeholder="全6巻 / 第1巻 など"
            onChange={(e) => set('volume', e.target.value)}
          />
        </div>
        <div>
          <label className="field">発行年</label>
          <input
            value={form.year}
            placeholder="1984"
            onChange={(e) => set('year', e.target.value)}
          />
        </div>
        <div>
          <label className="field">コンディション</label>
          <select
            value={form.condition}
            onChange={(e) =>
              set('condition', e.target.value as CollectionItemInput['condition'])
            }
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
          <label className="field">現在相場（1点）</label>
          <input
            type="number"
            min={0}
            value={form.market}
            onChange={(e) => set('market', Number(e.target.value))}
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
          <label className="field">状態フラグ</label>
          <div className="row-checks">
            <label>
              <input
                type="checkbox"
                checked={form.firstEd}
                onChange={(e) => set('firstEd', e.target.checked)}
              />{' '}
              初版
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.obi}
                onChange={(e) => set('obi', e.target.checked)}
              />{' '}
              帯付き
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.special}
                onChange={(e) => set('special', e.target.checked)}
              />{' '}
              特装版 / サイン本
            </label>
          </div>
        </div>
        <div className="full">
          <label className="field">写真</label>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {form.imageUrl && (
              <img className="thumb-preview" src={form.imageUrl} alt="" />
            )}
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void onPickImage(e.target.files?.[0])}
              />
              <div className="hint">
                画像はブラウザ内に保存されます。容量節約のため自動で縮小されます。
              </div>
              {form.imageUrl && (
                <button
                  type="button"
                  className="ghost"
                  style={{ marginTop: 8 }}
                  onClick={() => set('imageUrl', '')}
                >
                  写真を削除
                </button>
              )}
            </div>
          </div>
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

      {error && <div className="form-error">{error}</div>}

      <div className="modal-actions">
        {editing && (
          <button
            className="ghost danger"
            disabled={busy}
            onClick={() => void handleDelete()}
          >
            削除
          </button>
        )}
        <div className="grow" />
        <button className="ghost" disabled={busy} onClick={onClose}>
          キャンセル
        </button>
        <button className="primary" disabled={busy} onClick={() => void handleSave()}>
          保存
        </button>
      </div>
    </Modal>
  );
}
