# アーキテクチャ設計（React + TypeScript / クリーンアーキテクチャ）

本書は、デモ（[../docs_for_input/index.html](../docs_for_input/index.html)）を **React.js + TypeScript** で本番実装し直すにあたっての技術設計をまとめる。
要件は [../docs_for_input/](../docs_for_input/) を参照。MVP（フェーズ1）の範囲は [02_scope_mvp.md](../docs_for_input/02_scope_mvp.md) に従う。

> **前提**：バックエンドは段階的に接続中。コレクション取得（`GET /collection`）・**コレクション新規登録（`POST /collection`）**・カタログ取得（`GET /catalogs`）・マーケット相場取得（`GET /market`）は実 API に接続済み（`VITE_USE_API=true`）。
> 残りの書き込み系（編集・削除・インポート）はまだ**ダミーデータ**（localStorage）で動かす。
> 新規登録は書誌マスタ（Catalog）を `catalogId` で参照する設計のため、カタログ基盤を持つ**実 API モード専用**（Demo は `NotImplementedError`）。
> 「画面・ロジックを変えずにバックエンドへ差し替える」ことを最初から織り込んだ構造にする。それを担保するのがクリーンアーキテクチャ。
> API 仕様は [openapi.yaml](openapi.yaml)（OpenAPI 3.0）に定義する。

---

## 1. 設計目標

| 目標 | 手段 |
|---|---|
| バックエンドができたら**画面・ロジックを変えずに**差し替えたい | データ取得を **Repository インターフェース**で抽象化し、実装（ダミー / API）を外側に置く |
| ビジネスルール（含み損益・サマリー集計・フィルタ）を**UIから独立**させたい | Domain / Application 層に隔離し、React に依存させない |
| 段階移行（[02_scope_mvp.md](../docs_for_input/02_scope_mvp.md) の「破壊的にしない」方針）に乗りたい | localStorage実装 → API実装の置換を **DI（依存性注入）** で1点変更にする |
| テストしやすさ | Domain / Application は React・DOM・fetch に非依存 → 純粋な単体テストが可能 |

---

## 2. レイヤー構成と依存方向

クリーンアーキテクチャの核心は **「依存は常に内向き（外→内）」** という一方向ルール。
外側（UI・DB・API）は内側（ビジネスルール）に依存してよいが、**内側は外側を一切知らない**。

```
        ┌─────────────────────────────────────────────┐
        │  Presentation（React / UI）                  │  ← 一番外側
        │   components / pages / hooks / providers     │
        └───────────────────┬─────────────────────────┘
                            │ 呼ぶ（依存）
        ┌───────────────────▼─────────────────────────┐
        │  Application（ユースケース）                  │
        │   use-cases / DTO / port(repository interface)│
        └───────────────────┬─────────────────────────┘
                            │ 依存
        ┌───────────────────▼─────────────────────────┐
        │  Domain（エンティティ / 値オブジェクト）       │  ← 一番内側（何にも依存しない）
        │   entities / value-objects / domain-services  │
        └───────────────────▲─────────────────────────┘
                            │ implements（インターフェースを実装）
        ┌───────────────────┴─────────────────────────┐
        │  Infrastructure（DB / API / 外部I/O）         │  ← 外側
        │   RepositoryDemo（今） /（将来）RepositoryImpl │
        └─────────────────────────────────────────────┘
```

ポイント：
- **Infrastructure は Domain を「実装」する**（依存の矢印が内向き）。Repository の*インターフェース*は内側（Application）に、*実装*は外側（Infrastructure）に置く。これが「依存性逆転（DIP）」。
- だから `CollectionRepositoryDemo` を `CollectionRepositoryImpl` に差し替えても、Application より内側は1行も変わらない。

### 各層の責務

