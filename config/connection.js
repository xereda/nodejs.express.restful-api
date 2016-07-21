// Módulo de conexão ao banco de dados.

"use strict";

const config = require("./config");

// Importando o módulo mongoose
const mongoose = require("mongoose");

// Definindo a string de conexão com o banco de dados
mongoose.connect("mongodb://" + config.database_host + "/" + config.database_name, { server: { reconnectTries: Number.MAX_VALUE } });

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


// Instanciando uma conexão com o banco de dados.
const conn = mongoose.connection;


conn.on('connecting', function() {
  console.log('connecting to MongoDB...');
});

conn.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
conn.on('connected', function() {
  console.log('MongoDB connected!');
});
conn.once('open', function() {
  console.log('MongoDB connection opened!');
});
conn.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});
conn.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  //mongoose.connect("mongodb://" + config.database_host + "/" + config.database_name, {server:{auto_reconnect:true}});
});


module.exports = conn;
