import app from "./app";

const APP_PORT = process.env.APP_PORT || 4000;

app.listen(APP_PORT, (): void => {
  console.log(`Server running on port ${APP_PORT} 🚀`);
});
