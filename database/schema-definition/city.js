// scheduledAbsence - Ausencias agendadas

"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true }),
  state: require("./fields/field-string")({ name: "state", required: true, setUpper: true, length: 2 }),
  country: require("./fields/field-string")({ name: "country", required: true, setUpper: true }),
  geoLocation: require("./fields/field-geolocation")({ name: "geoLocation", required: true }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
// module.exports.subDocs = [
//   { fieldName: "allowedHIs", ref: "HealthInsurance", indexField: "allowedHI" },
// ];

// module.exports.referencedFields = [
//   { fieldName: "city", ref: "City"},
// ];

// module.exports.setIndexFields = { date: 1, city: 1 };
// module.exports.setIndexOptions = { unique: true };
