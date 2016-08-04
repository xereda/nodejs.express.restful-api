"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (param.unique === true) ? param.index = { unique: true } : null;
  (!param.minLength) ? param.minLength = 0 : null;
  (!param.required) ? param.required = false : null;

  //const _get = (v) => v.toUpperCase();
  const _set = (v) => v.toUpperCase();
  const _validate = (v) => v.length >= param.minLength;

  const _field = {
    type: String,
    set: _set,
    index: param.index,
    validate: [ _validate, messages.getMessage("error", 17).replace("%2", param.minLength).replace("%1", param.name) ],
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ]
  }

  return _field;

}
