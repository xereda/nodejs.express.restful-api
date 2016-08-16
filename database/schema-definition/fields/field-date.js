"use strict";

module.exports = function(param) {

  const validate = require("mongoose-validator");
  const messages = require("../../../controller/messages");

  (!param.endValueValidator) ? param.endValueValidator = false : null;
  (!param.endFieldValidator) ? param.endFieldValidator = "" : null;
  (!param.requiredStartDate) ? param.requiredStartDate = new Date("1900-01-01") : null;
  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;


  let _prefix = "";

  if ((param.subDoc !== undefined) && (param.subDoc !== "")) {
    _prefix = param.subDoc + ".";
  }

  const _validator = [
    validate({
      validator: function(value) {
        if (param.endValueValidator === true) {
          if (this[param.endFieldValidator] < value) {
            return false;
          }
          return true;
        }
      },
      message: messages.getMessage("error", 41).replace("%1", param.name).replace("%2", param.endFieldValidator)
    }),
    validate({
      validator: function(value) {
        if (param.requiredStartDate) {

          console.log("typeof param.requiredStartDate: ", typeof param.requiredStartDate);

          (param.setHours) ? param.requiredStartDate.setHours(0,0,0,0) : null;

          if (value < param.requiredStartDate) {
            console.log("param.requiredStartDate: ", param.requiredStartDate);
            console.log("value: ", value);
            console.log("value.toISOString(): ", value.toISOString());
            return false;
          }

          return true;
        }
      },
      message: messages.getMessage("error", 42).replace("%1", param.name).replace("%2", param.requiredStartDate)
    }),
  ];

  const _set = function(v) {
    const _dateReturn = new Date(v);
    if (param.setHours) {
      return _dateReturn.setHours(param.setHours.hour, param.setHours.min, param.setHours.sec, param.setHours.millisec);
    }
    return _dateReturn;
  }

  const _field = {
    type: Date,
    set: _set,
    index: param.index,
    validate: _validator,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", _prefix + param.name) ]
  }

  return _field;

}
