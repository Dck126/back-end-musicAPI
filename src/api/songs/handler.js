const ClientError = require("../../exceptions/ClientError");
const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this); //mem-bind nilai this untuk seluruh method sekaligus
  }

  //Request Handling
  //Request menambahkan lagu
  async postSongHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } =
        request.payload;
      const songId = await this._service.postSong({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      });

      const response = h.response({
        status: "success",
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
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

  //Request menampilkan seluruh lagu
  async getSongsHandler(request, h) {
    // const { title, performer } = request.params;
    const params = request.query;
    const songs = await this._service.getSongs(params);

    const response = h.response({
      status: "success",
      data: {
        // songs,
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //Request menampilkan lagu by Id
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      const response = h.response({
        status: "success",
        data: {
          song,
        },
      });
      response.code(200);
      return response;
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

  //Request mengedit lagu by Id
  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const { id } = request.params;
      await this._service.putSongById(id, request.payload);

      const response = h.response({
        status: "success",
        message: "Lagu berhasil diperbaruhi",
      });
      response.code(200);
      return response;
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

  //Request menghapus lagu by Id
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      const response = h.response({
        status: "success",
        message: "Lagu berhasil dihapus",
      });
      response.code(200);
      return response;
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
}

module.exports = SongsHandler;
