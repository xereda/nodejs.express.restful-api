// Módulo de parâmetros de configuração

"use strict";

module.exports = {
  database_host: "localhost", // host de coneção ao servidor de banco de dados
  database_name: "docmob", // nome da database no mongodb

  application_port: 5000, // porta tcp onde a applicação esterá disponível

  // define o _id de um usuário já existente (collection "users")
  // para que a API, no método POST, não mostre a mensagem de crítica
  // para o campo "updatedById" não informado.
  defaultCreatedById: "58124f84c5560561f8e2dfbf",

  // define o máximo de documentos a serem retornados pela API quando não
  // informato o parâmetro "_limit" na query string (/?_limit=[número]).
  pagination_limit: 100,

  // Configuração do CORS
  corsOptions: {
    origin: "*",
    exposedHeaders: ['X-total-Count', 'Authorization'],
    methods: [ "GET", "HEAD", "PUT", "PATCH", "POST", "DELETE" ],
    preflightContinue: false
  },

  // lista de resources da API
  resources: [
              { name: "workplaces", collection: "Workplace", detail: " [ Local de Atendimento ]" },
              { name: "providers", collection: "Provider", detail: " [ Prestadores ]" },
              { name: "professionalActivities", collection: "professionalActivity", detail: " [ Atividade Profissional ]" },
              { name: "specialties", collection: "Specialty", detail: " [ Especializações ]" },
              { name: "users", collection: "User", detail: " [ Usuários ]" },
              { name: "healthInsurances", collection: "HealthInsurance", detail: " [ Plano de Saúde ]" },
              { name: "operators", collection: "Operator", detail: " [ Operadoras de Plano de Saúde ]" },
              { name: "workplaceProviderHIs", collection: "WorkplaceProviderHI", detail: " [ Planos de Saúde Liberados para um Prestador ]" },
              { name: "people", collection: "Person", detail: " [ Usuários do Aplicativo Mobile ]" },
              { name: "lives", collection: "Life", detail: " [ Vidas (Dependentes de um Usuário do App) ]" },
              { name: "scheduleDefinitions", collection: "ScheduleDefinition", detail: " [ Definição da Agenda (Núcleo do Sistema) ]" },
              { name: "schedules", collection: "Schedule", detail: " [ Agendas (Núcleo do Sistema) ]" },
              { name: "scheduleSuggestions", collection: "ScheduleSuggestion", detail: " [ Sugestões de Datas para Agendamento ]" },
              { name: "scheduledAbsences", collection: "ScheduledAbsence", detail: " [ Ausências Agendadas ]" },
              { name: "cities", collection: "City", detail: " [ Cidades Atendidas ]" },
              { name: "holidays", collection: "Holiday", detail: " [ Feriados ]" },
              { name: "holidayExceptions", collection: "HolidayException", detail: " [ Exceções de Feriados ]" },
            ]

};
