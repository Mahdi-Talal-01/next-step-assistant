const { google } = require("googleapis");
const { TokenRepository } = require("../repositories/TokenRepository");

class GmailService {
  constructor() {
    this.scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      // 'https://www.googleapis.com/auth/gmail.metadata',
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  }
}
module.exports = new GmailService();