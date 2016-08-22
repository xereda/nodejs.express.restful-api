// Schedule - Determina as instâncias de agendamento.
// É o coração do controle de agendas. Tanto o portal web como o
// aplicativo irão se basear nesta collection.
// Pronúncia: Iskédiou


"use strict";

module.exports.schema = {
  // scheduleDefinition - definição de agenda que serviu de base para essa marcação
  // São as regras vinculadas a definição que permitiram o agendamento neste
  // dia e horário específico.
  scheduleDefinition: require("./fields/object-objectId")({ name: "scheduleDefinition", index: true, required: true, schemaName: "ScheduleDefinition" }),
  life: require("./fields/object-objectId")({ name: "life", index: true, required: true, schemaName: "Life" }),
  specialty: require("./fields/object-objectId")({ name: "specialty", schemaName: "Specialty" }),
  workplace: require("./fields/object-objectId")({ name: "workplace", schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", schemaName: "Provider" }),
  healthInsurance: require("./fields/object-objectId")({ name: "healthInsurance", schemaName: "HealthInsurance" }),
  // parentSchedule - agenda origem da transferência
  parentSchedule: require("./fields/object-objectId")({ name: "parentSchedule", schemaName: "Schedule" }),
  // data da consulta - será informada completa, apenas zerando os segundos e milisegundos.
  // deverá ser infomado no timezone global padrao
  // exemplo: uma consulta para a segunda-feira, do dia 22 de agosto de 2016,
  // às 07h30m, será informada no seguinte padrão: 2016-08-22T10:30:00Z (ISO DATE)
  date: require("./fields/field-date")({ name: "date", requireStartDate: true }),
  duration: require("./fields/field-hhmm")({ name: "duration", required: true }),
  autoApproved: require("./fields/field-boolean")({ name: "autoApproved", required: true }),  // auto "apprillved"
  lifeConfirmationDate: require("./fields/field-date")({ name: "confirmationDate" }), // confirmacao pelo usuario do app
  originCancellation: require("./fields/field-domain")({ name: "originCancellation", domain: [ "app", "portal" ] }),
  status: require("./fields/field-domain")({ name: "status", required: true, index: true, domain: [ "opened", "canceled", "approved", "transferred", "missed", "started",
                                                                                                    "confirmedByLife", "confirmed", "checkIn", "closed", "reopened" ] }),
  canceled: {
    date: require("./fields/field-date")({ name: "canceled.date" }), //kénseld
    user: require("./fields/object-objectId")({ name: "canceled.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "canceled.note", maxLength: 200 })
  },
  approved: {
    date: require("./fields/field-date")({ name: "approved.date" }), // appríval
    user: require("./fields/object-objectId")({ name: "approved.user", schemaName: "User" }), // appríval
    note: require("./fields/field-string")({ name: "approved.note", maxLength: 200 })
  },
  transferred: {
    date: require("./fields/field-date")({ name: "transferred.date" }), // truensfârd
    user: require("./fields/object-objectId")({ name: "transferred.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "transferred.note", maxLength: 200 })
  },
  missed: {
    date: require("./fields/field-date")({ name: "missed.date" }), // méssid
    user: require("./fields/object-objectId")({ name: "missed.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "missed.note", maxLength: 200 })
  },
  started: { // estáred
    date: require("./fields/field-date")({ name: "started.date" }),
    user: require("./fields/object-objectId")({ name: "started.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "started.note", maxLength: 200 })
  },
  confirmed: {
    date: require("./fields/field-date")({ name: "confirmed.date" }), // canfârmed
    user: require("./fields/object-objectId")({ name: "confirmed.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "confirmed.note", maxLength: 200 })
  },
  checkIn: { // data da chegada do paciente no local de atendimento, normalmente confirmada pela recepcionista
    date: require("./fields/field-date")({ name: "checkIn.date" }),
    user: require("./fields/object-objectId")({ name: "checkIn.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "checkIn.note", maxLength: 200 })
  },
  closed: {
    date: require("./fields/field-date")({ name: "closed.date" }), // clôuzid
    user: require("./fields/object-objectId")({ name: "closed.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "closed.note", maxLength: 200 })
  },
  reopened: {
    date: require("./fields/field-date")({ name: "reopened.date" }), // riopend
    user: require("./fields/object-objectId")({ name: "reopened.user", schemaName: "User" }),
    note: require("./fields/field-string")({ name: "reopened.note", maxLength: 200 })
  },
  providerEvaluation: {
    score: require("./fields/field-domain")({ name: "providerEvaluation.score", valueType: "number", domain: [ 1, 2, 3, 4, 5 ] }),
    date: require("./fields/field-date")({ name: "providerEvaluation.date" }),
    note: require("./fields/field-string")({ name: "providerEvaluation.note", maxLength: 200 })
  },
  workplaceEvaluation: {
    score: require("./fields/field-domain")({ name: "workplaceEvaluation.score", valueType: "number", domain: [ 1, 2, 3, 4, 5 ] }),
    date: require("./fields/field-date")({ name: "workplaceEvaluation.date" }),
    note: require("./fields/field-string")({ name: "workplaceEvaluation.note", maxLength: 200 })
  },
  lifeSuggestions: require("./fields/object-lifeSuggestions")({ name: "lifeSuggestions" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
module.exports.subDocs = [
  { fieldName: "lifeSuggestions", ref: "Schedule", indexField: "_id", simple: true },
];

module.exports.subDocsRequiredFields = [
  { subDocName: "lifeSuggestions", field: "weekDays" },
];

module.exports.referencedFields = [
  { fieldName: "scheduleDefinition", ref: "ScheduleDefinition"},
  { fieldName: "life", ref: "Life"},
  { fieldName: "specialty", ref: "Specialty"},
  { fieldName: "workplace", ref: "Workplace"},
  { fieldName: "provider", ref: "Provider"},
  { fieldName: "healthInsurance", ref: "HealthInsurance"},
  { fieldName: "parentSchedule", ref: "Schedule"},
  { fieldName: "canceled.user", ref: "User"},
  { fieldName: "approved.user", ref: "User"},
  { fieldName: "transferred.user", ref: "User"},
  { fieldName: "missed.user", ref: "User"},
  { fieldName: "started.user", ref: "User"},
  { fieldName: "confirmed.user", ref: "User"},
  { fieldName: "checkIn.user", ref: "User"},
  { fieldName: "closed.user", ref: "User"},
  { fieldName: "reopened.user", ref: "User"},
];


module.exports.setIndexFields = { scheduleDefinition: 1, life: 1, specialty: 1, workplace: 1, provider: 1, healthInsurance: 1, parentSchedule: 1, date: 1 };
module.exports.setIndexOptions = { unique: true };
