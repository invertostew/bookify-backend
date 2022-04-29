import app from "./app";

const { APP_URL } = process.env;
const APP_PORT = process.env.APP_PORT || 4000;

app.listen(APP_PORT, (): void => {
  console.log(`Server running: ${APP_URL}:${APP_PORT} 🚀`);
});
