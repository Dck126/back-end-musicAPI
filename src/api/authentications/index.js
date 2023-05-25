const AuthenticationsHandler = require("./handler");
const routes = require("./routes");
const AuthenticationValidator = require("./validator");

module.exports = {
  name: "authenticaitons",
  version: "1.0.0",
  register: async (
    server,
    { authenticationsService, usersService, tokenManager }
  ) => {
    //di dalam fungsi asynchronous register kita buat instance dari authenticationsHandler dan gunakan instance tersebut pada routes konfigurasi
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      AuthenticationValidator
    );
    server.route(routes(authenticationsHandler));
  },
};
