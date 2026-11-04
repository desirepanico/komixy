export interface Environment {
  production: boolean;
  api: {
    baseUrl: string;
    publicKey: string;
  };
}
