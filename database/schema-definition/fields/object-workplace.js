"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _object = [{
    workplace: require("./object-ObjectId")({ name: "workplace", index: true, schemaName: "Workplace" }),
    _id: false
  }];

  return _object;

}
