const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { songsdb } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistsong(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const resultPlaylistSongs = await this._pool.query(query);

    if (!resultPlaylistSongs.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return resultPlaylistSongs.rows[0].id;
  }

  async getPlaylistsongById(id) {
    const query = {
      text: `SELECT playlist_songs.*, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON songs.id = playlist_songs.song_id 
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };
    const resultPlaylistSongs = await this._pool.query(query);

    if (!resultPlaylistSongs.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return resultPlaylistSongs.rows.map(songsdb);
  }

  async deletePlaylistsong(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const resultPlaylistSongs = await this._pool.query(query);

    if (!resultPlaylistSongs.rows.length) {
      throw new InvariantError("Lagu gagal dihapus");
    }
  }

  async verifyCollaborator(songId, playlistId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2",
      values: [songId, playlistId],
    };

    const resultPlaylistSongs = await this._pool.query(query);

    if (!resultPlaylistSongs.rows.length) {
      throw new InvariantError("Lagu gagal diverifikasi");
    }
  }
}

module.exports = PlaylistSongsService;
