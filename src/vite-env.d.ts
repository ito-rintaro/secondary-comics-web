/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_AWS_REGION: string;
  readonly VITE_API_BASE_URL: string;
  /** 'true' で実 API に接続。未設定/それ以外はローカルの Demo（localStorage）。 */
  readonly VITE_USE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
