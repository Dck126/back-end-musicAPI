const CollaborationsHandler = require("./handler");
const routes = require("./routes");
const CollaborationsValidator = require("./validator");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: async (server, { collaborationsService, playlistsService }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      CollaborationsValidator
    );
    server.route(routes(collaborationsHandler));
  },
};
