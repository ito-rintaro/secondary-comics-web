import { fetchAuthSession } from 'aws-amplify/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** API 通信の失敗（非 2xx / ネットワーク / 未認証）。Presentation でメッセージ表示に使う。 */
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Cognito の ID トークンを取り出す。バックエンドは JWT の sub で userId を判定するため、
 * リクエストに userId は載せず、このトークンだけで本人のデータに絞り込まれる。
 */
async function authHeader(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new ApiError(401, 'ログインが必要です。再度ログインしてください。');
  return { Authorization: `Bearer ${idToken}` };
}

/** 認証付き GET。レスポンス JSON を T として返す。非 2xx は ApiError を投げる。 */
export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeader();

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { headers });
  } catch {
    // ネットワーク到達不可・CORS 失敗など
    throw new ApiError(0, 'サーバーに接続できませんでした。通信環境を確認してください。');
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  return res.json() as Promise<T>;
}

/**
 * 認証付き POST。body を JSON 送信し、レスポンス JSON を T として返す。
 * 2xx（POST /collection は 201）以外は ApiError を投げる。
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeader();

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // ネットワーク到達不可・CORS 失敗など
    throw new ApiError(0, 'サーバーに接続できませんでした。通信環境を確認してください。');
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  return res.json() as Promise<T>;
}

/** 非 2xx レスポンスを ApiError に整形する。{ "message": "..." }（OpenAPI の Error）を尊重する。 */
async function toApiError(res: Response): Promise<ApiError> {
  let message = `通信に失敗しました（${res.status}）`;
  try {
    const body: unknown = await res.json();
    if (body && typeof body === 'object' && 'message' in body) {
      message = String((body as { message: unknown }).message);
    }
  } catch {
    /* JSON でない／空ボディは既定メッセージのまま */
  }
  return new ApiError(res.status, message);
}
