"use strict";

// Script de inicializações dos resources das restful apis do Docmob.

// Modelador e validador de objetos para o banco de dados mongodb
const mongoose = require("mongoose");

// Instancia e executa um servidor express
const app = require("./config/listener");

// Importa o módulo e define uma interface completa para manutenção da
// colletion users. Observe que é informado um parâmetro no require, que define
// qual collection será adotada na interface.
const userInterface = require("./controller/interface")("User");

// Módulo que trata rotas informadas, mas não existentes (404) ou ainda
// rotinas com erro no servidor (500)
const exceptions = require("./controller/exceptions");

// Métodos HTTP para tratativas das requisições feitas na API.
// Método LIST: Lista todos os documentos, limitado ao
// parâmetro "pagination_limit" do módulo "config", quando não forem
// informados os parâmetros de paginação, mais especificamente o parâmetro
// _limit na query na string da rota
app.get("/users", userInterface.list);

// Método GET: Retorna o documento referente ao "_id" informado, caso o mesmo
// existe na collection em questão. Caso seja, informado um código de
// indentificação num padrão inválido, a API retornará um erro com
// HTTP code 400 (bad request).
app.get("/users/:_id", userInterface.get);

// Método POST: Cria um novo documento conforme parâmetros informados através
// do corpo da requisição. Caso não ocorra inconsistência na requisição,
// o documento é criado, com a API retornando o objeto criado com código
// HTTP 201 (created). Em caso de erro, a API retorna
// HTTP code 400 (bad request).
app.post("/users", userInterface.post);

// Método PUT: Atualiza um documento, conforme parâmetros informados no corpo
// da requisição. O parâmetro "_id" é obrigatório para identificar o documento
// a ser alterado. A API retornará um objeto JSON contendo apenas os campos
// alterados no documento.
app.put("/users", userInterface.put);

// Método DELETE: Remove o documento informado para parâmetro na query string.
// Caso a exclusão ocorra com sucesso, a API retorna o
// HTTP code 204 (no content), mas logicamente sem conteúdo.
app.delete("/users/:_id", userInterface.delete);


const workplaceInterface = require("./controller/interface")("Workplace");
app.get("/workplaces", workplaceInterface.list);
app.get("/workplaces/:_id", workplaceInterface.get);
app.post("/workplaces", workplaceInterface.post);
app.put("/workplaces", workplaceInterface.put);
app.delete("/workplaces/:_id", workplaceInterface.delete);


// Caso a rota informada não exista, apresenta uma mensagem de erro com
// HTTP code 404
app.use(exceptions.error404);

// Caso ocorra algum erro no servidor, retorna HTTP code 500.
app.use(exceptions.error500);
