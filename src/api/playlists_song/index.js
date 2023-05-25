const PlaylistSongsHandler = require("./handler");
const routes = require("./routes");
const PlaylistSongsValidator = require("./validator");

module.exports = {
  name: "playlist_songs",
  version: "1.0.0",
  register: async (server, { playlistSongsService, playlistsService }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      PlaylistSongsValidator
    );
    server.route(routes(playlistSongsHandler));
  },
};
