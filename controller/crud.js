module.exports = function(collection) {

// Faz o controle das funções de CRUD da restapi

// Módulo que define o esquema da collection informada como parâmetro
const schemaDef  = require("../database/schema-definition/" + collection);

// Importa o módulo de definação da collection de usuários do docmob
const model = require("../database/schema-model")(collection);
const messages = require("./messages");

// ** READ ALL - GET **
// Funcão que retorna a lista de todos os documentos da collection
// Recebe como parâmetro um callback contendo o response para
// o device chamador (navegador, aplicativo, etc...)
const _readAll = function(_populate, _lean, _pagination, _filters, _fields, _sort, callback) {

  // Parâmetros recebidos na função anônima:
  // * _lean: determina se a consulta irá retornar um objeto mongoose ou apenas
  // objeto javascript simples. O uso do lean() melhora e muito a performance
  // das querys.
  // * _pagination: objeto contendo as duas propriedades de paginação.
  // Propriedaedes do objeto _pagination: .limit e _pagination.sort
  // * _filters: objeto contendo os filtros informados na query string da
  // requisição (/users/?active=[boolean]&createdAt_start=[isodate]&name=/[parte do nome]/i)
  // * _fields: objeto contendo os campos da collection que serão retornados
  // pela API.
  // * _sort: objeto contendo os campos e orientação para ordenação.
  // (/users/?_sort=-name) -> ordenará de forma descrescente pelo campo nome
  // * callback: função de retorno para o express.

  // cria uma instância do model para realizar a query no banco.
  const modelDoc = model.find({}, _fields);

  // Percorre todos os filtros informados na query string.
  Object.keys(_filters).forEach(function(key,index) {

    // Caso o campo seja do tipo string
    if ((typeof _filters[key]) === "string") {

      // Caso o parâmetro de filtro termina com _start é porque ele deverá ser
      // a data inicial para um filtro de data, com isso aplicamos .where(campo)
      // e .gte(data) para o model do find(). Lembrando que gte significa
      // "igual ou maior que".
      if (key.indexOf("_start") > 0) {

        modelDoc.where(key.replace("_start", "")).gte(_filters[key]);

      } else if (key.indexOf("_end") > 0) {

        // O mesmo controle mencionado acima ("_start"), mas agora determina
        // que a data informado deve ser "igual ou menor que".
        modelDoc.where(key.replace("_end", "")).lte(_filters[key]);

      } else if ((_filters[key].indexOf("/i") > 0) || (_filters[key][0] == "/")) {

        // Caso o filtro seja string e tenha sido informado uma regex simples,
        // usamos o where com função regex() para filtrar pela expressão regular.
        modelDoc.where(key).regex(eval(_filters[key]));

      } else {

        // Caso seja um parâmetro simples (não é data ou expressão regular),
        // verifica apenas se existem documentos com o campo com valor igual ao
        // informado.
        modelDoc.where(key).equals(_filters[key]);
      }
    } else {
      // Caso seja um parâmetro simples (não é data ou expressão regular),
      // verifica apenas se existem documentos com o campo com valor igual ao
      // informado.
        modelDoc.where(key).equals(_filters[key]);
    }

  });

  // Determina o limite e paginação. A função skip() determina quantos
  // documentos devem ser pulados. Como o valor informado como filtro na API é
  // referente ao número da página, para que consigamos chegar no valor exato de
  // documentos a serem "pulados", subtraímos 1 do valor informato e o
  // multiplacamos pela quantidade de documento que podem ser rornados por página.
  modelDoc.limit(_pagination.limit).skip(_pagination.limit * (_pagination.pag - 1));


  // Se (_lean = true) retorna um objeto javascript simples e não um
  // documento mongoose. A aplicação de lean() melhora e muito as querys e
  // retorno de listas.
  modelDoc.lean(_lean);

  _populate.forEach(function(v) {
    modelDoc.populate(v);
  });

  // Após todas as definçòes acima, executa a query.
  modelDoc.exec(function(err, docs) {

    if (err) {
      // Não foi possível retornar a lista de documentos
      callback({ error: messages.getMessage("error", 1), err }, 400);
    } else if ((docs) && (docs.length == 0)) {

      // Caso não encontre documentos com os critérios informados, retorna
      // para o requisitante um array de objetos vazio
      callback([{}], 200);

    } else if (!docs) {

      // Caso não encontre documentos com os critérios informados, retorna
      // para o requisitante um array de objetos vazio
      callback([{}], 404);

    } else {

      // Caso encontre documentos através dos critérios informados,
      // retorna o objeto JSON para o requisitante.
      callback(docs, 200);
    }
  });

}

const _subDocReadAll = function(_id, _field, _populate, _populatedFields, _lean, _pagination, _filters, _populatedFilters, _fields, _sort, callback) {

  console.log("dentro da subdocreadall");

  const _objSubDoc = schemaDef.subDocs.find(function(element) {
    return element.fieldName === _field;
  });


  let _objFields= {};
  _objFields["_id"] = 0;
  _objFields[_field] = _field;
  _objFields[_objSubDoc.fieldName] = 1;

  console.log("_objFields: ", _objFields);

  Object.assign(_objFields, _fields);

  // cria uma instância do model para realizar a query no banco.
  const modelDoc = model.findOne({ _id: _id }, _objFields);

  // // Percorre todos os filtros informados na query string.
  // Object.keys(_filters).forEach(function(key,index) {
  //
  //   console.log("_filters: ", _filters);
  //
  //   // Caso o campo seja do tipo string
  //   if ((typeof _filters[key]) === "string") {
  //
  //     // Caso o parâmetro de filtro termina com _start é porque ele deverá ser
  //     // a data inicial para um filtro de data, com isso aplicamos .where(campo)
  //     // e .gte(data) para o model do find(). Lembrando que gte significa
  //     // "igual ou maior que".
  //     if (key.indexOf("_start") > 0) {
  //
  //       modelDoc.where(key.replace("_start", "")).gte(_filters[key]);
  //
  //     } else if (key.indexOf("_end") > 0) {
  //
  //       // O mesmo controle mencionado acima ("_start"), mas agora determina
  //       // que a data informado deve ser "igual ou menor que".
  //       modelDoc.where(key.replace("_end", "")).lte(_filters[key]);
  //
  //     } else if ((_filters[key].indexOf("/i") > 0) || (_filters[key][0] == "/")) {
  //
  //       // Caso o filtro seja string e tenha sido informado uma regex simples,
  //       // usamos o where com função regex() para filtrar pela expressão regular.
  //       modelDoc.where("providers." + key).regex(eval(_filters[key]));
  //
  //     } else {
  //
  //       // Caso seja um parâmetro simples (não é data ou expressão regular),
  //       // verifica apenas se existem documentos com o campo com valor igual ao
  //       // informado.
  //       modelDoc.where(key).equals(_filters[key]);
  //     }
  //   } else {
  //     // Caso seja um parâmetro simples (não é data ou expressão regular),
  //     // verifica apenas se existem documentos com o campo com valor igual ao
  //     // informado.
  //       modelDoc.where(key).equals(_filters[key]);
  //   }
  //
  // });

  //modelDoc.where("providers.email").equals("zx@x.com.br");

  // Se (_lean = true) retorna um objeto javascript simples e não um
  // documento mongoose. A aplicação de lean() melhora e muito as querys e
  // retorno de listas.
  modelDoc.lean(_lean);


  if (!_objSubDoc) {

    _populate.forEach(function(v) {
      modelDoc.populate(v);
    });

  } else {


    let _objPopulate = {};
    let _objPopulateTemp = {};

    _objPopulate["path"] = _objSubDoc.fieldName + "." + _objSubDoc.indexField;
    _objPopulate["model"] = _objSubDoc.ref;
    _objPopulate["select"] = _populatedFields.replace(new RegExp(",", 'g'), " ");
    //_objPopulate["match"] = _objFilters;

    if (((Object.keys(_sort).length === 0) && (_sort.constructor === Object)) === false) {
      _objPopulate["options"] = { sort: _sort };
    }

    modelDoc.populate(_objPopulate);

    _populate.forEach(function(v) {

      let _slicePopulateParam = v.split(".");

      if ((_slicePopulateParam[0].toUpperCase() != _objSubDoc.ref.toUpperCase()) &&
          (_slicePopulateParam[1] != _objSubDoc.fieldName) &&
          (_slicePopulateParam[2] != _objSubDoc.indexField)) {

        switch (_slicePopulateParam.length) {
          case 1:
            _objPopulateTemp["path"] = v;
            break;
          case 2:
            _objPopulateTemp["path"] = _slicePopulateParam[1];
            _objPopulateTemp["model"] = _slicePopulateParam[0];
            break;
          case 3:
            _objPopulateTemp["path"] = _slicePopulateParam[1] + "." + _slicePopulateParam[2];
            _objPopulateTemp["model"] = _slicePopulateParam[0];
            break;
          default:

        }

        _objPopulate["populate"] = _objPopulateTemp;
        modelDoc.populate(_objPopulate);

      }

    });


  }

  //
  //
  // modelDoc.populate({
  //      path: 'providers.provider',
  //      model: 'Provider',
  //      populate: {
  //        path: 'workplaces.workplace',
  //        model: 'Workplace'
  //      }});


  // Após todas as definçòes acima, executa a query.
  modelDoc.exec(function(err, docs) {

    if (err) {
      // Não foi possível retornar a lista de documentos
      callback({ error: messages.getMessage("error", 1), err }, 400);
    } else if ((docs) && (docs.length == 0)) {

      // Caso não encontre documentos com os critérios informados, retorna
      // para o requisitante um array de objetos vazio
      callback([{}], 200);

    } else if (!docs) {

      // Caso não encontre documentos com os critérios informados, retorna
      // para o requisitante um array de objetos vazio
      callback([{}], 404);

    } else {

      const _filteredPopulate = docs[_objSubDoc.fieldName].filter(function(element, index, array) {

        let control = true;

        //console.log("_filters: ", _filters);

        // Percorre todos os filtros informados na query string.
        Object.keys(_populatedFilters).forEach(function(key,index) {

          const originalKey = key.substr(key.indexOf(".") + 1);
          //console.log("nome do campo: ", key, " - valor do campo: ", _filters[key]);

          // Caso o campo seja do tipo string
          if ((typeof _populatedFilters[key]) === "string") {

            // Caso o parâmetro de filtro termina com _start é porque ele deverá ser
            // a data inicial para um filtro de data, com isso aplicamos .where(campo)
            // e .gte(data) para o model do find(). Lembrando que gte significa
            // "igual ou maior que".
            if (key.indexOf("_start") > 0) {

              //console.log("vai aplicar filtro de data _start");

              //console.log("a data informado é menor que a data no banco? ", new Date(_filters[key]) < new Date(element.provider[key.replace("_start", "")]));

              if (new Date(_populatedFilters[key]) > new Date(element[_objSubDoc.indexField][originalKey.replace("_start", "")])) {
                //console.log("o valor informado em " + key + " e menor que " + element.provider[key.replace("_start", "")]);
                control = false;
              }

              //_objFilters[key.replace("_start", "")] = { $gte: _filters[key] };
              //modelDoc.where(_objSubDoc.fieldName + "." + key.replace("_start", "")).gte(_filters[key]);

            } else if (originalKey.indexOf("_end") > 0) {

              if (new Date(_populatedFilters[key]) < new Date(element[_objSubDoc.indexField][originalKey.replace("_end", "")])) {
                control = false;
              }

              // O mesmo controle mencionado acima ("_start"), mas agora determina
              // que a data informado deve ser "igual ou menor que".
              //_objFilters[key.replace("_end", "")] = { $lte: _filters[key] };
              //modelDoc.where(key.replace("_end", "")).lte(_filters[key]);

            } else if ((_populatedFilters[key].indexOf("/i") > 0) || (_populatedFilters[key][0] == "/")) {

              // Caso o filtro seja string e tenha sido informado uma regex simples,
              // usamos o where com função regex() para filtrar pela expressão regular.
              if (!((new RegExp(eval(_populatedFilters[key]))).test(element[_objSubDoc.indexField][originalKey]))) {
                  control = false;
              }

            } else {

              if (typeof element[_objSubDoc.indexField][originalKey]  !== "string") {

                if (element[_objSubDoc.indexField][originalKey].toISOString() !== _populatedFilters[key]) {
                  control = false;
                }

              } else {

                // Caso seja um parâmetro simples (não é data ou expressão regular),
                // verifica apenas se existem documentos com o campo com valor igual ao
                // informado.
                if (element[_objSubDoc.indexField][originalKey].toUpperCase() !== _populatedFilters[key].toUpperCase()) {
                  control = false;
                }
              }

            }
          } else if ((typeof _populatedFilters[key]) === "boolean") {

            // Caso seja um parâmetro simples (não é data ou expressão regular),
            // verifica apenas se existem documentos com o campo com valor igual ao
            // informado.
            if (element[_objSubDoc.indexField][originalKey] !== _populatedFilters[key]) {
              control = false;
            }
          } else {

            // Caso seja um parâmetro simples (não é data ou expressão regular),
            // verifica apenas se existem documentos com o campo com valor igual ao
            // informado.
            if (element[_objSubDoc.indexField][originalKey].toUpperCase() !== _populatedFilters[key].toUpperCase()) {
              control = false;
            }

          }

        });

        // Percorre todos os filtros informados na query string.
        Object.keys(_filters).forEach(function(key,index) {

          // Caso o campo seja do tipo string
          if ((typeof _filters[key]) === "string") {

            // Caso o parâmetro de filtro termina com _start é porque ele deverá ser
            // a data inicial para um filtro de data, com isso aplicamos .where(campo)
            // e .gte(data) para o model do find(). Lembrando que gte significa
            // "igual ou maior que".
            if (key.indexOf("_start") > 0) {

              //console.log("vai aplicar filtro de data _start");

              //console.log("a data informado é menor que a data no banco? ", new Date(_filters[key]) < new Date(element.provider[key.replace("_start", "")]));

              if (new Date(_filters[key]) > new Date(element[key.replace("_start", "")])) {
                //console.log("o valor informado em " + key + " e menor que " + element.provider[key.replace("_start", "")]);
                control = false;
              }

              //_objFilters[key.replace("_start", "")] = { $gte: _filters[key] };
              //modelDoc.where(_objSubDoc.fieldName + "." + key.replace("_start", "")).gte(_filters[key]);

            } else if (key.indexOf("_end") > 0) {

              if (new Date(_filters[key]) < new Date(element[key.replace("_end", "")])) {
                control = false;
              }

              // O mesmo controle mencionado acima ("_start"), mas agora determina
              // que a data informado deve ser "igual ou menor que".
              //_objFilters[key.replace("_end", "")] = { $lte: _filters[key] };
              //modelDoc.where(key.replace("_end", "")).lte(_filters[key]);

            } else if ((_filters[key].indexOf("/i") > 0) || (_filters[key][0] == "/")) {

              // Caso o filtro seja string e tenha sido informado uma regex simples,
              // usamos o where com função regex() para filtrar pela expressão regular.
              if (!((new RegExp(eval(_filters[key]))).test(element[key]))) {
                  control = false;
              }

            } else {

              if (typeof element[key]  !== "string") {

                if (element[key].toISOString() !== _filters[key]) {
                  control = false;
                }

              } else {

                // Caso seja um parâmetro simples (não é data ou expressão regular),
                // verifica apenas se existem documentos com o campo com valor igual ao
                // informado.
                if (element[key].toUpperCase() !== _filters[key].toUpperCase()) {
                  control = false;
                }
              }

            }

          } else if (((typeof _filters[key]) === "boolean") || ((typeof _filters[key]) === "number")) {

            // Caso seja um parâmetro simples (não é data ou expressão regular),
            // verifica apenas se existem documentos com o campo com valor igual ao
            // informado.
            if (element[key] !== _filters[key]) {
              control = false;
            }

          } else {

            // Caso seja um parâmetro simples (não é data ou expressão regular),
            // verifica apenas se existem documentos com o campo com valor igual ao
            // informado.
            if (element[key].toUpperCase() !== _filters[key].toUpperCase()) {
              control = false;
            }

          }

        });

        if (control) {
          return true;
        }
        return false;

      });

      // apresenta apenas os campos informados no parametro query string "_fields"
      if (Object.keys(_fields).length > 0) {
        _filteredPopulate.forEach(function(element, index) {
          console.log("element: ", element);
          for (var property in element) {
            console.log("é propriedade: ", property);
            if (!_fields.hasOwnProperty(property)) {
              console.log("nao foi informado na _fields");
              delete element[property];
            }
          }
        });
      }

      // paginacao dos subdocs
      const _sliceStartPag = (_pagination.pag - 1) * _pagination.limit;
      const _sliceEndPag = _sliceStartPag + _pagination.limit;

      // Caso encontre documentos através dos critérios informados,
      // retorna o objeto JSON para o requisitante.
      callback(_filteredPopulate.slice(_sliceStartPag, _sliceEndPag), 200);
    }
  });

}


// ** READ - GET **
// Função que retorna um determinado documento da collection.
// Além do callback recebe também o id do usuário
const _read = function(_populate, _id, _fields, callback) {

  // Função que pesquisa por um determinado documento.
  // Recebe um callback, onde err recebe o objeto de um eventual erro ou
  // doc, caso encontre o documento na collection

  const modelDoc = model.findOne({ _id: _id }, _fields);

  _populate.forEach(function(v) {
    modelDoc.populate(v);
  });

  // modelDoc.populate({
  //        path: "providers.provider",
  //        model: "Provider",
  //        populate: {
  //          path: "workplaces.workplace",
  //          model: "Workplace"
  //        }});

  modelDoc.exec(function(err, doc) {

    if (err) {
      // Nao foi possivel retornar o usuário
      callback({ error: messages.getMessage("error", 3), err }, 400);
    } else if (!doc) {
      // Usuário não localizado
      callback({ response: messages.getMessage("message", 3) }, 404);
    } else {
      // Encontrou o usuáio e retorna para o callback o objeto respectivo
      callback(doc, 200);
    }
  });

}

// ** CREATE POST **
// Função que cria novo docunento na collection especificada
const _create = function(docObject, callback) {

  // Cria um novo usuário com o objeto passado como parâmetro.
  new model(docObject).save(function(err, doc) {

    // Caso ocorra erro na criação do usuário
    if (err) {
      // Não foi possível criar o usuário
      callback({ error: messages.getMessage("error", 4), err }, 400);
    } else {
      // Cria o usuário e retorna um objecto com o documento recem criado
      callback(doc, 201);
    }
  });
}

// ** PUT UPDATE **
// Funcão que atualiza um usuário. Recebe como parâmetro o _id do usuário
// a ser alterado, o objeto aos campos a serem atualizados e por final,
// o callback de retorno para express.
const _update = function(_id, docObject, callback) {

  // Procura o usuário informado como parâmetro
  model.findOne({ _id: _id }, function(err, doc) {

    // Caso tenha algum problema na procura
    if (err) {

      // Erro - Não foi possível retornar o usuário
      callback({ error: messages.getMessage("error", 3), err }, 400);

    } else if (!doc) {

      // Não localizou o usuário informado como parâmetro
      callback({ response: messages.getMessage("message", 3) }, 404);

    } else {

      // Encontrou o usuário e vai atualizar os dados do documento
      // na collection do mongodb

      Object.keys(docObject).forEach(function (key) {

        // Tratativa para os campos de geoposicionamento
        if ((typeof docObject[key]) === "object") {

          if ((key == "geoLocation") && (typeof docObject[key].coordinates === "object")) {

            if ((docObject[key].coordinates[0] != doc[key].coordinates[0]) || (docObject[key].coordinates[1] != doc[key].coordinates[1])) {

              doc[key].coordinates = [];
              doc[key].coordinates[0] = parseFloat(docObject[key].coordinates[0]);
              doc[key].coordinates[1] = parseFloat(docObject[key].coordinates[1]);
            }
          } else {
            (docObject[key]) ? doc[key] = docObject[key] : null;
          }
        } else { // para todos os demais campos
          (docObject[key]) ? doc[key] = docObject[key] : null;
        }

      });

      if (!docObject.updatedById) {
        callback({ error: messages.getMessage("error", 13).replace("%1", "updatedById") }, 400);
      } else {

        doc.save(function(err, docUpdated) {

          // Erro - Não foi possível atualizar o usuário
          if (err) {
            callback({ error: messages.getMessage("error", 5), err }, 400);
          } else if (Object.keys(docUpdated.updatedFields).length === 0 && docUpdated.updatedFields.constructor === Object) {
            // nenhum campo da collection foi atualizado
            callback({}, 204);
          } else {
            // Campos foram atualizado
            // Retorna somente num objeto somente os campos alterados
            callback(docUpdated.updatedFields, 200);
          }
        });

      }
    }
  });
}

// ** DELETE **
// Tenta localizar um usuário passado como parâmetro e se encontrar
// remove seu documento da collection de usuários
const _delete = function(_id, callback) {

  // Pesquisa pelo usuário passado como parâmetro
  model.findById(_id, function(err, doc) {

    // Caso ocorra algum erro na pesquisa do usuário
    if (err) {
      // Não foi possível localizar o usuário
      callback({ error: messages.getMessage("error", 3), err}, 400);
    } else if (!doc) {
      // Usuário inexistente
      callback({ response: messages.getMessage("message", 3), err}, 404);
    } else {

      // Encontrou o usuário e irá remove-lo
      doc.remove(function(err) {

        // Documento na collection de usuários foi removido com sucesso
        if (!err) {
          // Usuário excluído com sucesso
          // Conforme material sobre boas práticas no desenvolvimento de
          // restful apis, adotamos o retorno 204, que determina um resultado
          // de sucesso, mas sem dados de retorno.
          // http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
          callback({ response: messages.getMessage("message", 4) }, 204);
        }

      });
    }
  });
}

// Define o objeto encapsulador das funções de CRUD da api
const docController = {
  readAll: _readAll, // get
  subDocReadAll: _subDocReadAll, // get para um subdocumento
  read: _read, // get
  create: _create, // post
  update: _update, // put
  delete: _delete // delete
};

return docController;

}