| 層 | 役割 | 依存してよいもの | やってはいけないこと |
|---|---|---|---|
| **Domain** | ビジネスの概念とルール（含み損益、コンディション、版） | なし（純TS） | React/fetch/localStorage に触れる |
| **Application** | ユースケース（登録する・一覧を出す・集計する）。Repositoryの*窓口（port）*を定義 | Domain のみ | 具体的なDB/APIを知る |
| **Infrastructure** | Repositoryの*実装*、外部I/O、永続化、ダミーデータ、画像縮小 | Domain / Application(port) | UIの都合を持ち込む |
| **Presentation** | React描画、入力、状態管理、DI配線 | Application / Domain（型） | ビジネスルールを直書きする |

---

## 3. ディレクトリ構成

```
src/
├─ domain/                         # ── 内側：純粋なビジネス（React非依存）
│  ├─ shared/                      # ✅共有カーネル（collection/market 双方が使う値オブジェクト）
│  │  ├─ Condition.ts              # 値オブジェクト（S/A/B/C）+ ラベル
│  │  └─ ConditionFlags.ts         # 初版/帯/特装
│  ├─ collection/                  # ✅実装済み
│  │  ├─ CollectionItem.ts         # エンティティ
│  │  ├─ Condition.ts              # shared/Condition の再エクスポート（互換用）
│  │  ├─ ConditionFlags.ts         # shared/ConditionFlags の再エクスポート（互換用）
│  │  ├─ ProfitLoss.ts             # 含み損益・評価額・取得額（ドメインサービス）
│  │  └─ CollectionSummary.ts      # サマリー集計（summarize）
│  ├─ catalog/                     # ✅実装済み（書誌マスタ）
│  │  └─ Catalog.ts                # エンティティ（CollectionItem が catalogId で参照する hub）
│  └─ market/                      # ✅実装済み
│     ├─ MarketRecord.ts           # 出品/相場（エンティティ）
│     ├─ PriceHistory.ts           # 価格推移の集計（現在/最安/最高）
│     ├─ Trend.ts                  # 変化率（changeRate）
│     └─ MarketSummary.ts          # マーケット集計（summarizeMarket）
│  # 注: 金額の表示整形（¥書式）はビジネスではなく表示の関心事 → presentation/format.ts に置く
│
├─ application/                    # ── ユースケース層
│  ├─ collection/                  # ✅実装済み
│  │  ├─ ports/
│  │  │  └─ CollectionRepository.ts   # ★インターフェース（境界）
│  │  ├─ dto/
│  │  │  ├─ CollectionItemInput.ts    # フォーム入力DTO（編集用・全書誌を平坦化）
│  │  │  ├─ NewCollectionInput.ts     # ✅新規登録DTO（catalogId+condition必須・POST /collection）
│  │  │  └─ CollectionQuery.ts        # 検索/フィルタ/ソート条件 + 既定値
│  │  ├─ applyCollectionQuery.ts      # 検索・フィルタ・ソートの純関数
│  │  ├─ toCollectionItem.ts          # 入力DTO → エンティティ変換（検証前段）
│  │  ├─ errors.ts                    # ValidationError / NotImplementedError（API未提供の操作）
│  │  └─ usecases/
│  │     ├─ ListCollection.ts         # 全件取得（フィルタ/集計は派生で算出）
│  │     ├─ CreateCollectionItem.ts   # ✅新規登録（catalogId参照・POST /collection）
│  │     ├─ SaveCollectionItem.ts     # 編集（upsert）
│  │     ├─ DeleteCollectionItem.ts
│  │     ├─ ExportCollection.ts        # JSON書出し（FR-A7）
│  │     └─ ImportCollection.ts        # JSON読込・旧デモ形も許容（FR-A7 / C3）
│  ├─ catalog/                     # ✅実装済み（書誌マスタ取得）
│  │  ├─ ports/
│  │  │  └─ CatalogRepository.ts       # ★インターフェース（list のみ）
│  │  └─ usecases/
│  │     └─ ListCatalogs.ts            # 全件取得（新規登録モーダルの catalogId 選択用）
│  └─ market/                      # ✅実装済み
│     ├─ ports/
│     │  └─ MarketRepository.ts        # ★インターフェース（list のみ）
│     ├─ dto/
│     │  └─ MarketQuery.ts             # 検索/ソート条件 + 既定値
│     ├─ applyMarketQuery.ts           # 検索・ソートの純関数
│     └─ usecases/
│        └─ ListMarketRecords.ts       # 全件取得（詳細は読込済みリストから選択）
│
├─ infrastructure/                 # ── 外側：実装の差し替え点
│  ├─ collection/                  # ✅実装済み
│  │  ├─ CollectionRepositoryDemo.ts   # デモ実装（localStorage）。VITE_USE_API=false 時
│  │  ├─ CollectionRepositoryImpl.ts   # ✅API実装。GET /collection（取得）+ POST /collection（登録）。編集/削除はAPI提供待ち
│  │  └─ seed/collectionSeed.ts        # デモのSEED相当（8件）
│  ├─ catalog/                     # ✅実装済み
│  │  ├─ CatalogRepositoryImpl.ts      # ✅API実装。GET /catalogs（書誌マスタ・グローバル）
│  │  └─ CatalogRepositoryDemo.ts      # デモは未対応（NotImplementedError・新規登録はAPIモード専用）
│  ├─ image/                       # ✅実装済み
│  │  └─ CanvasImageResizer.ts         # 画像縮小（600px/JPEG0.8）
│  ├─ market/                      # ✅実装済み
│  │  ├─ MarketRepositoryDemo.ts       # 擬似生成（genHistory相当）。構築時に一度生成しキャッシュ
│  │  ├─ MarketRepositoryImpl.ts       # ✅API実装。GET /market（全件取得・グローバル）
│  │  ├─ prng.ts                       # シード固定の擬似乱数（mulberry32）でチャート安定化
│  │  └─ seed/marketSeed.ts            # デモのMARKET相当（12件）
│  └─ http/                        # ✅実装済み
│     └─ apiClient.ts                  # 認証付きfetch（apiGet/apiPost・CognitoのIDトークン付与）+ ApiError
│
├─ presentation/                   # ── React
│  ├─ format.ts                    # ✅表示整形（¥書式・損益/変化率クラス・%整形）
│  ├─ imageSrc.ts                  # ✅画像src解決（S3キー→CloudFront images/前置、空はプレースホルダ）
│  ├─ auth/                         # ✅認証UI（Cognito/Amplify）
│  │  ├─ AuthGate.tsx               # 未ログインならサインイン画面、ログイン済みのみ本体描画
│  │  └─ authTheme.ts               # Authenticator のダークテーマ化＋日本語化
│  ├─ hooks/
│  │  ├─ useCollection.ts           # ✅container経由でuse-caseを呼ぶ薄い適合層（loading/error/reload/create付き）
│  │  ├─ useCatalogs.ts             # ✅新規登録モーダル用のカタログ読込（GET /catalogs）
│  │  └─ useMarket.ts               # ✅同上（マーケット）
│  ├─ pages/
│  │  ├─ CollectionPage.tsx         # ✅
│  │  └─ MarketPage.tsx             # ✅
│  ├─ components/
│  │  ├─ collection/                # ✅SummaryCards, Toolbar, ItemCard, ItemFormModal(編集), CreateItemModal(新規登録)
│  │  ├─ market/                    # ✅MarketSummaryCards, MarketToolbar, MarketCard,
│  │  │                             #    MarketDetailModal, Sparkline(SVG), avatar
│  │  └─ common/                    # ✅Modal（将来 Badge, Button …）
│  └─ App.tsx                       # ✅タブ切替（switchView相当）
│  # DIは config/container.ts を直接 import（Provider化は規模拡大時に検討）
│
├─ config/
│  ├─ container.ts                  # ✅Composition Root（use-case配線・実装選択）
│  └─ amplify.ts                    # ✅Amplify(Cognito)初期化。main.tsxで起動時に1回読込
├─ vite-env.d.ts                    # ✅import.meta.env.VITE_* の型定義（VITE_USE_API / VITE_IMAGE_BASE_URL 等）
└─ main.tsx
```

