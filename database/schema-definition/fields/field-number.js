"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.min) ? param.min = 0 : null;
  (!param.max) ? param.max = 9999999 : null;
  (!param.required) ? param.required = false : null;

  const _validate = function(v) {
    if ((v >= param.min) && (v <= param.max)) {
      return true;
    } else {
      return false;
    }
  }


  const _field = {
    type: Number,
    validate: [ _validate, messages.getMessage("error", 20).replace("%1", param.min).replace("%2", param.max).replace("%3", param.name) ],
    required: [ param.required, messages.getMessage("error",  8).replace("%1", param.name) ],
    index: param.index
  }

  return _field;

}
