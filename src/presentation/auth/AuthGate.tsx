import {
  Authenticator,
  ThemeProvider,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import type { ReactNode } from 'react';
import { authTheme, configureAuthLanguage } from './authTheme';

configureAuthLanguage();

type RenderProps = {
  /** 現在ログイン中のユーザー名（メール）。 */
  username: string;
  /** ログアウト関数。ヘッダのログアウトボタンなどに渡す。 */
  signOut: () => void;
};

type Props = {
  /** ログイン済みのときだけ描画される本体。signOut / username を受け取れる。 */
  children: (props: RenderProps) => ReactNode;
};

/**
 * 認証ゲート。未ログインなら Cognito のサインイン/サインアップ画面を表示し、
 * ログイン済みのときだけ children を描画する。
 * トークンの保存・自動更新は Amplify が裏で行うため、ここでは何もしない。
 */
export function AuthGate({ children }: Props) {
  return (
    <ThemeProvider theme={authTheme} colorMode="dark">
      {/* メールでサインイン／サインアップさせる。
          確認コードはここで入力したメールアドレス宛に届く。 */}
      <Authenticator loginMechanisms={['email']}>
        {({ signOut, user }) => (
          <>
            {children({
              username: user?.signInDetails?.loginId ?? user?.username ?? '',
              signOut: signOut ?? (() => {}),
            })}
          </>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export { useAuthenticator };
