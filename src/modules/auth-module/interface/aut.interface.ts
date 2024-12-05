interface JwtPayload {
  id: number;
  email: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
  };
}