const PlaylistHandler = require("./handler");
const routes = require("./routes");
const PlaylistsValidator = require("./validator");

module.exports = {
  name: "playlists",
  version: "1.0.0",
  register: async (server, { playlistsService }) => {
    //di dalam fungsi asynchronous register kita buat instance dari authenticationsHandler dan gunakan instance tersebut pada routes konfigurasi
    const playlistsHandler = new PlaylistHandler(
      playlistsService,
      PlaylistsValidator
    );
    server.route(routes(playlistsHandler));
  },
};
