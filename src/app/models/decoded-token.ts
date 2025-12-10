export interface DecodedToken {
  sub: string | number;
  rol: string;
  id: number;
  iat?: number;
  exp?: number;
}
