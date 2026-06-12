# 03 データモデル

現デモのデータ構造を起点に、サーバ/DB化・相場の実データ化を見据えて拡張する。

## 現デモの構造（[../index.html](../index.html) より）

### コレクション item（localStorage配列）

```
id, title, author, publisher, volume, year,
condition('S（新品・美品）'|'A（良い）'|'B（並）'|'C（傷み・難あり）'),
qty, cost, market, date, store, location,
firstEd(bool), obi(bool), special(bool),
memo, image(dataURL), updated(timestamp)
```

### マーケット（ダミー・クライアント生成）

```
t,a,p,v,seller,cond,firstEd,obi,special,base,trend,vol
→ 派生: hist[12], price, change, listedAt
```

## 本番モデル（提案）

DB前提。テーブル/コレクション単位で正規化する。

### users
| カラム | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| email | string | unique |
| auth_provider | enum | email / google など |
| created_at, deleted_at | timestamp | 退会はソフトデリート |

### collection_items（ユーザーの所有品）
| カラム | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK→users |
| work_id | uuid \| null | FK→works（相場マスタに紐付く場合） |
| title, author, publisher, volume, year | string | 自由入力（works未紐付けでも保存可） |
| condition | enum | S/A/B/C |
| qty | int | |
| cost | int | 取得価格（1点・円） |
| market | int | 現在相場（1点・円） |
| **market_source** | enum | `manual` / `auto` / `estimate`（出所を区別。フェーズ移行で重要） |
| **market_updated_at** | timestamp | 相場の鮮度 |
| purchase_date | date | |
| store, location | string | |
| first_ed, obi, special | bool | 状態フラグ |
| memo | text | |
| image_url | string | オブジェクトストレージのURL（dataURL埋込から脱却） |
| created_at, updated_at | timestamp | |

> 含み損益 = `(market - cost) * qty`、評価額 = `market * qty`。デモのロジックを踏襲。

### works（相場マスタ ＝ 作品/版の正規化）
複数ユーザーの所有品が同じ「版」を指せるようにする中核テーブル。相場データはここに紐づく。

| カラム | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| title, author, publisher, volume | string | |
| edition | string | 初版/重版 等の版表記 |
| isbn / jan | string \| null | 同定キー（あれば強力） |
| variant_key | string | コンディション/帯/特装の組合せを表すキー（相場分離用） |

### price_points（相場の実データ・時系列）
| カラム | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| work_id | uuid | FK→works |
| variant_key | string | 初版+帯 など条件別 |
| source | enum | mercari / yahoo / rakuten / manual … |
| price | int | |
| status | enum | sold / listing |
| observed_at | timestamp | 観測時刻 |

> 中央値/最高値/トレンドはここから集計（hobipediaと同じ思想：状態別に潰さず保持）。

### watches / alerts（フェーズ3）
| カラム | 型 | 備考 |
|---|---|---|
| user_id, work_id, variant_key | | 監視対象 |
| threshold | int | 通知しきい値 |
| direction | enum | above / below |

## 移行方針

- デモのlocalStorage JSON（item配列）→ `collection_items` へ取込（FR-C3）。`market` は `market_source=manual` として保存。
- 画像：dataURL埋込 → アップロードしてオブジェクトストレージ、`image_url` 参照に置換。
- フェーズ2で `collection_items.work_id` を `works` に名寄せし、相場自動反映（`market_source=auto`）へ。

## 同定（名寄せ）の課題

- 「初版」「帯付き」などはタイトル文字列に紛れ込んでいる（例：『AKIRA 全6巻 初版帯付セット』）。
- ISBN/JANがあれば確実だが、古い初版は無い/不統一。→ タイトル正規化＋状態フラグ＋著者で名寄せロジックが必要（フェーズ2の設計課題）。
