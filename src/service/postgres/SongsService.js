const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  filterPerformerSong,
  filterTitleSong,
  songsdb,
} = require("../../utils");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  //CRUD SongsService

  //Fungsi menambahkan song
  async postSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const resultSongs = await this._pool.query(query);
    // check database
    if (!resultSongs.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }
    return resultSongs.rows[0].id;
  }

  //Fungsi menampilkan seluruh song
  async getSongs(params) {
    const query = {
      text: "SELECT id, title, performer FROM songs",
    };
    const resultSongs = await this._pool.query(query);
    let songs = resultSongs.rows;
    if ("title" in params) {
      songs = songs.filter((s) => filterTitleSong(s, params.title));
    }
    if ("performer" in params) {
      songs = songs.filter((s) => filterPerformerSong(s, params.performer));
    }
    return songs;
  }

  //Fungsi menampilkan song by Id
  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const resultSongs = await this._pool.query(query);
    if (!resultSongs.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
    return resultSongs.rows.map(songsdb)[0];
  }

  //Fungsi mengedit song By Id
  async putSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id",
      values: [title, year, performer, genre, duration, id],
    };
    const resultSongs = await this._pool.query(query);

    if (!resultSongs.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu.Id tidak ditemukan");
    }
  }

  //Fungsi delete song By Id
  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };
    const resultSongs = await this._pool.query(query);

    if (!resultSongs.rows.length) {
      throw new NotFoundError("Gagal menghapus lagu. Id tidak ditemukan");
    }
  }
}

module.exports = SongsService;
