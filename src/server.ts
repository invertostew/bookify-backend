import app from "./app";

if (
  !process.env.ENV ||
  !process.env.APP_URL ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASS ||
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_DB ||
  !process.env.BCRYPT_PEPPER ||
  !process.env.SALT_ROUNDS ||
  !process.env.JWT_SECRET ||
  !process.env.MOMENT_FORMAT
) {
  throw new Error(
    "Application failed to start. Ensure necessary environment variables are set."
  );
}

const APP_PORT = process.env.APP_PORT || 4000;

app.listen(APP_PORT, (): void => {
  console.log(`Server running on port ${APP_PORT} 🚀`);
});