> 各層を**フォルダで物理的に分離**する。`import` の向きが「外→内」に限定されるよう、ESLint（`eslint-plugin-boundaries` 等）でレイヤー間の依存ルールを機械的に強制する（後述 §9）。

---

## 4. 技術スタック

| レイヤー | 採用 | 理由 |
|---|---|---|
| 言語 | **TypeScript**（strict） | 要件どおり。ドメインモデルの安全性 |
| UI | **React 18+**（関数コンポーネント + Hooks） | 要件どおり |
| ビルド | **Vite** | 単一HTMLのデモから移行しやすく高速。低コスト（NFR-9） |
| ルーティング | React Router（タブ2画面なので最小構成、将来⑤⑥画面で拡張） | [06_screens.md](../docs_for_input/06_screens.md) の画面遷移 |
| サーバ状態 | 当面は use-case + hooks で自前管理。**将来 TanStack Query** を Presentation 層に導入してAPI差し替え時のキャッシュ/再取得を担当 | ドメインには侵食させない |
| テスト | **Vitest**（Domain/Application）＋ React Testing Library（Presentation） | 内側は純TSなので高速にユニットテスト可 |
| 整形/静的解析 | ESLint + Prettier + import境界ルール | レイヤー依存の逆流を防止 |
| スタイル | CSS変数（デモの `--bg/--accent/--plus/--minus` を継承） + CSS Modules | [06_screens.md](../docs_for_input/06_screens.md) のダークテーマ踏襲 |

