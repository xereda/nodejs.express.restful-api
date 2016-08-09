"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  (!param.index) ? param.index = false : null;
  (param.unique === true) ? param.index = { unique: true } : null;
  (!param.required) ? param.required = false : null;

  const _object = [{
    specialty: require("./object-objectId")({ name: "specialty", required: true, index: true, schemaName: "Specialty" }),
    regionalCouncilCode: require("./field-string")({ name: "regionalCouncilCode", index: true }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "specialty" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "specialty" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "specialty" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "specialty" }),
    _id: false
  }];

  return _object;

}
