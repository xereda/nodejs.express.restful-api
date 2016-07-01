// Módulo de conexão ao banco de dados.

"use strict";

const config = require("./config");

// Importando o módulo mongoose
const mongoose = require("mongoose");
// Conectando ao banco de dados
mongoose.connect("mongodb://" + config.database_host + "/" + config.database_name);
// Instanciando uma conexão com o banco de dados.
const conn = mongoose.connection;
// Exportando a instância da conexão.
module.exports = conn;
