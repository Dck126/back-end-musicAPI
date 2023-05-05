// import .env conf
require("dotenv").config();

// Conf Server
const Hapi = require("@hapi/hapi");
// plugin
const albums = require("./api/albums");
const songs = require("./api/songs");
// CRUD
const AlbumService = require("./service/postgres/AlbumService");
const SongsService = require("./service/postgres/SongsService");
// validator
const AlbumValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");

const init = async () => {
  const albumService = new AlbumService();
  const songsService = new SongsService();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan ${server.info.uri}`);
};

init();
