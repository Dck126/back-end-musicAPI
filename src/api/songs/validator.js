const Joi = require("joi");
const InvariantError = require("../../exceptions/InvariantError");

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().max(new Date().getFullYear()).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
