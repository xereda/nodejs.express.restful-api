"use strict";

module.exports = function(param) {

  const validate = require("mongoose-validator");
  const messages = require("../../../controller/messages");

  let _prefix = "";

  if ((param.subDoc !== undefined) && (param.subDoc !== "")) {
    _prefix = param.subDoc + ".";
  }

  const _validator = [
    validate({
      validator: function(value) {
        if (param.endValueValidator === true) {
          if (this[param.endFieldValidator] <= value) {
            return false;
          }
          return true;
        }
      },
      message: messages.getMessage("error", 41).replace("%1", param.name).replace("%2", param.endFieldValidator)
    }),
    ];

  (!param.endValueValidator) ? param.endValueValidator = false : null;
  (!param.endFieldValidator) ? param.endFieldValidator = "" : null;
  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _field = {
    type: Date,
    index: param.index,
    validate: _validator,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", _prefix + param.name) ]
  }

  return _field;

}
