const ClientError = require("../../exceptions/ClientError");
const autoBind = require("auto-bind");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this); //mem-bind nilai this untuk seluruh method sekaligus
  }

  // this method will be used to request POST /users
  async postUsersHandler(request, h) {
    try {
      this._validator.validateUsersPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const user_id = await this._service.addUser({
        username,
        password,
        fullname,
      });

      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
        data: {
          userId: user_id,
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

module.exports = UsersHandler;
