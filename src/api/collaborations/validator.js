const Joi = require("joi");
const InvariantError = require("../../exceptions/InvariantError");

const CollaborationPayload = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
