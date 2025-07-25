import 'express-session';

declare module 'express-session' {
  interface SessionData {
    oauth?: {
      state: string;
      nonce?: string;
      client_id: string;
      redirect_uri: string;
      scope: string;
      organization_id: string;
    };
  }
}
