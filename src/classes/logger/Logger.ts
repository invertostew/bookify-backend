import path from "path";
import fs from "fs";

class Logger {
  public writeStream: fs.WriteStream;

  private LOG_DIR_PATH = path.join(__dirname, "..", "..", "..", "logs");

  constructor(filename: string) {
    // may come back later if time to add check for dir exist, and create if not...

    this.writeStream = fs.createWriteStream(
      `${this.LOG_DIR_PATH}/${filename}`,
      { flags: "a" }
    );
  }

  public error(timestamp: string, errString: string) {
    const message = `[ERROR]\r\n\tTimestamp: ${timestamp}\r\n\tError: ${errString}\r\n\n`;
    this.writeToLog(message);
  }

  private writeToLog(message: string) {
    this.writeStream.write(message);
  }
}

export default Logger;
