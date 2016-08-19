module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  const _subDocReadAll = function(_id, _field, _populate, _populatedFields, _lean, _pagination, _filters, _populatedFilters, _fields, _sort, callback) {

    const _objSubDoc = schemaDef.subDocs.find(function(element) {
      return element.fieldName === _field;
    });

    console.log("dentro ");


    let _objFields = {};
    _objFields["_id"] = 0;
    _objFields[_field] = _field;
    if (_objSubDoc !== undefined) {
      _objFields[_objSubDoc.fieldName] = 1;
    }

    Object.assign(_objFields, _fields);

    console.log("_objFields: ", _objFields);

    // cria uma instância do model para realizar a query no banco.
    const modelDoc = model.findOne({ _id: _id }, _objFields);

    // Se (_lean = true) retorna um objeto javascript simples e não um
    // documento mongoose. A aplicação de lean() melhora e muito as querys e
    // retorno de listas.
    modelDoc.lean(_lean);

    console.log(1);


    if (_objSubDoc === undefined) {

      _populate.forEach(function(v) {
        modelDoc.populate(v);
      });

      console.log(2);

    } else {

      console.log(3);


      let _objPopulate = {};
      let _objPopulateTemp = {};

      _objPopulate["path"] = _objSubDoc.fieldName + "." + _objSubDoc.indexField;
      _objPopulate["model"] = _objSubDoc.ref;
      _objPopulate["select"] = _populatedFields.replace(new RegExp(",", 'g'), " ");
      //_objPopulate["match"] = _objFilters;

      if (((Object.keys(_sort).length === 0) && (_sort.constructor === Object)) === false) {
        _objPopulate["options"] = { sort: _sort };
      }

      console.log("_objPopulate: ", _objPopulate);

      (_objSubDoc.simple !== true) ? modelDoc.populate(_objPopulate) : null;

      // loop para todos os populates internos primeiramente para nao ocorrer erro
      _populate.forEach(function(v) {

        let _slicePopulateParam = v.split(".");

        if (_slicePopulateParam.length == 1) {
          _objPopulateTemp["path"] = v;
          _objPopulate["populate"] = _objPopulateTemp;
          modelDoc.populate(_objPopulate);
        }

      });

      _populate.forEach(function(v) {

        let _slicePopulateParam = v.split(".");
        if (_slicePopulateParam.length == 2) {
          _objPopulateTemp["path"] = _slicePopulateParam[1];
          _objPopulateTemp["model"] = _slicePopulateParam[0];
          modelDoc.populate(_objPopulateTemp["model"] + "." + _objPopulateTemp["path"]);
        }

      });

      _populate.forEach(function(v) {

        let _slicePopulateParam = v.split(".");
        if (_slicePopulateParam.length == 3) {
            _objPopulateTemp["path"] = _slicePopulateParam[1] + "." + _slicePopulateParam[2];
            _objPopulateTemp["model"] = _slicePopulateParam[0];
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

      console.log(4);


      if (err) {
        // Não foi possível retornar a lista de documentos

        callback({ error: messages.getMessage("error", 1), err }, 400);

      } else if ((docs) && (docs.length == 0)) {

        // Caso não encontre documentos com os critérios informados, retorna
        // para o requisitante um array de objetos vazio
        callback([{}], 200);

      } else if ((Object.keys(docs).length === 0 && docs.constructor === Object) || (!docs) || (docs === undefined) || (docs === null)) {

        // Caso não encontre documentos com os critérios informados, retorna
        // para o requisitante um array de objetos vazio
        callback([{}], 404);

      } else if (_objSubDoc === undefined) {

        callback(docs, 200);

      } else {

        console.log("docs: ", docs, typeof docs);

        const _filteredPopulate = docs[_objSubDoc.fieldName].filter(function(element, index, array) {

          let control = true;

          // Percorre todos os filtros informados na query string.
          Object.keys(_populatedFilters).forEach(function(key,index) {

            const originalKey = key.substr(key.indexOf(".") + 1);
            //console.log("nome do campo: ", key, " - valor do campo: ", _filters[key]);

            // Caso o campo seja do tipo string
            if ((typeof _populatedFilters[key]) === "string") {

              // Caso o parâmetro de filtro termina com _gte é porque ele deverá ser
              // a data inicial para um filtro de data, com isso aplicamos .where(campo)
              // e .gte(data) para o model do find(). Lembrando que gte significa
              // "igual ou maior que".
              if (key.indexOf("_gte") > 0) {

                if (new Date(_populatedFilters[key]) > new Date(element[_objSubDoc.indexField][originalKey.replace("_gte", "")])) {
                  control = false;
                }

              } else if (originalKey.indexOf("_lte") > 0) {

                if (new Date(_populatedFilters[key]) < new Date(element[_objSubDoc.indexField][originalKey.replace("_lte", "")])) {
                  control = false;
                }

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

              // Caso o parâmetro de filtro termina com _gte é porque ele deverá ser
              // a data inicial para um filtro de data, com isso aplicamos .where(campo)
              // e .gte(data) para o model do find(). Lembrando que gte significa
              // "igual ou maior que".
              if (key.indexOf("_gte") > 0) {


                if (new Date(_filters[key]) > new Date(element[key.replace("_gte", "")])) {
                  control = false;
                }

              } else if (key.indexOf("_lte") > 0) {

                if (new Date(_filters[key]) < new Date(element[key.replace("_lte", "")])) {
                  control = false;
                }

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
            for (var property in element) {
              if (!_fields.hasOwnProperty(property)) {
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

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    subDocReadAll: _subDocReadAll // get para um subdocumento
  };

  return docController;

}
