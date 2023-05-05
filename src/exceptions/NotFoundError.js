const ClientError = require("./ClientError");

// NotFoundError Error yang muncul ketika client meminta resource yang tidak ditemukan
class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = NotFoundError;
  }
}

module.exports = NotFoundError;
