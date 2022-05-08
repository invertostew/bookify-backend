import app from "./app";

if (
  !process.env.ENV ||
  !process.env.SERVER_URL ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASS ||
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_DB ||
  !process.env.BCRYPT_PEPPER ||
  !process.env.SALT_ROUNDS ||
  !process.env.JWT_SECRET
) {
  throw new Error(
    "Application failed to start. Ensure necessary environment variables are set."
  );
}

const SERVER_PORT = process.env.SERVER_PORT || 4000;

app.listen(SERVER_PORT, (): void => {
  console.log(`Server running on port ${SERVER_PORT} 🚀`);
});
