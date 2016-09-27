"use strict";

const cluster = require('cluster');
if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
}


if (cluster.isWorker) {

  // Script de inicializações dos resources das restful apis do Docmob.

  // Configuração geral da API
  const config = require("./config/config");

  // Modelador e validador de objetos para o banco de dados mongodb
  const mongoose = require("mongoose");

  // Instancia e executa um servidor express
  const app = require("./config/listener");

  // Importa o módulo e define uma interface completa para manutenção da
  // colletion users. Observe que é informado um parâmetro no require, que define
  // qual collection será adotada na interface.
  let restInterface;

  // Módulo que trata rotas informadas, mas não existentes (404) ou ainda
  // rotinas com erro no servidor (500)

  const exceptions = require("./controller/exceptions");

  // Métodos HTTP para tratativas das requisições feitas na API.
  // Método LIST: Lista todos os documentos, limitado ao
  // parâmetro "pagination_limit" do módulo "config", quando não forem
  // informados os parâmetros de paginação, mais especificamente o parâmetro
  // _limit na query na string da rota
  //app.get("/users", restInterface.list);

  // Método GET: Retorna o documento referente ao "_id" informado, caso o mesmo
  // existe na collection em questão. Caso seja, informado um código de
  // indentificação num padrão inválido, a API retornará um erro com
  // HTTP code 400 (bad request).
  //app.get("/users/:_id", restInterface.get);

  // Método POST: Cria um novo documento conforme parâmetros informados através
  // do corpo da requisição. Caso não ocorra inconsistência na requisição,
  // o documento é criado, com a API retornando o objeto criado com código
  // HTTP 201 (created). Em caso de erro, a API retorna
  // HTTP code 400 (bad request).
  // app.post("/users", restInterface.post);

  // Método PUT: Atualiza um documento, conforme parâmetros informados no corpo
  // da requisição. O parâmetro "_id" é obrigatório para identificar o documento
  // a ser alterado. A API retornará um objeto JSON contendo apenas os campos
  // alterados no documento.
  // app.put("/users", restInterface.put);

  // Método DELETE: Remove o documento informado para parâmetro na query string.
  // Caso a exclusão ocorra com sucesso, a API retorna o
  // HTTP code 204 (no content), mas logicamente sem conteúdo.
  // app.delete("/users/:_id", restInterface.delete);

  // o subDocGet não será implementado para subdocumentos, pois não há a
  // necessidade para tal. Um subdocumento pode ser acessado integralmente
  // através de seu próprio resource na API, como por exemplo:
  // http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers -> lista todos os providers de um workplace
  // http://localhost:5000/providers/579a6404308a23780dcfdaad -> para pegar apenas um provider, basta acessar diretamente o provider em seu resource na api.


  console.log("---------------------------------------------------------------------------");
  console.log("                 DOCMOB - Saúde na Ponta dos Dedos");
  console.log("              RESTFUL API - Istância de recursos para HTTP");
  console.log("---------------------------------------------------------------------------");
  Object.keys(config.resources).forEach(function(key) {
    console.log("Recurso: ", config.resources[key].name, config.resources[key].detail);
    restInterface = require("./controller/interface")(config.resources[key].collection);
    app.get("/" + config.resources[key].name, restInterface.list);
    app.get("/" + config.resources[key].name + "/:_id", restInterface.get);
    app.post("/" + config.resources[key].name, restInterface.post);
    //app.put("/" + config.resources[key].name, cors(config.corsOptions), restInterface.put);
    app.put("/" + config.resources[key].name, restInterface.put);
    app.delete("/" + config.resources[key].name + "/:_id", restInterface.delete);
    app.get("/" + config.resources[key].name + "/:_id/:_field", restInterface.subDocList);
    app.post("/" + config.resources[key].name + "/:_id/:_field", restInterface.subDocPost);
    app.put("/" + config.resources[key].name + "/:_id/:_field/:_subDoc_id", restInterface.subDocPut);
    app.delete("/" + config.resources[key].name + "/:_id/:_field/:_subDoc_id", restInterface.subDocDelete);
  });



  // Caso a rota informada não exista, apresenta uma mensagem de erro com
  // HTTP code 404
  app.use(exceptions.error404);

  // Caso ocorra algum erro no servidor, retorna HTTP code 500.
  app.use(exceptions.error500);

}
