const db = require("../config/database");
const Email = require("./email.model");

const emailDAO = {
  findByUserId(userId) {
    const query = "SELECT * FROM emails WHERE user_id = ?;";
    const rows = db.prepare(query).all(userId);

    return rows.map(
      (row) => new Email(row.id, row.user_id, row.email, row.is_primary)
    );
  },

  insert(email) {
    const query =
      "INSERT INTO emails (user_id, email, is_primary) VALUES (?, ?, ?);";
    const result = db
      .prepare(query)
      .run(email.userId, email.email, email.isPrimary);
    return result.lastInsertRowid;
  },

  deleteByUserId(userId) {
    const query = "DELETE FROM emails WHERE user_id = ?;";
    db.prepare(query).run(userId);
  },
};

module.exports = emailDAO;
