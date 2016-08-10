"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = {
    name: require("./field-string")({ name: "streetName", minLength: 3, required: true, setUpper: true }),
    number: require("./field-number")({ name: "streetNumber", min: 0, max: 9999999 }),
    complement: require("./field-string")({ name: "addressComplement" }),
    neighborhood: require("./field-string")({ name: "neighborhood", required: true, setUpper: true }),
    zipCode: require("./field-number")({ name: "zipCode", required: true, max: 99999999 }),
    city: require("./field-string")({ name: "city", required: true, setUpper: true }),
    state: require("./field-string")({ name: "state", required: true, setUpper: true, length: 2 }),
    country: require("./field-string")({ name: "country", required: true, setUpper: true })
  };

  return _object;

}
