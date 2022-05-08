import path from "path";
import fs from "fs";

import moment from "moment";

const MOMENT_FORMAT = "YYYY-MM-DD HH:mm:ss";

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

  public error(err: unknown) {
    const timestamp = moment().format(MOMENT_FORMAT);
    const errorMessage = `[ERROR]\r\n\tTimestamp: ${timestamp}\r\n\tError: ${err}\r\n\n`;
    this.writeToLog(errorMessage);
  }

  public debug(message: unknown) {
    const timestamp = moment().format(MOMENT_FORMAT);
    const debugMessage = `[DEBUG]\r\n\tTimestamp: ${timestamp}\r\n\tMessage: ${message}\r\n\n`;
    this.writeToLog(debugMessage);
  }

  private writeToLog(message: string) {
    this.writeStream.write(message);
  }
}

export default Logger;