> バックエンド言語・DB・認証は [05_architecture.md](../docs_for_input/05_architecture.md) のとおり**未確定でよい**。本フロント設計は、その確定を待たずに進められる（Repositoryの裏に隠れているため）。

---

## 5. ドメインモデル（デモからの写像）

デモの平坦な `item` / `MARKET` オブジェクトを、型付きドメインに引き上げる。データ定義は [03_data_model.md](../docs_for_input/03_data_model.md) に準拠。

### CollectionItem（エンティティ）
```ts
// domain/collection/CollectionItem.ts
export interface CollectionItem {
  id: string;
  title: string;            // 必須
  author: string;
  publisher: string;
  volume: string;
  year: string;
  condition: Condition;             // 'S' | 'A' | 'B' | 'C'
  qty: number;                      // >= 1
  cost: number;                     // 取得価格（1点・円）
  market: number;                   // 現在相場（1点・円）
  marketSource: 'manual' | 'auto' | 'estimate'; // 03_data_model の market_source
  flags: ConditionFlags;            // { firstEd; obi; special }
  purchaseDate: string;             // YYYY-MM-DD
  store: string;
  location: string;
  memo: string;
  imageUrl: string;                 // S3オブジェクトキー（CloudFront images/配下）。空は画像なし
  updatedAt: number;
}
```

### ビジネスルール（UIから隔離）
デモで `render()`/`renderSummary()` に直書きされていた計算を、ドメインへ移す。

```ts
// domain/collection/ProfitLoss.ts
export const profitLoss = (it: CollectionItem) => (it.market - it.cost) * it.qty;
export const evaluation = (it: CollectionItem) => it.market * it.qty;

// domain/collection/CollectionSummary.ts
export interface CollectionSummary { count: number; totalCost: number; totalValue: number; pl: number; }
export const summarize = (items: CollectionItem[]): CollectionSummary => { /* デモの集計を移植 */ };
```

> `含み損益 = (market - cost) * qty`、`評価額 = market * qty`（[03_data_model.md](../docs_for_input/03_data_model.md) 準拠）。
> **検索・フィルタ・ソート**（デモ `render()` 内）は純関数 `applyCollectionQuery(items, query)`（application層）に移し、`CollectionQuery`（検索語・フィルタ種別・ソート種別）を入力に取る。Presentation では `useMemo` で派生状態として算出する。

### Market（相場）
デモの `genHistory(base, trend, vol)` による擬似生成は **Infrastructure（MarketRepositoryDemo）の責務**。Domain は「価格推移」「変化率」「最安/最高」という*概念*だけを持ち、生成方法は知らない。

