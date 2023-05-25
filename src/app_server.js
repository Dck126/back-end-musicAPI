// import .env conf
require("dotenv").config();

// Conf Server
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// plugin
const albums = require("./api/albums");
const songs = require("./api/songs");
const users = require("./api/users");
const authentications = require("./api/authentications");
const playlists = require("./api/playlists");
const collaborations = require("./api/collaborations");
const playlist_songs = require("./api/playlists_song");

// Service CRUD
const AlbumService = require("./services/postgres/AlbumService");
const SongsService = require("./services/postgres/SongsService");
const UsersService = require("./services/postgres/UsersService");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const PlaylistsService = require("./services/postgres/PlaylistsService");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const PlaylistSongsService = require("./services/postgres/PlaylistSongsService");

// Token Manager
const TokenManager = require("./tokenize/TokenManager");

const init = async () => {
  const albumService = new AlbumService();
  const songsService = new SongsService();
  const collaborationsService = new CollaborationsService();
  const usersService = new UsersService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const authenticationsService = new AuthenticationsService();
  const playlistSongsService = new PlaylistSongsService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // memasang plugin JWT
  await server.register([
    // Plugin JWT/@hapi
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("musicapp_jwt_strategy", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
      },
    },
    {
      plugin: playlist_songs,
      options: {
        playlistSongsService,
        playlistsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan ${server.info.uri}`);
};

init();
