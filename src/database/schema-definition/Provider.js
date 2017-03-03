// Definção do esquema da collection de prestadores de serviço

"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, index: true, minLength: 3, setUpper: true, getUpper: true }),
  description: require("./fields/field-string")({ name: "description" }),
  email: require("./fields/field-email")({ name: "email", required: true, index: true, unique: true, setLower: true, getLower: true }),
  active: require("./fields/field-boolean")({ name: "active" }),
  entityType: require("./fields/field-domain")({ name: "entityType", required: true, domain: ["F", "J"] }),
  cpf: require("./fields/field-cpf")({ name: "cpf", unique: true, sparse: true }),
  cnpj: require("./fields/field-cnpj")({ name: "cnpj", unique: true, sparse: true }),
  workplaces: require("./fields/object-workplace")({ name: "workplaces" }),
  specialties: require("./fields/object-specialty")({ name: "specialties" }),
  blockedLives: require("./fields/object-blockedLife")({ name: "blockedLives" }),
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

// array contendo os campos referentes a subdocumentos.
module.exports.subDocs = [
  { fieldName: "workplaces", ref: "Workplace", indexField: "workplace"},
  { fieldName: "specialties", ref: "Specialty", indexField: "specialty"},
  { fieldName: "blockedLives", ref: "Life", indexField: "blockedLife"},

];