```ts
// domain/market/MarketRecord.ts
export interface MarketRecord {
  id: string; title: string; author: string; publisher: string; volume: string;
  seller: string; condition: Condition; flags: ConditionFlags;
  price: number; history: number[]; change: number;  // 12ヶ月・変化率
}
```

---

## 6. 境界（Repository）— ダミー↔本番の差し替え点

ここが本設計の**最重要ポイント**。「今はダミー、あとでバックエンド」を成立させる仕組み。

```ts
// application/collection/ports/CollectionRepository.ts
export interface CollectionRepository {
  list(): Promise<CollectionItem[]>;              // 全件取得（フィルタは適用しない）
  getById(id: string): Promise<CollectionItem | null>;
  create(input: NewCollectionInput): Promise<CollectionItem>; // 新規登録（catalogId参照・POST /collection）
  save(item: CollectionItem): Promise<void>;     // 編集（upsert）
  delete(id: string): Promise<void>;
  replaceAll(items: CollectionItem[]): Promise<void>; // import用
}
```

- **戻り値はすべて `Promise`**。今は同期的なlocalStorageでも、将来の非同期APIでもシグネチャが変わらないようにするため。
- **`list()` はクエリを取らず全件返す**。検索/フィルタ/ソートは純関数 `applyCollectionQuery`、集計は `summarize` で **Presentation の派生状態**として算出する（毎キーストロークでの再読込を避ける）。将来サーバ側フィルタが必要になったら、その時点で `list(query)` に拡張する。
- **`create()` は書誌マスタ参照型**。書誌（title/author/…/imageUrl）は `catalogId` で既存 Catalog を参照し、本文には所有インスタンス固有の情報（condition/qty/cost…）だけを渡す（`id`/`updatedAt` はサーバ採番、`imageUrl` はカタログ由来）。サーバは Catalog を合成した enriched な `CollectionItem` を 201 で返す。`catalogId` 取得のため `CatalogRepository.list()`（`GET /catalogs`）が必要。これに対し `save()`（編集）は全書誌を平坦に持つ既存の upsert で、入力 DTO の系統が異なる。
- ユースケースはこのインターフェースだけに依存する：

```ts
// application/collection/usecases/SaveCollectionItem.ts（登録・編集 upsert）
export class SaveCollectionItem {
  private readonly repo: CollectionRepository;
  constructor(repo: CollectionRepository) { this.repo = repo; } // ※下記の注を参照
  async execute(input: CollectionItemInput): Promise<CollectionItem> {
    if (!input.title.trim()) throw new ValidationError('タイトルを入力してください');
    const item = toCollectionItem(input);   // 検証後にドメイン化
    await this.repo.save(item);
    return item;
  }
}
```

> **TS設定の注意（erasableSyntaxOnly）**：tsconfig で `erasableSyntaxOnly: true` のため、コンストラクタの **parameter properties（`constructor(private readonly repo: ...)`）は使えない**（実行コードを生成する構文のため）。上記のようにフィールドを明示宣言して代入する。`enum` も不可（union型を使用）。

### 実装の切り替え（DI）
```ts
// config/container.ts（Composition Root）— 実装済みの分岐
const collectionRepository: CollectionRepository =
  import.meta.env.VITE_USE_API === 'true'
    ? new CollectionRepositoryImpl()   // 実API（GET /collection）
    : new CollectionRepositoryDemo();  // デモ（localStorage）

export const collectionUseCases = {
  list:      new ListCollection(collectionRepository),
  create:    new CreateCollectionItem(collectionRepository), // 新規登録（POST /collection）
  save:      new SaveCollectionItem(collectionRepository),
  remove:    new DeleteCollectionItem(collectionRepository),
  exportAll: new ExportCollection(collectionRepository),
  importAll: new ImportCollection(collectionRepository),
};

const catalogRepository: CatalogRepository =
  import.meta.env.VITE_USE_API === 'true'
    ? new CatalogRepositoryImpl()  // 実API（GET /catalogs・グローバル）
    : new CatalogRepositoryDemo(); // デモ未対応（NotImplementedError）

export const catalogUseCases = {
  list: new ListCatalogs(catalogRepository),
};

const marketRepository: MarketRepository =
  import.meta.env.VITE_USE_API === 'true'
    ? new MarketRepositoryImpl()   // 実API（GET /market・グローバル）
    : new MarketRepositoryDemo();  // 擬似生成（genHistory）
```

