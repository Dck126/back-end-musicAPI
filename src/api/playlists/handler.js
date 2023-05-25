const ClientError = require("../../exceptions/ClientError");
const autoBind = require("auto-bind");

class PlaylistHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this); //mem-bind nilai this untuk seluruh method sekaligus
  }
  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistsPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlist_id = await this._playlistsService.addPlaylist({
        name,
        credentialId,
      });

      const response = h.response({
        status: "success",
        data: {
          playlist_id,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // Error Handling
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      console.log(playlists);
      const response = h.response({
        status: "success",
        data: {
          playlists: playlists.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
          })),
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      // Error Handling
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._playlistsService.getPlaylistById(id);

      return {
        status: "success",
        data: {
          playlist,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistsOwner(id, credentialId);
      await this._playlistsService.deletePlaylistById(id);
      const response = h.response({
        status: "success",
        message: "playlist berhasil dihapus",
      });
      response.code(200);
      return response;
    } catch (error) {
      // Error Handling
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistHandler;
