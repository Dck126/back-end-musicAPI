require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// Service
const AlbumService = require("../services/AlbumService");
const SongService = require("../services/SongService");
const UserService = require("../services/UserService");
const PlaylistService = require("../services/PlaylistService");
const AuthenticationService = require("../services/AuthenticationService");
const CollaborationService = require("../services/CollaborationService");
const ActivityService = require("../services/ActivityService");

// Plugin For Handler Request
const albums = require("../api/albums");
const songs = require("../api/songs");
const users = require("../api/users");
const authentications = require("../api/authentications");
const playlists = require("../api/playlists");
const collaborations = require("../api/collaborations");
// Exceptions
const ClientError = require("../exceptions/ClientError");
// Token
const TokenManager = require("../tokenize/TokenManager");

async function createServer() {
  // create services that will be used by the plugin
  const albumsService = new AlbumService();
  const songsService = new SongService();
  const usersService = new UserService();
  const activityService = new ActivityService();
  const collaborationService = new CollaborationService(usersService);
  const authenticationsService = new AuthenticationService();
  const playlistsService = new PlaylistService(
    songsService,
    activityService,
    collaborationService
  );

  //create HTTP server using hapi
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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("music_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      Credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
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
        service: playlistsService,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistsService,
      },
    },
  ]);

  //   Error Handling
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  return server;
}

module.exports = createServer;
