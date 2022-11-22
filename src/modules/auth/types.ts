export interface SignPayload {
  email: string;
  password?: string;
  username: string;
}

export interface TokenData {
  username: string;
  email: string;
}
