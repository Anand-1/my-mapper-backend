import crypto from "crypto";
import type { Middleware } from "koa";
import config from "../config/env";
import { signAuthToken } from "../utils/jwt";
import { addUser, findUserByEmail } from "../utils/userStore";
import { hashPassword } from "../utils/password";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const getBackendUrl = (ctx: { protocol: string; host: string }): string =>
  config.backendUrl || `${ctx.protocol}://${ctx.host}`;

const getFrontendUrl = (): string => config.frontendUrl;

const getGoogleRedirectUri = (ctx: { protocol: string; host: string }): string =>
  `${getBackendUrl(ctx)}/auth/google/callback`;

const redirectWithOAuthError = (
  ctx: { redirect: (url: string) => void },
  message: string
): void => {
  const redirectUrl = new URL("/login", getFrontendUrl());
  redirectUrl.searchParams.set("oauth", "error");
  redirectUrl.searchParams.set("message", message);
  ctx.redirect(redirectUrl.toString());
};

const setAuthCookie = (
  ctx: { cookies: { set: (name: string, value: string, opts: Record<string, unknown>) => void } },
  token: string
): void => {
  ctx.cookies.set(config.jwtCookieName, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });
};

const clearAuthCookie = (
  ctx: { cookies: { set: (name: string, value: string, opts: Record<string, unknown>) => void } }
): void => {
  ctx.cookies.set(config.jwtCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });
};

interface GoogleProfile {
  email: string;
  name: string;
  picture: string;
}

const parseJwtPayload = (token: string): GoogleProfile => {
  const [, payload] = token.split(".");

  if (!payload) {
    return { email: "", name: "", picture: "" };
  }

  return JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8")
  ) as GoogleProfile;
};

export const googleLogin: Middleware = async (ctx) => {
  if (!config.googleClientId) {
    redirectWithOAuthError(ctx, "Google OAuth is not configured");
    return;
  }

  const state = crypto.randomBytes(24).toString("hex");
  ctx.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", config.googleClientId);
  authUrl.searchParams.set("redirect_uri", getGoogleRedirectUri(ctx));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  ctx.redirect(authUrl.toString());
};

export const googleCallback: Middleware = async (ctx) => {
  const code = ctx.query.code as string | undefined;
  const state = ctx.query.state as string | undefined;
  const storedState = ctx.cookies.get("google_oauth_state");

  ctx.cookies.set("google_oauth_state", null as unknown as string);

  if (!config.googleClientId || !config.googleClientSecret) {
    redirectWithOAuthError(ctx, "Google OAuth is not configured");
    return;
  }

  if (!code || !state || !storedState || state !== storedState) {
    redirectWithOAuthError(ctx, "OAuth verification failed");
    return;
  }

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: getGoogleRedirectUri(ctx),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    redirectWithOAuthError(ctx, "Google sign-in failed");
    return;
  }

  const tokens = (await tokenResponse.json()) as { id_token: string };
  const profile = parseJwtPayload(tokens.id_token);
  const user = {
    email: profile.email,
    name: profile.name,
    picture: profile.picture,
  };
  const authToken = signAuthToken(user);

  setAuthCookie(ctx, authToken);

  const redirectUrl = new URL("/login", getFrontendUrl());
  redirectUrl.searchParams.set("oauth", "success");

  ctx.redirect(redirectUrl.toString());
};

export const me: Middleware = async (ctx) => {
  ctx.body = {
    user: {
      email: ctx.state.user.email,
      name: ctx.state.user.name,
      picture: ctx.state.user.picture,
    },
  };
};

export const register: Middleware = async (ctx) => {
  const { email, name, password } = (ctx.request as unknown as { body?: Record<string, string> }).body ?? {};
  console.log(email, name, password);
  if (!email || !name || !password) {
    ctx.status = 400;
    ctx.body = { error: "Name, email, and password are required." };
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    ctx.status = 409;
    ctx.body = { error: "A user with this email already exists." };
    return;
  }

  const passwordHash = hashPassword(password);
  const user = await addUser({
    email: normalizedEmail,
    name: name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  const authToken = signAuthToken({
    email: user.email,
    name: user.name,
    picture: "",
  });

  setAuthCookie(ctx, authToken);

  ctx.status = 201;
  ctx.body = {
    user: {
      email: user.email,
      name: user.name,
    },
  };
};

export const logout: Middleware = async (ctx) => {
  clearAuthCookie(ctx);
  ctx.status = 204;
};
