// Definção do esquema da collection de locais de atendimento

"use strict";

module.exports.schema = {
  id: false,
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true, minLength: 3, setUpper: true, getUpper: true }),
  email: require("./fields/field-email")({ name: "email", required: true, index: true, unique: true, setLower: true, getLower: true }),
  description: require("./fields/field-string")({ name: "description" }),
  active: require("./fields/field-boolean")({ name: "active" }),
  address: require("./fields/object-address")({ name: "address" }),
  city: require("./fields/object-objectId")({ name: "city", index: true, required: true, schemaName: "City" }),
  geoLocation: require("./fields/field-geoLocation")({ name: "geoLocation", required: true }),
  phone: require("./fields/field-number")({ name: "phone", required: true, min: 1111111111, max: 99999999999 }),
  deadlineTimeForLifeChoose: require("./fields/field-number")({ name: "deadlineTimeForLifeChoose" }),
  nationalCode: require("./fields/field-string")({ name: "nationalCode", setUpper: true, getUpper: true }), //  Cadastro Nacional de Estabelecimentos de Saúde
  providers: require("./fields/object-provider")({ name: "providers" }),
  users: require("./fields/object-user")({ name: "users" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = {
  timestamps: true,
  toJSON: {
    getters: true
  }
};

module.exports.referencedFields = [
  { fieldName: "city", ref: "City"},
];

// array contendo os campos referentes a subdocumentos.
module.exports.subDocs = [
  { fieldName: "providers", ref: "Provider", indexField: "provider" },
  { fieldName: "users", ref: "User", indexField: "user" },
];
