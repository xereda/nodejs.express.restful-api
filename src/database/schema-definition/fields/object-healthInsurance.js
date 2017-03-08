"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    healthInsurance: require("./object-objectId")({ name: "healthInsurance", required: true, index: true, schemaName: "HealthInsurance" }),
    code: require("./field-string")({ name: "code", required: true, setUpper: true }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "healthInsurances" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "healthInsurances" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "healthInsurances" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "healthInsurances" }),
    _id: false,
    id: false
  }];

  return _object;

}
