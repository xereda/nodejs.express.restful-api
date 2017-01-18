"use strict";

module.exports = function(param) {

  const validate = require("mongoose-validator");
  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.endValueValidator) ? param.endValueValidator = false : null;
  (!param.endFieldValidator) ? param.endFieldValidator = "" : null;
  (param.unique === true) ? param.index = { unique: true, sparse: true } : null;
  (!param.required) ? param.required = false : null;

  const _validator = [
    validate({
      validator: 'matches',
      arguments: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      message: messages.getMessage("error", 39).replace("%1", param.name)
    }),
    validate({
      validator: function(value) {
        if (param.endValueValidator === true) {
          if (this[param.endFieldValidator] <= value) {
            return false;
          }
          return true;
        }
      },
      message: messages.getMessage("error", 40).replace("%1", param.name).replace("%2", param.endFieldValidator)
    }),
  ];

  const _field = {
    type: String,
    //set: _set,
    index: param.index,
    validate: _validator,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ]
  }

  return _field;
}
