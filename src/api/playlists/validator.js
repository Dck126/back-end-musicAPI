const Joi = require("joi");
const InvariantError = require("../../exceptions/ClientError");
// Create schema to validate payload
const PlaylistPayload = Joi.object({
  name: Joi.string().required(),
});
const PlaylistSongsPayload = Joi.object({
  songId: Joi.string().required(),
});
// create method will be used to validate payload from UsersPayloadSchema
const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PlaylistPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSongsPayload: (payload) => {
    const validationResult = PlaylistSongsPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
