const routes = (handler) => [
  //playlists
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },

  //routes playlistsongs
  //   {
  //     method: "POST",
  //     path: "/playlists/{id}/songs",
  //     handler: handler.postPlaylistSongHandler,
  //   },
  //   {
  //     method: "GET",
  //     path: "/playlists/{id}/songs",
  //     handler: handler.getPlaylistSongHandler,
  //   },
  //   {
  //     method: "DELETE",
  //     path: "/playlists/{id}/songs",
  //     handler: handler.deletePlaylistSongHandler,
  //   },
];

module.exports = routes;
