const Joi = require("joi");
const InvariantError = require("../../exceptions/InvariantError");

const PostAuthenticationsPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationsPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationsPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const AuthenticationValidator = {
  validatePostAuthenticationsPayloadSchema: (payload) => {
    const validationResult = PostAuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationsPayloadSchema: (payload) => {
    const validationResult = PutAuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationsPayloadSchema: (payload) => {
    const validationResult =
      DeleteAuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
