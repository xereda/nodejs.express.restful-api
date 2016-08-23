// lifeSuggestions = Sugestões de datas possíveis, informadas pelo
// solicitante (paciente/vida/life) para agendamento da consulta.
// Pronúncia: life "sudjésthians"

"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    weekDays: [ require("./field-domain")({ name: "weekDays", required: true, index: true, subDoc: "lifeSuggestions", domain: [ "SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM" ] }) ],
    morning: require("./field-boolean")({ name: "morning", subDoc: "lifeSuggestions" }),
    earlyMorning: require("./field-boolean")({ name: "earlyMorning", subDoc: "lifeSuggestions" }),
    lateMorning: require("./field-boolean")({ name: "lateMorning", subDoc: "lifeSuggestions" }),
    afternoon: require("./field-boolean")({ name: "afternoon", subDoc: "lifeSuggestions" }),
    earlyAfternoon: require("./field-boolean")({ name: "earlyAfternoon", subDoc: "lifeSuggestions" }),
    lateAfternoon: require("./field-boolean")({ name: "lateAfternoon", subDoc: "lifeSuggestions" }),
    evening: require("./field-boolean")({ name: "evening", subDoc: "lifeSuggestions" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "lifeSuggestions" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "lifeSuggestions" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "lifeSuggestions" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "lifeSuggestions" })
  }];

  return _object;

}
