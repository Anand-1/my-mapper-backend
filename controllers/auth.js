const crypto = require("crypto");
const config = require("../config/env");
const { signAuthToken } = require("../utils/jwt");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const getBackendUrl = (ctx) =>
  config.backendUrl || `${ctx.protocol}://${ctx.host}`;

const getFrontendUrl = () => config.frontendUrl;

const getGoogleRedirectUri = (ctx) => `${getBackendUrl(ctx)}/auth/google/callback`;

const redirectWithOAuthError = (ctx, message) => {
  const redirectUrl = new URL("/login", getFrontendUrl());
  redirectUrl.searchParams.set("oauth", "error");
  redirectUrl.searchParams.set("message", message);
  ctx.redirect(redirectUrl.toString());
};

const setAuthCookie = (ctx, token) => {
  ctx.cookies.set(config.jwtCookieName, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });
};

const clearAuthCookie = (ctx) => {
  ctx.cookies.set(config.jwtCookieName, null, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });
};

const parseJwtPayload = (token) => {
  const [, payload] = token.split(".");

  if (!payload) {
    return {};
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
};

exports.googleLogin = async (ctx) => {
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

exports.googleCallback = async (ctx) => {
  const code = ctx.query.code;
  const state = ctx.query.state;
  const storedState = ctx.cookies.get("google_oauth_state");

  ctx.cookies.set("google_oauth_state", null);

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

  const tokens = await tokenResponse.json();
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

exports.me = async (ctx) => {
  ctx.body = {
    user: {
      email: ctx.state.user.email,
      name: ctx.state.user.name,
      picture: ctx.state.user.picture,
    },
  };
};

exports.logout = async (ctx) => {
  clearAuthCookie(ctx);
  ctx.status = 204;
};
