const Joi = require("joi");

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().max(new Date().getFullYear()).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { SongsPayloadSchema };
