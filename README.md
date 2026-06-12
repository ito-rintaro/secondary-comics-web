# secondary-comics-web

プレミア漫画のコレクション管理 / マーケット相場閲覧の Web アプリ（React + TypeScript / クリーンアーキテクチャ）。
設計の詳細は [docs/architecture.md](docs/architecture.md) を参照。

## 開発

```bash
npm install
npm run dev      # 開発サーバ
npm run build    # 型チェック + 本番ビルド（dist/ に出力）
npm run lint     # ESLint
npm run preview  # ビルド成果物のプレビュー
```

## デプロイ（AWS S3 / GitHub Actions）

`main` ブランチへの push（PR マージ）をトリガーに、GitHub Actions が自動でビルドし、
`dist/` の中身を S3 バケットへ同期する。ワークフローは
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) を参照。

フロー：`npm ci` → `npm run build` → `aws s3 sync dist/ s3://<bucket>/ --delete`

### 必要な GitHub Secrets

リポジトリの **Settings → Secrets and variables → Actions** に以下を登録する。

| Secret 名 | 内容 |
|---|---|
| `AWS_ACCESS_KEY_ID` | デプロイ用 IAM ユーザーのアクセスキー ID |
| `AWS_SECRET_ACCESS_KEY` | 同シークレットアクセスキー |
| `AWS_REGION` | バケットのリージョン（例: `ap-northeast-1`） |
| `AWS_S3_BUCKET` | バケット名（`s3://` は不要） |

### IAM 最小権限（バケット限定）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::<bucket>" },
    { "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::<bucket>/*" }
  ]
}
```

> `--delete` でローカル `dist/` に無いオブジェクトは削除されるため、デプロイ専用バケットを前提とする。
> Actions タブから手動実行（`workflow_dispatch`）も可能。
