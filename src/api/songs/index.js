const SongsHandler = require("./handler");
const routes = require("./routes");
const SongsValidator = require("./validator");
module.exports = {
  name: "songs",
  version: "1.0.0",
  register: async (server, { service }) => {
    const songsHandler = new SongsHandler(service, SongsValidator);
    server.route(routes(songsHandler));
  },
};
