"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _validate = function(v) {
    if (param.required === false) {
      return true;
    } else if (param.domain.includes(v)) {
      return true;
    }
    return false;
  }

  const _set = (v) => v.toUpperCase();
  const _get = (v) => v.toUpperCase();

  const _field = {
    type: String,
    set: _set,
    get: _get,
    validate: [ _validate, messages.getMessage("error", 22).replace("%1", param.domain).replace("%2", param.name) ],
    required: [ param.required, messages.getMessage("error", 22).replace("%1", param.domain).replace("%2", param.name) ]
  }

  return _field;

}
