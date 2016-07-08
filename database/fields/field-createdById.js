const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messages = require("../../controller/messages");

module.exports = function(fieldName) {

  const _field = {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: messages.getMessage("error", 8).replace("%1", fieldName) + " " + messages.getDescription("error", 10)
  }

  return _field;

}
