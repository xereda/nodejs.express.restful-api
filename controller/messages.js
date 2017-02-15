"use strict";

// Importa os objetos de mensagens e de erros
const _messages = require("../config/messages");
const _errors = require("../config/errors");

// Controla o retorno para que não volte undefined para o script principal.
// Caso o índíce informado (indexMessage) não corresponder a uma
// mensagem na array de objetos, retorna mensagem padrão no lugar de undefined.
const _checkUndefined = function(type, object, indexMessage) {
  let literal;
  (type == "message") ? literal = "A mensagem" : literal = "O erro";
  if ((object) && (indexMessage > 0)) return object;
  return {code: 0, description: literal + " com índice " + indexMessage + " não foi cadastrada!"};
}

// Recupera o objeto inteiro da mensagem.
const _getObject = function(type, indexMessage) {
  return eval("_" + type + "s").find(function(e) {
    return e.code == indexMessage;
  });
}

// Recupera a mensagem no padrão "[999] Mensagem".
const _getMessage = function(type, indexMessage) {
  let _object = _checkUndefined(type, _getObject(type, indexMessage), indexMessage);
  return "[" + _object.code + "] " + _object.description;
}

// Recupera apenas a descrição da mensagem
const _getDescription = function(type, indexMessage) {
  let _object = _checkUndefined(type, _getObject(type, indexMessage), indexMessage);
  return _object.description;
}

const _translateCollections = function(_array) {
  const _translateArray = _array.map((element) => {
    return element.replace("City", "Cidades")
                  .replace("HealthInsurance", "Convênios")
                  .replace("Holiday", "Feriados")
                  .replace("HolidayExcetion", "Exceções de feriados")
                  .replace("Life", "Vidas")
                  .replace("Operator", "Operadoras")
                  .replace("Person", "Pessoas")
                  .replace("ProfessionalActivity", "Ramos de Atividades")
                  .replace("Provider", "Prestadores")
                  .replace("Schedule", "Agenda")
                  .replace("ScheduleAbsence", "Ausências Agendadas")
                  .replace("ScheduleDefinition", "Definição da Agenda")
                  .replace("ScheduleSuggestion", "Sugestões de Datas")
                  .replace("Specialty", "Especializações")
                  .replace("User", "Usuários")
                  .replace("Workplace", "Locais de Atendimento")
                  .replace("WorkplaceProviderHI", "Convênios de um Prestador");
  });
  return _translateArray;
}

// Objeto de interface para acesso as funções de recuperação de mensagens.
const messageObject = {
  getObject: _getObject,
  getMessage: _getMessage,
  getDescription: _getDescription,
  translateCollections: _translateCollections
};

// Exporta o objeto de interface
module.exports = messageObject;
