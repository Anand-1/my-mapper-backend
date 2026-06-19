import { ParameterizedContext, DefaultState, DefaultContext } from "koa";

export type KoaContext = ParameterizedContext<DefaultState, DefaultContext>;

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export interface AuthState {
  user: GoogleUser;
}
