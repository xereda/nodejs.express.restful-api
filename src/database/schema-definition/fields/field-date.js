"use strict";

module.exports = function(param) {

  const validate = require("mongoose-validator");
  const messages = require("../../../controller/messages");

  (!param.endValueValidator) ? param.endValueValidator = false : null;
  (!param.endFieldValidator) ? param.endFieldValidator = "" : null;
  (!param.requireStartDate) ? param.requireStartDate = false : null;
  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;


  let _prefix = "";

  if ((param.subDoc !== undefined) && (param.subDoc !== "")) {
    _prefix = param.subDoc + ".";
  }

  let _now;

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



        if ((param.requireStartDate === true) && ((this.isNew === true) || (this.isModified(param.name) === true))) {

          _now = new Date();

          (param.setHours) ? _now.setHours(0,0,0,0) : null;

          if (value < _now) {
            return false;
          }

          return true;
        }
      },
      message: messages.getMessage("error", 42).replace("%1", param.name)
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

  if (param.default) {
    _field["default"] = param.default;
  }

  return _field;

}