→ **バックエンド接続で触るのは、この `container.ts` の分岐と各 `RepositoryImpl`（＋ `infrastructure/http/apiClient`）だけ**。Presentation / Application / Domain は無改修。これが [05_architecture.md](../docs_for_input/05_architecture.md) の「破壊的にしない移行ステップ」をコードで保証する。

> **現状の連携範囲**：バックエンドは `GET /collection`・`POST /collection`・`GET /catalogs`・`GET /market` を提供。`CollectionRepositoryImpl` は `list()` と `create()`（`apiPost`）を実装し、`getById()` は一覧から導出する。残りの書き込み系（`save`(編集)/`delete`/`replaceAll`）は対応 API 提供までは `NotImplementedError` を投げ、メッセージを UI に表示する。新規登録は `CatalogRepositoryImpl.list()`（`GET /catalogs`）でカタログを取得し、`CreateItemModal` でカタログを検索・選択して `catalogId` を決める。カタログ基盤は実 API 側にしか無いため、Demo の `create()`／`CatalogRepositoryDemo.list()` は `NotImplementedError`（新規登録は実 API モード専用）。`userId` はリクエストに含めず、`apiClient` が付与する Cognito の **ID トークン**の `sub` でサーバー側が本人データに絞り込む。マーケットとカタログは本人データではなく**全ユーザー共通（グローバル）**のため `sub` での絞り込みはしない。

### 実装クラスの命名規則
同じ port（interface）に対する実装は、**末尾サフィックスで実/デモを区別**する。技術名（localStorage/API）は名前に入れない。

| 対象 | port（interface） | デモ実装 | 実実装（API） |
|---|---|---|---|
| コレクション | `CollectionRepository` | `CollectionRepositoryDemo` | `CollectionRepositoryImpl`（✅取得・新規登録） |
| カタログ | `CatalogRepository` | `CatalogRepositoryDemo`（未対応） | `CatalogRepositoryImpl`（✅取得） |
| 相場 | `MarketRepository` | `MarketRepositoryDemo` | `MarketRepositoryImpl`（✅取得） |

- **`...Demo`** … ダミーデータで動く実装（localStorage / 擬似生成）。`VITE_USE_API=false` 時に使う。
- **`...Impl`** … バックエンド接続の本実装。取得（GET）は両者とも実装済み。
- ファイル名＝クラス名（`CollectionRepositoryDemo.ts`）。`Demo`/`Impl` を見れば実/デモが一目で判別できる。

---

## 7. ダミーデータ戦略（現フェーズ）

| 対象 | ダミー実装 | デモ由来 | 将来 |
|---|---|---|---|
| コレクション | `CollectionRepositoryDemo`（初回は `collectionSeed` を投入） | `STORAGE_KEY`/`SEED`/`load`/`save` | `CollectionRepositoryImpl` |
| 相場 | `MarketRepositoryDemo`（`genHistory` で12点生成） | `MARKET`/`genHistory` | `MarketRepositoryImpl`（✅`GET /market`。集計ロジックは [04_market_data.md](../docs_for_input/04_market_data.md) 決定後にサーバー側で） |
| 画像 | `CanvasImageResizer`（600px/JPEG0.8 → dataURL） | `handleImage` | ✅取得は実装済み（APIが返すS3キーを `imageSrc.ts` でCloudFront URLに解決）。アップロードは今後 |

