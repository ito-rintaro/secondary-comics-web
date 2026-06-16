/** 入力バリデーション失敗。Presentation 側でメッセージ表示に使う。 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 対応する API がまだ提供されていない操作。
 * 今回のバックエンド連携は GET（取得）のみ。登録・編集・削除・インポートは
 * エンドポイント提供後に実装する。Presentation ではメッセージをそのまま表示する。
 */
export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}
