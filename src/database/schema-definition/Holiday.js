
"use strict";

module.exports.schema = {
  id: false,
  date: require("./fields/field-date")({ name: "date", required: true, index: true }),
  name: require("./fields/field-name")({ name: "name", required: true, index: true, setUpper: true, getUpper: true }),
  recurrent: require("./fields/field-boolean")({ name: "recurrent", required: true }),
  regional: require("./fields/field-boolean")({ name: "regional", required: true }),
  city: require("./fields/object-objectId")({ name: "city", schemaName: "City", acceptEmpty: true }),
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

module.exports.referencedFields = [
  { fieldName: "city", ref: "City" },
];

module.exports.setIndexFields = { date: 1, city: 1 };
module.exports.setIndexOptions = { unique: true };

module.exports.refIdentityCollections = {

}