- 相場は [02_scope_mvp.md](../docs_for_input/02_scope_mvp.md) のとおり **MVPは `marketSource='manual'`（手入力）** が基本。`MarketRepositoryDemo` のチャートは「マーケット画面のUI確認用」と割り切り、`marketSource` フィールドで出所を区別できるようにしておく。
- **乱数の扱い（実装済み）**：デモの `genHistory` は `Math.random()` を使っていたが、本実装では**シード固定の擬似乱数（mulberry32, `infrastructure/market/prng.ts`）**に置き換えた。これにより**リロードしてもチャートが安定**し、テストも再現可能。生成は `MarketRepositoryDemo` の構築時に一度だけ行いキャッシュする（`list` 呼び出し間で一貫）。

---

## 8. データフロー（例：作品を新規登録する）

書誌は `GET /catalogs` から取得した Catalog を `CreateItemModal` で検索・選択し、`catalogId` で参照する。

```
[CreateItemModal] ──onCreate(input)──▶ useCollection.create(input)   ← NewCollectionInput
   │  （カタログ選択は                          │
   │   useCatalogs→ListCatalogs→               ▼
   │   GET /catalogs）           CreateCollectionItem.execute(input)  ← Application
   │                                            │ validate（catalogId / condition）
   │                                            ▼
   │                            CollectionRepository.create(input)     ← port(interface)
   │                                            │
   │                       ┌────────────────────┴────────────────────┐
   │              （Demo）NotImplementedError       （API）CollectionRepositoryImpl
   │                                                       POST /collection（201: enriched CollectionItem）
   └─ 成功後 useCollection.load() で一覧を再取得
```

UI（React）は `useCollection` / `useCatalogs` フック経由でユースケースを呼ぶだけ。**書誌の合成・採番はサーバーが行い、バリデーションのロジックはコンポーネントに直書きしない**。編集（`SaveCollectionItem` の upsert）は別経路で、対応 API 提供までは Demo（localStorage）で動く。

---

## 9. レイヤー境界の強制（依存ルールの番人）

物理フォルダ分離だけでは逆流を防げないため、ESLint で機械的に禁止する。

```jsonc
// eslint（eslint-plugin-boundaries の例）。依存は外→内のみ許可
"boundaries/element-types": ["error", {
  "default": "disallow",
  "rules": [
    { "from": "presentation",   "allow": ["application", "domain"] },
    { "from": "application",    "allow": ["domain"] },
    { "from": "infrastructure", "allow": ["application", "domain"] },
    { "from": "domain",         "allow": [] }   // domainは何にも依存できない
  ]
}
```

- `domain/` で `react` / `fetch` / `localStorage` を import したら **lintエラー**。
- これにより「ビジネスルールがUIに溶け出す」デモ時代の問題を構造的に封じる。

---

## 10. MVPでこの設計が満たす要件

| 要件 | 対応 |
|---|---|
| FR-A1〜A7（コレクションCRUD/サマリー/検索/エクスポート） | Application層のユースケース群 + `CollectionRepositoryDemo` |
| FR-B1/B2（相場表示・チャート、暫定データ） | Market層 + `MarketRepositoryDemo` + Sparkline/DetailModal |
| FR-C2/C3（クラウド保存・JSON取込）への布石 | Repository差し替え + Import/Exportユースケース |
| NFR-8（保守性・相場の分離） | 4層分離・相場収集はInfrastructure（将来バッチ）に隔離 |
| [05_architecture.md] の非破壊移行 | DI 1点切替で localStorage→API |

---

## 11. 段階導入ステップ（実装着手順）

