const messages = require("../../controller/messages");

module.exports = function(fieldName) {

  const _validate = (v) => typeof v === "boolean";

  const _field = {
    type: Boolean,
    validate: [ _validate, messages.getMessage("error", 7).replace("%1", fieldName) ],
    required: messages.getMessage("error", 8).replace("%1", fieldName),
  }

  return _field;

}
