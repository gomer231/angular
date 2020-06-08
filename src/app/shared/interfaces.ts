export interface FbResponse {
  name: string;
}

export interface Product {
  type?: string;
  id?: string;
  title?: string;
  photo: string;
  info?: string;
  price?: string;
  date?: Date;
}

export interface User {
  displayName: string;
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
  registered: boolean;
}
