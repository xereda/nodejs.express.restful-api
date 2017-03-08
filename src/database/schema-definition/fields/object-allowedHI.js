"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    allowedHI: require("./object-objectId")({ name: "allowedHI", required: true, index: true, schemaName: "HealthInsurance" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "allowedHIs" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "allowedHIs" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "allowedHIs" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "allowedHIs" }),
    _id: false,
    id: false
  }];

  return _object;

}
