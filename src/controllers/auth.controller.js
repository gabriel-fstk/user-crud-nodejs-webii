const bcrypt = require("bcrypt");
const userDAO = require("../models/user.dao");

const authController = {
  login: (req, res) => {
    const { cpf, password } = req.body;

    const user = userDAO.findByCPF(cpf);
    if (!user) {
      return res.render("login", { error: "User not found" });
    }

    if (!user.password) 
      return res.render("login", { error: "Invalid password" });
    
    
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) 
      return res.render("login", { error: "Invalid password" });

    // Armazena o usuário na sessão
    req.session.user = user;

    res.redirect("/users");
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("An error occurred while logging out.");
      }
      res.redirect("/login");
    });
  }
};

module.exports = authController;
