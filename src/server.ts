import app from "./app";

if (
  !process.env.ENV ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASS ||
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_DB ||
  !process.env.SERVER_URL ||
  !process.env.CLIENT_URL ||
  !process.env.BCRYPT_PEPPER ||
  !process.env.SALT_ROUNDS ||
  !process.env.JWT_SECRET ||
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_ENDPOINT_SECRET
) {
  if (process.env.ENV && process.env.ENV !== "production") {
    console.error(
      "Please ensure you have all of the required environment variables, your current environment variables: ",
      {
        ENV: process.env.ENV,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASS: process.env.POSTGRES_PASS,
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_PORT: process.env.POSTGRES_PORT,
        POSTGRES_DB: process.env.POSTGRES_DB,
        SERVER_URL: process.env.SERVER_URL,
        CLIENT_URL: process.env.CLIENT_URL,
        BCRYPT_PEPPER: process.env.BCRYPT_PEPPER,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
        JWT_SECRET: process.env.JWT_SECRET,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET
      }
    );
  }

  throw new Error(
    "Application failed to start. Ensure necessary environment variables are set."
  );
}

const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT || 4000;

app.listen(SERVER_PORT, (): void => {
  console.log(`Server running on port ${SERVER_PORT} 🚀`);
});
