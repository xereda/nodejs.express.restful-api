"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = {
    uri: require("./field-string")({ name: param.name + ".uri", required: true, setLower: true, getLower: true }),
    user: require("./field-string")({ name: param.name + ".user", required: true }),
    password: require("./field-password")({ name: param.name + ".password", required: true })
  };

  return _object;

}
