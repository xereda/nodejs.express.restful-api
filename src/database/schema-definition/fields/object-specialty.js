"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    specialty: require("./object-objectId")({ name: "specialty", required: true, index: true, schemaName: "Specialty" }),
    regionalCouncilCode: require("./field-string")({ name: "regionalCouncilCode", index: true }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "specialties" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "specialties" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "specialties" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "specialties" }),
    _id: false
  }];

  return _object;

}
