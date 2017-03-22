"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    agreement: require("./object-objectId")({ name: "agreement", required: true, index: true, schemaName: "Agreement" }),
    code: require("./field-string")({ name: "code", required: true, setUpper: true }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "agreements" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "agreements" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "agreements" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "agreements" }),
    _id: false,
    id: false
  }];

  return _object;

}
