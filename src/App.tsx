import { useState } from 'react';
import './App.css';
import { CollectionPage } from './presentation/pages/CollectionPage';
import { MarketPlaceholder } from './presentation/pages/MarketPlaceholder';

type View = 'collection' | 'market';

function App() {
  const [view, setView] = useState<View>('collection');

  return (
    <>
      <header>
        <h1>
          📚 プレミア漫画 <small>コレクション管理</small>
        </h1>
        <nav className="tabs">
          <button
            className={`tab ${view === 'collection' ? 'active' : ''}`}
            onClick={() => setView('collection')}
          >
            マイコレクション
          </button>
          <button
            className={`tab ${view === 'market' ? 'active' : ''}`}
            onClick={() => setView('market')}
          >
            マーケット
          </button>
        </nav>
      </header>

      {view === 'collection' ? <CollectionPage /> : <MarketPlaceholder />}
    </>
  );
}

export default App;
