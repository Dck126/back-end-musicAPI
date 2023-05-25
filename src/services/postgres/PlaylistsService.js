const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { songsdb } = require("../../utils");

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };
    const resultPlaylist = await this._pool.query(query);
    if (!resultPlaylist.rows.length) {
      throw new InvariantError("Playlists gagal ditambahkan");
    }
    return resultPlaylist.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const resultPlaylist = await this._pool.query(query);
    console.log(resultPlaylist);
    return resultPlaylist.rows.map(songsdb);
  }

  async getPlaylistById({ id }) {
    const query = {
      text: `SELECT playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [id],
    };
    const resultPlaylist = await this._pool.query(query);
    return resultPlaylist.rows.map(songsdb)[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };
    const resultPlaylist = await this._pool.query(query);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError("Playlist menghapus lagu. Id tidak ditemukan");
    }
  }

  async verifyPlaylistsOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const resultPlaylist = await this._pool.query(query);
    if (!resultPlaylist.rows.length) {
      throw new NotFoundError("Resource yang Anda minta tidak ditemukan");
    }
    const playlist = resultPlaylist.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistsOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
