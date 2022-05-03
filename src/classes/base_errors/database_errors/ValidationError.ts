import { DatabaseError as pgDatabaseError } from "pg";

import DatabaseError from "../DatabaseError";

class ValidationError extends DatabaseError {
  protected status = 400;

  constructor(pgErr: pgDatabaseError) {
    let type = "";
    let title = "";
    // come back and tidy up pgErr.detail if have time
    const detail = pgErr.detail || "";

    if (pgErr.code === "23502") {
      type = "";
      title = pgErr.message;
    } else if (pgErr.code === "23505") {
      type = "";
      title = pgErr.message;
    } else if (pgErr.code === "23514") {
      type = "";
      title = pgErr.message;
    }

    super(type, title, detail);

    // console.log(pgErr);
  }
}

export default ValidationError;
