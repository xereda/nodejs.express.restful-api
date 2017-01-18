"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;
  (!param.subDoc) ? param.subDoc = "" : param.subDoc + ".";

  const _validate = (v) => typeof v === "boolean";

  const _field = {
    type: Boolean,
    index: param.index,
    validate: [ _validate, messages.getMessage("error", 7).replace("%1", param.subDoc + param.name) ],
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.subDoc + param.name) ],
  }

  if (param.default !== undefined) {
    _field["default"] = param.default;
  }

  return _field;

}
