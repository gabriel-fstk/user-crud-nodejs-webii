const phoneDAO = require('../models/phone.dao');
const Phone = require('../models/phone.model');

const phoneController = {
  listPhonesByUser: (req, res) => {
    const userId = req.params.userId;
    const phones = phoneDAO.findByUserId(userId);

    res.render('phones/index', {
      phones,
      userId,
      title: 'Phones List'
    });
  },

  addPhone: (req, res) => {
    const { userId, number, isPrimary } = req.body;
    const newPhone = new Phone(null, userId, number, isPrimary);

    phoneDAO.insert(newPhone);
    res.redirect(`/phones/${userId}`);
  },

  deletePhonesByUser: (req, res) => {
    const userId = req.params.userId;
    phoneDAO.deleteByUserId(userId);

    res.redirect(`/phones/${userId}`);
  }
};

module.exports = phoneController;