// Life - Dependentes de uma pessoa / de um usuário do app

"use strict";

module.exports.schema = {
  id: false,
  person: require("./fields/object-objectId")({ name: "person", index: true, required: true, schemaName: "Person" }),
  name: require("./fields/field-name")({ name: "name", required: true, minLength: 3, index: true, setUpper: true, getUpper: true }),
  shortName: require("./fields/field-name")({ name: "shortName", required: true, minLength: 3, maxLength: 10, setUpper: true, getUpper: true }),
  cpf: require("./fields/field-cpf")({ name: "cpf" }),
  birthday: require("./fields/field-date")({ name: "birthday", required: true }),
  mothersName: require("./fields/field-name")({ name: "mothersName", required: true, minLength: 3, seUpper: true, getUpper: true }),
  agreements: require("./fields/object-agreement")({ name: "agreements" }),
  active: require("./fields/field-boolean")({ name: "active" }),
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
  { fieldName: "agreements", ref: "Agreement", indexField: "agreement" },
];

module.exports.referencedFields = [
  { fieldName: "person", ref: "Person"},
];

module.exports.setIndexFields = { name: 1, person: 1 };
module.exports.setIndexOptions = { unique: true };
