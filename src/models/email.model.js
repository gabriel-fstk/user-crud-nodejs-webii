class Email {
  constructor(id, userId, email, isPrimary) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.isPrimary = isPrimary;
  }
}

module.exports = Email;
