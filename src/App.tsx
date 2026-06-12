import { useState } from 'react';
import './App.css';
import { AuthGate } from './presentation/auth/AuthGate';
import { CollectionPage } from './presentation/pages/CollectionPage';
import { MarketPage } from './presentation/pages/MarketPage';

type View = 'collection' | 'market';

function App() {
  const [view, setView] = useState<View>('collection');

  return (
    <AuthGate>
      {({ username, signOut }) => (
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
            <div className="user-menu">
              <span className="user-name">{username}</span>
              <button className="logout" onClick={signOut}>
                ログアウト
              </button>
            </div>
          </header>

          {view === 'collection' ? <CollectionPage /> : <MarketPage />}
        </>
      )}
    </AuthGate>
  );
}

export default App;
