const Joi = require("joi");
const InvariantError = require("../../exceptions/InvariantError");

const PlaylistsongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
const PlaylistSongsValidator = {
  validatePlaylistsongPayload: (payload) => {
    const validationResult = PlaylistsongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
