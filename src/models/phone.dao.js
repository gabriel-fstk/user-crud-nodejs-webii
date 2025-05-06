const db = require("../config/database");
const Phone = require("./phone.model");

const phoneDAO = {
  findByUserId(userId) {
    const query = "SELECT * FROM phones WHERE user_id = ?;";
    const rows = db.prepare(query).all(userId);

    return rows.map(
      (row) => new Phone(row.id, row.user_id, row.number, row.is_primary)
    );
  },

  insert(phone) {
    const query =
      "INSERT INTO phones (user_id, number, is_primary) VALUES (?, ?, ?);";

    const result = db
      .prepare(query)
      .run(phone.userId, phone.number, phone.isPrimary);
    return result.lastInsertRowid;
  },

  deleteByUserId(userId) {
    const query = "DELETE FROM phones WHERE user_id = ?;";
    db.prepare(query).run(userId);
  },
};

module.exports = phoneDAO;
