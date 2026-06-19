# My Mapper Backend

## JWT Authentication

Google OAuth is used as the trusted sign-in provider. After Google returns a valid callback, the backend creates an application JWT with `utils/jwt.js`, stores it in an httpOnly cookie, and redirects the user back to the frontend.

Protected Koa routes should use `middleware/authenticateJwt.js`. The middleware accepts either:

- `Authorization: Bearer <token>`
- the httpOnly cookie named by `JWT_COOKIE_NAME`

Authenticated user details are available on `ctx.state.user`.

## Route Structure

Routes are organized into separate files under `routes/` and registered in `server.js` via `routes/index.js`.

### Home Routes (`routes/home.js`)

- `GET /` — Welcome message.
- `GET /about` — About page.

### Input Routes (`routes/inputs.js`)

- `GET /inputs` — List all stored inputs.
- `POST /inputs` — Create a new input. Requires `date` and `input` in the request body.

### Cars Routes (`routes/cars.js`)

- `GET /cars` — List all cars from the PostgreSQL `cars` table.

### Auth Routes (`routes/auth.js`)

- `GET /auth/google` starts Google OAuth.
- `GET /auth/google/callback` exchanges the OAuth code, signs the app JWT, and sets the auth cookie.
- `GET /auth/me` returns the current signed-in user and requires a valid JWT.
- `POST /auth/logout` clears the auth cookie.

## Environment

Copy `.env.example` to `.env` and set:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BACKEND_URL`
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_COOKIE_NAME`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

`CORS_ORIGINS` is a comma-separated allow-list for browser origins that can call the API with credentials. For local development, include both `http://127.0.0.1:5173` and `http://localhost:5173` if you switch between those URLs.

Use a long random `JWT_SECRET` outside local development.
