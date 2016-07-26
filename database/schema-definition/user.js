// Definção do esquema da collection de usuários

"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, minLength: 3, index: true }),
  email: require("./fields/field-email")({ name: "email", required: true }),
  password: require("./fields/field-password")({ name: "password", required: true, minLength: 5 }),
  admin: require("./fields/field-boolean")({ name: "admin" }),
  active: require("./fields/field-boolean")({ name: "active" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };
