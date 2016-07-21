"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _field = {
    type: Date,
    index: param.index,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ]
  }

  return _field;

}
