const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const bcrypt = require("bcrypt");
const AuthenticationsError = require("../../exceptions/AuthenticationsError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    //   TODO:Verif User, pastikan belum terdaftar
    await this.verifyNewUsername(username);
    // TODO:Bila Verif lolos, maka masukkan user ke database
    const id = `user-${nanoid(16)}`;
    const saltRounds = 10;
    const hashedpassword = await bcrypt.hash(password, saltRounds);
    // query
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedpassword, fullname],
    };
    const resultUsers = await this._pool.query(query);

    if (!resultUsers.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }
    return resultUsers.rows[0].id;
  }

  //  verifikasi Username
  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const resultUsers = await this._pool.query(query);

    if (resultUsers.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
    // return resultUsers.rows.length;
  }

  // Verifikasi Username
  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };
    const resultUsers = await this._pool.query(query);

    if (!resultUsers.rows.length) {
      throw new AuthenticationsError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedpassword } = resultUsers.rows[0];

    const match = await bcrypt.compare(password, hashedpassword);

    if (!match) {
      throw new AuthenticationsError("Kredensial yang Anda berikan salah");
    }
    return id;
  }
}

module.exports = UsersService;
