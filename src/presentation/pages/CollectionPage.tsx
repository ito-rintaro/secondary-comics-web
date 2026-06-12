import { useRef, useState } from 'react';
import type { CollectionItem } from '../../domain/collection/CollectionItem';
import { useCollection } from '../hooks/useCollection';
import { SummaryCards } from '../components/collection/SummaryCards';
import { Toolbar } from '../components/collection/Toolbar';
import { ItemCard } from '../components/collection/ItemCard';
import { ItemFormModal } from '../components/collection/ItemFormModal';

export function CollectionPage() {
  const { query, setQuery, items, summary, total, save, remove, exportAll, importAll } =
    useCollection();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CollectionItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditing(items.find((x) => x.id === id) ?? null);
    setModalOpen(true);
  };

  const handleExport = async () => {
    const items = await exportAll();
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'manga-collection-backup.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImportFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data: unknown = JSON.parse(String(ev.target?.result ?? ''));
        if (!confirm('読み込むと現在のデータは上書きされます。よろしいですか？'))
          return;
        const count = await importAll(data);
        alert(`${count}件を読み込みました。`);
      } catch {
        alert('読み込みに失敗しました。正しいバックアップファイルを選んでください。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="wrap">
      <div className="page-actions">
        <button className="ghost" onClick={() => void handleExport()}>
          バックアップ書出し
        </button>
        <button className="ghost" onClick={() => fileRef.current?.click()}>
          読込み
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            handleImportFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button className="primary" onClick={openAdd}>
          ＋ 作品を登録
        </button>
      </div>

      <SummaryCards summary={summary} />
      <Toolbar query={query} onChange={setQuery} />

      {total === 0 ? (
        <div className="empty">
          まだ作品が登録されていません。「＋ 作品を登録」から追加してください。
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onEdit={openEdit} />
          ))}
        </div>
      )}

      {modalOpen && (
        <ItemFormModal
          key={editing?.id ?? 'new'}
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSave={save}
          onDelete={remove}
        />
      )}
    </div>
  );
}
