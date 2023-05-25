const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistSongByIdHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistSongByIdHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistSongByIdHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
];

module.exports = routes;
