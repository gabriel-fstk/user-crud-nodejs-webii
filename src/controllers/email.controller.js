const emailDAO = require('../models/email.dao');
const Email = require('../models/email.model');

const emailController = {
  listEmailsByUser: (req, res) => {
    const userId = req.params.userId;
    const emails = emailDAO.findByUserId(userId);

    res.render('emails/index', {
      emails,
      userId,
      title: 'Emails List'
    });
  },

  addEmail: (req, res) => {
    const { userId, email, isPrimary } = req.body;
    const newEmail = new Email(null, userId, email, isPrimary);

    emailDAO.insert(newEmail);
    res.redirect(`/emails/${userId}`);
  },

  deleteEmailsByUser: (req, res) => {
    const userId = req.params.userId;
    emailDAO.deleteByUserId(userId);

    res.redirect(`/emails/${userId}`);
  }
};

module.exports = emailController;