1. ✅ **足場**：Vite + React + TS、テーマCSS移植。（ESLint境界ルール・Vitest は未導入）
2. ✅ **Domain**：`CollectionItem` / `Condition` / `ConditionFlags` / `ProfitLoss` / `summarize`。（単体テストは未）
3. ✅ **Application**：Collectionユースケース + `CollectionRepository` port + DTO + `applyCollectionQuery`。
4. ✅ **Infrastructure**：`CollectionRepositoryDemo` + seed + 画像縮小。
5. ✅ **Presentation（コレクション）**：CollectionPage・サマリー・カード・登録/編集モーダル + Export/Import + タブ切替。
6. ✅ **Market**：Domain（+共有カーネル）/port/`MarketRepositoryDemo`（シード固定PRNG）+ MarketPage・スパークライン・詳細モーダル。
7. ✅ **認証（Cognito/Amplify）**：`presentation/auth/`（AuthGate）でログイン必須化 + `config/amplify.ts` 初期化。dev/prod 環境分離（Vite mode）と S3 デプロイ（GitHub Actions）整備。
8. ⬜ **品質基盤**：Vitest（Domain/Application 単体テスト）+ ESLint 境界ルール導入。
9. 🔄 **バックエンド連携**：`infrastructure/http/apiClient`（`apiGet`/`apiPost`）で DI を切替。コレクション取得（`GET /collection`）・**新規登録（`POST /collection`）**・カタログ取得（`GET /catalogs`）・相場取得（`GET /market`）は接続済み。残りの書き込み系（編集・削除・インポート）API は提供待ち。

> 現在地：ステップ 1〜7 完了 + ステップ 9 一部（コレクション取得/新規登録・カタログ取得・相場取得が実 API 接続）。`npm run build` はクリーン。次はステップ 8（テスト基盤・ESLint境界ルール）と、残りの書き込み系 API の提供後の連携。

---

## 12. このフェーズで作らないもの（明示）

[02_scope_mvp.md](../docs_for_input/02_scope_mvp.md) に従い、以下は層だけ用意して実装しない：
- ~~認証（⑤⑥画面）~~ → ✅実装済み：Cognito/Amplify の `<Authenticator>` でアプリ全体をログイン必須化（`presentation/auth/AuthGate`）。トークンの保存・自動更新は Amplify が担当。API 呼び出し時のトークン付与（`apiClient` が ID トークンを付与）・`userId` 紐付け（サーバーが `sub` で判定）はコレクション取得で実装済み。
- 価格アラート・ウォッチリスト（FR-B5/B6）：デモ同様ダミーボタン。
- 相場の自動収集ロジック（[04_market_data.md] 決定待ち）：取得は `GET /market` に接続済みだが、相場値そのものの集計方法（バッチ等）はサーバー側で決定後に実装。

---

## 13. 環境分離とデプロイ

| 環境 | env ファイル | ビルド | デプロイ契機 | 配信先 |
|---|---|---|---|---|
| **dev** | `.env.dev` | `npm run build:dev`（`--mode dev`） | main へのマージ（自動） | dev の S3 |
| **prod** | `.env.prod` | `npm run build:prod`（`--mode prod`） | 手動実行（`workflow_dispatch`） | prod の S3 |

- **設定値**：`VITE_COGNITO_*` / `VITE_API_BASE_URL` / `VITE_IMAGE_BASE_URL`（画像配信元の CloudFront ドメイン）/ `VITE_USE_API` 等は env ファイル（gitignore、`.env.example` をテンプレに）で管理。Vite の `--mode` で dev/prod を切り替える。`VITE_USE_API='true'` で実 API、それ以外は Demo（localStorage）。現状 dev=true / prod=false（本番バックエンド構築後に true）。
- **CI（[deploy.yml](../.github/workflows/deploy.yml)）**：CI には env ファイルが無いため、**GitHub Environments(dev/prod) の Variables** から同名の `VITE_*` をビルド時に注入する。S3 バケット名（`AWS_S3_BUCKET`）も Environment ごとの Variable。注入は build ステップの `env:` で**明示的に列挙**しているため、新しい `VITE_*` を増やすときは ① `env:` への1行追加と ② GitHub Environments への Variable 登録の**両方**が必要（未登録だと空文字列になり、例えば `VITE_USE_API` 未設定時は Demo へフォールバックする）。
- これらの値はクライアントに埋め込まれる**公開情報**（Secret ではない）ため Variables で管理する。AWS 認証情報のみ Secrets。
```
