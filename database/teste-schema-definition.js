// Definção do esquema da collection de usuários

"use strict";

const messages = require("../controller/messages");

module.exports.schema = {
  name: require("./fields/field-name"),
  createdById: require("./fields/field-createdById")("createdById"),
  updatedById: require("./fields/field-updatedById")("updatedById"),
  createdAt: require("./fields/field-date")("createdAt"),
  updatedAt: require("./fields/field-date")("updateAt")
};

module.exports.schemaProperties = { timestamps: true };
