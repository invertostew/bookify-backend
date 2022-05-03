import path from "path";
import fs from "fs";

class Logger {
  public writeStream: fs.WriteStream;

  private LOG_DIR_PATH = path.join(__dirname, "..", "..", "..", "logs");

  constructor(filename: string) {
    if (!fs.existsSync(this.LOG_DIR_PATH)) {
      fs.mkdirSync(this.LOG_DIR_PATH);
    }

    this.writeStream = fs.createWriteStream(
      `${this.LOG_DIR_PATH}/${filename}`,
      { flags: "a" }
    );
  }

  public error(timestamp: string, err: unknown) {
    const errorMessage = `[ERROR]\r\n\tTimestamp: ${timestamp}\r\n\tError: ${err}\r\n\n`;
    this.writeToLog(errorMessage);
  }

  public debug(timestamp: string, message: unknown) {
    const debugMessage = `[DEBUG]\r\n\tTimestamp: ${timestamp}\r\n\tDebug: ${message}\r\n\n`;
    this.writeToLog(debugMessage);
  }

  private writeToLog(message: string) {
    this.writeStream.write(message);
  }
}

export default Logger;
