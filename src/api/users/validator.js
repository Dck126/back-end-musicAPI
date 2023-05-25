const Joi = require("joi");
const InvariantError = require("../../exceptions/ClientError");
// Create schema to validate payload
const UsersPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

// create method will be used to validate payload from UsersPayloadSchema
const UsersValidator = {
  validateUsersPayload: (payload) => {
    const validationResult = UsersPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
