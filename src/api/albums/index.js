const AlbumsHandler = require("./handler");
const routes = require("./routes");
const AlbumValidator = require("./validator");

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { service }) => {
    const albumsHandler = new AlbumsHandler(service, AlbumValidator);
    server.route(routes(albumsHandler));
  },
};
