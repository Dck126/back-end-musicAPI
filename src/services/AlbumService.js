const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../exceptions/NotFoundError");
const InvariantError = require("../exceptions/InvariantError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    try {
      const id = `album-${nanoid(16)}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const query = {
        text: "INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id",
      };
      const values = [id, name, year, createdAt, updatedAt];
      const result = await this._pool.query(query, values);
      return result.rows[0].id;
    } catch {
      throw new InvariantError("data album tidak dapat ditambahkan");
    }
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: "SELECT id, name, year FROM albums WHERE id = $1",
    };
    const valuesAlbum = [id];
    const resultAlbum = await this._pool.query(queryAlbum, valuesAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const querySong = {
      text: "SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1",
    };
    const valuesSong = [id];
    const resultSong = await this._pool.query(querySong, valuesSong);

    const AlbumRows = resultAlbum.rows[0];
    const SongRows = resultSong.rows;
    return {
      album: AlbumRows,
      songs: SongRows,
    };
  }

  async editAlbumById(id, { name, year }) {
    try {
      const updatedAt = new Date().toISOString();
      const query = {
        text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      };
      const values = [name, year, updatedAt, id];
      const result = await this._pool.query(query, values);
      !result.rows[0].id;
    } catch {
      throw new NotFoundError("Gagal memperbaharui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    try {
      const query = {
        text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      };
      const values = [id];
      const result = await this._pool.query(query, values);
      !result.rows[0].id;
    } catch {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
