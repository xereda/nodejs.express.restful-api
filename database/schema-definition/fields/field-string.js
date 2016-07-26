"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  //const _get = (v) => v.toUpperCase();
  const _set = function(v) {
    if (param.setUpper) return v.toUpperCase();
    if (param.setLower) return v.toLowerCase();
    return v;
  }

  const _validate = function(v) {

    if ((param.minLength) && (v.length < param.minLength)) {
      return false;
    } else if ((param.maxLength) && (v.length > param.maxLength)) {
      return false;
    } else if ((param.length) && (v.length != param.length)) {
      return false;
    } else  {
      return true;
    }

  }

  const _message = function() {

    if ((param.minLength) && (param.maxLength)) {

      return messages.getMessage("error", 23).replace("%1", param.name)
                                             .replace("%2", param.minLength)
                                             .replace("%3", param.maxLength);

    } else if (param.minLength) {
      return messages.getMessage("error", 24).replace("%1", param.name)
                                             .replace("%2", param.minLength);

    } else if (param.maxLength) {
      return messages.getMessage("error", 25).replace("%1", param.name)
                                             .replace("%2", param.maxLength);

    } else {

      return messages.getMessage("error", 26).replace("%1", param.name)
                                             .replace("%2", param.length);

    }

  }


  const _field = {
    type: String,
    set: _set,
    validate: [ _validate, _message() ],
    required: [ param.required, messages.getMessage("error",  8).replace("%1", param.name) ],
    index: param.index
  }

  return _field;

}
