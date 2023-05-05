const ClientError = require("./ClientError");

// InvariantError kesalahan logika oleh data yang dikirim client
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = InvariantError;
  }
}
module.exports = InvariantError;
