/** 入力バリデーション失敗。Presentation 側でメッセージ表示に使う。 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
