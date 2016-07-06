// Definção do esquema da collection de usuários

"use strict";

const messages = require("../controller/messages");

module.exports.schema = {
  email: require("./fields/field-email"),
  name: require("./fields/field-name"),
  password: require("./fields/field-password"),
  admin: require("./fields/field-boolean")("admin"),
  active: require("./fields/field-boolean")("active"),
  createdById: require("./fields/field-createdById")("createdById"),
  updatedById: require("./fields/field-updatedById")("updatedById"),
};

module.exports.schemaProperties = { timestamps: true };
