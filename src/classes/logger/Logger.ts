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

  public error(timestamp: string, errString: string) {
    const message = `[ERROR]\r\n\tTimestamp: ${timestamp}\r\n\tError: ${errString}\r\n\n`;
    this.writeToLog(message);
  }

  public debug(timestamp: string, debugString: string) {
    const message = `[DEBUG]\r\n\tTimestamp: ${timestamp}\r\n\tError: ${debugString}\r\n\n`;
    this.writeToLog(message);
  }

  private writeToLog(message: string) {
    this.writeStream.write(message);
  }
}

export default Logger;
