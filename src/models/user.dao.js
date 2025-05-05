const db = require("../config/database");
const User = require("./user.model");

const userDAO = {
  findAll(page, limit, filter) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM users
      ${filter ? "WHERE name LIKE ?" : ""}
      LIMIT ? OFFSET ?;
    `;
    const params = filter ? [`%${filter}%`, limit, offset] : [limit, offset];
    const rows = db.prepare(query).all(...params);

    return rows.map(
      (row) => new User(row.id, row.cpf, row.name, null, row.profile)
    );
  },

  count(filter) {
    const query = `
      SELECT COUNT(*) as count 
      FROM users 
      ${filter ? "WHERE name LIKE ?" : ""};
    `;
    const params = filter ? [`%${filter}%`] : [];
    return db.prepare(query).get(...params).count;
  },

  findById(id) {
    const query = "SELECT * FROM users WHERE id = ?;";
    const row = db.prepare(query).get(id);

    if (!row) return null;
    return new User(row.id, row.cpf, row.name, null, row.profile);
  },

  findByCPF(cpf) {
    const query = "SELECT * FROM users WHERE cpf = ?;";
    const row = db.prepare(query).get(cpf);

    if (!row) return null;
    return new User(row.id, row.cpf, row.name, row.password, row.profile);
  },

  insert(user) {
    try {
      const query = db.prepare(`
        INSERT INTO users (cpf, name, password, profile)
        VALUES (?, ?, ?, ?)
      `);

      const result = query.run(
        user.cpf,
        user.name,
        user.password,
        user.profile
      );

      return { userId: result.lastInsertRowid };
    } catch (err) {
      if (
        err.code === "SQLITE_CONSTRAINT" &&
        err.message.includes("UNIQUE constraint failed: users.cpf")
      ) {
        throw new Error("CPF already exists");
      }
      throw new Error("Error inserting user: " + err.message);
    }
  },

  update(user) {
    const query = "UPDATE users SET name = ?, profile = ? WHERE id = ?;";
    const result = db.prepare(query).run(user.name, user.profile, user.id);

    if (result.changes === 0) {
      throw new Error("User not found or data unchanged.");
    }
  },

  delete(id) {
    const query = "DELETE FROM users WHERE id = ?;";
    const result = db.prepare(query).run(id);

    if (result.changes === 0) {
      throw new Error("User not found.");
    }
  },
};

module.exports = userDAO;
