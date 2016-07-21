"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _set = (v) => v.toLowerCase();
  const _validate = (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);

  const _field = {
    type: String,
    set: _set,
    index: param.index,
    validate: [ _validate, messages.getMessage("error", 18) ],
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ]
  }

  return _field;
}
