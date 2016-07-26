"use strict";

module.exports = function(param) {

  const _validate = function(v) {

    // consiste se a geolocalização informada - LONGITUDE
    if ((parseFloat(v[0]) > -180) && (parseFloat(v[0]) < 180)) {
      // LATITUDE
      if ((parseFloat(v[1]) > -85) && (parseFloat(v[1]) < 85)) {
        return true;
      }
    }
    return false;
  }

  const messages = require("../../../controller/messages");


  (!param.index) ? param.index = "2dsphere" : null;
  (!param.required) ? param.required = false : null;

  const _field = {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: { type: [Number],
                   validate: [ _validate, messages.getMessage("error", 21).replace("%1", param.name) ],
                   required: messages.getMessage("error", 21).replace("%1", param.name) }
  }

  return _field;

}
