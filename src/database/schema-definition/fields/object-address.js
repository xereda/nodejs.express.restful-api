"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = {
    name: require("./field-string")({ name: "name", minLength: 3, required: true, setUpper: true }),
    number: require("./field-number")({ name: "number", min: 0, max: 99999 }),
    complement: require("./field-string")({ name: "complement" }),
    neighborhood: require("./field-string")({ name: "neighborhood", required: true, setUpper: true }),
    zipCode: require("./field-number")({ name: "zipCode", required: true, max: 99999999, mask: "00.000-000" })
  };

  return _object;

}

// module.exports.referencedFields = [
//   { fieldName: "city", ref: "City"},
// ];
