const bcrypt = require("bcrypt");
const userDAO = require("../models/user.dao");
const emailDAO = require("../models/email.dao");
const phoneDAO = require("../models/phone.dao");
const User = require("../models/user.model");

const userController = {
  listUsers: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const filter = req.query.name || "";

    const users = userDAO.findAll(page, limit, filter);
    const totalUsers = userDAO.count(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.render("users/index", {
      users,
      currentPage: page,
      totalPages,
      nameFilter: filter,
      currentUser: req.session.user,
      title: "Users List",
    });
  },

  getUserDetails: (req, res) => {
    const userId = req.params.id;
    const user = userDAO.findById(userId);

    if (!user) {
      return res
        .status(404)
        .render("error", { error: "User not found", message: "" });
    }

    const phones = phoneDAO.findByUserId(userId);
    const emails = emailDAO.findByUserId(userId);
    console.log("User ID:", user.id);
    console.log("Emails:", emails);
    res.render("users/show", {
      user,
      phones,
      emails,
      currentUser: req.session.user,
      title: "User Details",
    });
  },

  addUser: (req, res) => {
    try {
      let {
        cpf,
        name,
        password,
        profile,
        phones,
        primary_phone,
        emails,
        primary_email,
      } = req.body;

      if (!cpf || !name || !password || !profile) {
        return res.render("users/add", { error: "All fields are required." });
      }

      // Tratamento para inputs únicos virem como objeto
      if (phones && !Array.isArray(phones)) phones = [phones];
      if (emails && !Array.isArray(emails)) emails = [emails];

      if (!phones || phones.length === 0 || !phones[0].number) {
        return res.render("users/add", {
          error: "At least one phone number is required.",
        });
      }

      if (!emails || emails.length === 0 || !emails[0].address) {
        return res.render("users/add", {
          error: "At least one email address is required.",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = new User(cpf, name, hashedPassword, profile);

      let result;
      try {
        result = userDAO.insert(user);
      } catch (insertErr) {
        return res.render("users/add", { error: insertErr.message });
      }

      const userId = result.userId;

      phones.forEach((phone, index) => {
        phoneDAO.insert({
          userId,
          number: phone.number,
          isPrimary: index === parseInt(primary_phone) ? 1 : 0,
        });
      });

      emails.forEach((email, index) => {
        emailDAO.insert({
          userId,
          email: email.address,
          isPrimary: index === parseInt(primary_email) ? 1 : 0,
        });
      });

      res.redirect("/users");
    } catch (error) {
      console.error("Error during user creation:", error.message);
      res.render("users/add", { error: "Unexpected error occurred." });
    }
  },

  getUserToEdit: (req, res) => {
    const userId = req.params.id;
    const user = userDAO.findById(userId);

    if (!user) {
      return res
        .status(404)
        .render("error", { error: "User not found", message: "" });
    }

    const phones = phoneDAO.findByUserId(userId);
    const emails = emailDAO.findByUserId(userId);

    res.render("users/edit", {
      user,
      phones,
      emails,
      title: "Update User",
      error: req.query.error || null,
    });
  },

  updateUser: (req, res) => {
    const userId = req.params.id;
    const { name, profile } = req.body;

    if (!profile) {
      return res.render("users/edit", {
        error: "Profile is required",
        userId,
        title: "Update User",
      });
    }

    const user = userDAO.findById(userId);
    if (!user) {
      return res
        .status(404)
        .render("error", { error: "User not found", message: "" });
    }

    user.name = name;
    user.profile = profile;
    userDAO.update(user);

    phoneDAO.deleteByUserId(userId);
    const phones = req.body.phones || [];
    const primaryPhoneIndex = parseInt(req.body.primary_phone) || 0;
    phones.forEach((phone, index) => {
      phoneDAO.insert({
        userId,
        number: phone.number,
        isPrimary: index === primaryPhoneIndex ? 1 : 0,
      });
    });

    emailDAO.deleteByUserId(userId);
    const emails = req.body.emails || [];
    const primaryEmailIndex = parseInt(req.body.primary_email) || 0;
    emails.forEach((email, index) => {
      emailDAO.insert({
        userId,
        email: email.address,
        isPrimary: index === primaryEmailIndex ? 1 : 0,
      });
    });

    res.redirect(`/user/${userId}`);
  },

  deleteUser: (req, res) => {
    const userId = req.params.id;

    // Telefones e e-mails serão excluídos automaticamente pelo ON DELETE CASCADE
    userDAO.delete(userId);

    res.redirect("/users");
  },
};

module.exports = userController;
