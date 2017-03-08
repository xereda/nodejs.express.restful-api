
"use strict";

module.exports.schema = {
  id: false,
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true, setUpper: true }),
  state: require("./fields/field-string")({ name: "state", required: true, setUpper: true, length: 2 }),
  country: require("./fields/field-string")({ name: "country", required: true, setUpper: true }),
  geoLocation: require("./fields/field-geoLocation")({ name: "geoLocation", required: true }),
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
// module.exports.subDocs = [
//   { fieldName: "allowedHIs", ref: "HealthInsurance", indexField: "allowedHI" },
// ];

// module.exports.referencedFields = [
//   { fieldName: "city", ref: "City"},
// ];

// module.exports.setIndexFields = { date: 1, city: 1 };
// module.exports.setIndexOptions = { unique: true };

module.exports.refIdentityCollections = [
  { collection: 'Holiday', field: 'city' },
]
