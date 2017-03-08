// Definção do esquema da collection de usuários

"use strict";

module.exports.schema = {
  id: false,
  name: require("./fields/field-name")({ name: "name", required: true, minLength: 3, index: true, setUpper: true, getUpper: true }),
  email: require("./fields/field-email")({ name: "email", required: true, index: true, unique: true, setUpper: true, getUpper: true }),
  password: require("./fields/field-password")({ name: "password", required: true, minLength: 5 }),
  admin: require("./fields/field-boolean")({ name: "admin", required: true }),
  active: require("./fields/field-boolean")({ name: "active", required: true }),
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
  { collection: 'City', field: 'createdById' },
  { collection: 'City', field: 'updatedById' },
  { collection: 'HealthInsurance', field: 'createdById' },
  { collection: 'HealthInsurance', field: 'updatedById' },
  { collection: 'Holiday', field: 'createdById' },
  { collection: 'Holiday', field: 'updatedById' },
  { collection: 'HolidayException', field: 'createdById' },
  { collection: 'HolidayException', field: 'updatedById' },
  { collection: 'Life', field: 'createdById' },
  { collection: 'Life', field: 'updatedById' },
  { collection: 'Operator', field: 'createdById' },
  { collection: 'Operator', field: 'updatedById' },
  { collection: 'Person', field: 'createdById' },
  { collection: 'Person', field: 'updatedById' },
  { collection: 'ProfessionalActivity', field: 'createdById' },
  { collection: 'ProfessionalActivity', field: 'updatedById' },
  { collection: 'Provider', field: 'createdById' },
  { collection: 'Provider', field: 'updatedById' },
  { collection: 'Schedule', field: 'createdById' },
  { collection: 'Schedule', field: 'updatedById' },
  { collection: 'ScheduledAbsence', field: 'createdById' },
  { collection: 'ScheduledAbsence', field: 'updatedById' },
  { collection: 'ScheduleDefinition', field: 'createdById' },
  { collection: 'ScheduleDefinition', field: 'updatedById' },
  { collection: 'ScheduleSuggestion', field: 'createdById' },
  { collection: 'ScheduleSuggestion', field: 'updatedById' },
  { collection: 'Specialty', field: 'createdById' },
  { collection: 'Specialty', field: 'updatedById' },
  { collection: 'User', field: 'createdById' },
  { collection: 'User', field: 'updatedById' },
  { collection: 'Workplace', field: 'createdById' },
  { collection: 'Workplace', field: 'updatedById' },
  { collection: 'WorkplaceProviderHI', field: 'createdById' },
  { collection: 'WorkplaceProviderHI', field: 'updatedById' },
]
