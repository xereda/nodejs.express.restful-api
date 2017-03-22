// Nome da collection: Agreement
// Finalidade: Gerenciar convênsios, no caso de planos de saúde: Unimed, Agemed, Saúde Bradesco

"use strict";

module.exports.schema = {
  id: false,
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true, minLength: 3, setUpper: true, getUpper: true }),
  shortName: require("./fields/field-name")({ name: "shortName", required: true, index: true, unique: true, minLength: 3, maxLength: 10, setUpper: true, getUpper: true }),
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

module.exports.refIdentityCollections = [
  { collection: 'Operator', field: 'agreement' },
]
