const routes = (handler) => [
  // Menambahkan Lagu
  {
    method: "POST",
    path: "/songs",
    handler: handler.postSongHandler,
  },
  //Mendapatkan seluruh lagu
  {
    method: "GET",
    path: "/songs",
    handler: handler.getSongsHandler,
  },
  //Mendapatkan lagu by Id
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getSongByIdHandler,
  },
  //Mengedit lagu by Id
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putSongByIdHandler,
  },
  //Menghapus lagu by Id
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = routes;
