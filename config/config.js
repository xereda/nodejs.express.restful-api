// Módulo de parâmetros de configuração

"use strict";

module.exports = {
  database_host: "localhost", // host de coneção ao servidor de banco de dados
  database_name: "docmob", // nome da database no mongodb

  application_port: 5000, // porta tcp onde a applicação esterá disponível

  // define o _id de um usuário já existente (collection "users")
  // para que a API, no método POST, não mostre a mensagem de crítica
  // para o campo "updatedById" não informado.
  defaultCreatedById: "57a2bb75be785a529de5fb33",

  // define o máximo de documentos a serem retornados pela API quando não
  // informato o parâmetro "_limit" na query string (/?_limit=[número]).
  pagination_limit: 100,

  // lista de resources da API
  resources: [
              { name: "workplaces", collection: "Workplace" },
              { name: "providers", collection: "Provider" },
              { name: "professionalActivities", collection: "professionalActivity" },
              { name: "specialties", collection: "Specialty" },
              { name: "users", collection: "User" },
              { name: "healthInsurances", collection: "HealthInsurance" },
              { name: "operators", collection: "Operator" },
              { name: "workplaceProviderHIs", collection: "WorkplaceProviderHI" },
              { name: "people", collection: "Person" },
              { name: "lives", collection: "Life" },
              { name: "scheduleDefinitions", collection: "ScheduleDefinition" },
              { name: "scheduledAbsences", collection: "ScheduledAbsence" },
              { name: "cities", collection: "City" },
              { name: "holidays", collection: "Holiday" },
              { name: "holidayExceptions", collection: "HolidayException" },
              { name: "schedules", collection: "Schedule" },
            ]

};
