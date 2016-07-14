const messages = require("../../controller/messages");

//const _get = (v) => v.toUpperCase();
const _set = (v) => v.toUpperCase();
const _validate = (v) => v.length >= 3;

const _field = {
  type: String,
  set: _set,
  validate: [ _validate, messages.getMessage("error", 17).replace("%1", "name")],
  required: messages.getMessage("error", 8).replace("%1", "name"),
  index: true
}


module.exports = _field;
