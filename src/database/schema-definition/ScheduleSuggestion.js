// ScheduleSuggestion - Determina as sugestoes de agenda enviadas pelo prestador
// Pronúncia: Iskédjou Sudjésthian


"use strict";

module.exports.schema = {
  schedule: require("./fields/object-objectId")({ name: "schedule", index: true, required: true, schemaName: "Schedule" }),
  workplace: require("./fields/object-objectId")({ name: "workplace", schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", schemaName: "Provider" }),
  status: require("./fields/field-domain")({ name: "status", required: true, index: true, domain: [ "sent", "accepted", "wantsNewSuggestions" ] }),
  dateSuggestion1: require("./fields/field-date")({ name: "dateSuggestion1", required: true, requireStartDate: true }),
  dateSuggestion2: require("./fields/field-date")({ name: "dateSuggestion2", requireStartDate: true }),
  dateSuggestion3: require("./fields/field-date")({ name: "dateSuggestion3", requireStartDate: true }),
  acceptsJoinTheQueue: require("./fields/field-boolean")({ name: "acceptsJoinTheQueue" }),
  // define a data que foi escolhida pelo usuario - 1, 2 ou 3
  acceptedSuggestionNumber: require("./fields/field-domain")({ name: "acceptedSuggestionNumber", valueType: "number", domain: [ 1, 2, 3 ] }), // acsépted sudjésthian namber
  wantsNewSuggestions: require("./fields/field-boolean")({ name: "wantsNewSuggestions" }),
  wantsNewSuggestionsNote: require("./fields/field-string")({ name: "wantsNewSuggestionsNote", maxLength: 200 }),
  userResponseDate: require("./fields/field-date")({ name: "userResponseDate" }), // data da resposta do usuario
  choiceDeadline: require("./fields/field-date")({ name: "choiceDeadline", required: true, requireStartDate: true }), // data limite para escolhe de uma data pelo usuario
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
// module.exports.subDocs = [
//   { fieldName: "lifeSuggestions", ref: "Schedule", indexField: "_id", simple: true },
// ];

// module.exports.subDocsRequiredFields = [
//   { subDocName: "lifeSuggestions", field: "weekDays" },
// ];

module.exports.referencedFields = [
  { fieldName: "schedule", ref: "Schedule"},
  { fieldName: "workplace", ref: "Workplace"},
  { fieldName: "provider", ref: "Provider"},
];


module.exports.setIndexFields = { schedule: 1, life: 1, workplace: 1, provider: 1, status: 1 };
module.exports.setIndexOptions = { unique: true };
