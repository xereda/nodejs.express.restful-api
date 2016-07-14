module.exports = function(collection) {

  const utils           = require("../utils/utils");
  const schemaDefUsers  = require("../database/" + collection + "-schema-definition");
  const controllerCRUD  = require("../controller/crud")(collection);
  const messages        = require("../controller/messages");

  const _list = function(req, res, next) {

    const _fields = utils.toJSObject("fields", req.query._fields);
    const _sort = utils.toJSObject("sort", req.query._sort);
    const _filters = utils.toFiltersObject(req, schemaDefUsers.schema);
    const _pagination = utils.toPaginationObject(req);

    controllerCRUD.readAll(_pagination, _filters, _fields, _sort, function(userlist, status) {
      res.status(status).json(userlist);
    });

  }

  const _get = function(req, res, next) {

    const _id = utils.validate(req.params._id);
    const _fields = utils.toJSObject("fields", req.query._fields);

    controllerCRUD.read(_id, _fields, function(user, status) {
      res.status(status).json(user);
    });

  }

  const _post = function(req, res, next) {

    controllerCRUD.create(utils.getUserObject(req, schemaDefUsers.schema), function(createdUser, status) {
      res.status(status).json(createdUser);
    });

  }

  const _put = function(req, res, next) {

    if (!req.body._id) {
      res.status(400).json({ error: messages.getMessage("error", 6) });
      next(new Error(messages.getMessage("error", 6)));
    }
    const _id = utils.validate(req.body._id);

    controllerCRUD.update(_id, utils.getUserObject(req, schemaDefUsers.schema), function(updatedUser, status) {
      res.status(status).json(updatedUser);
    });

  }

  const _delete = function(req, res, next) {

    const _id = utils.validate(req.params._id);

    controllerCRUD.delete(_id, function(deletedUser, status) {
      res.status(status).json(deletedUser);
    });

  }

  const _error404 = function(req, res, next) {
    res.status(404).json({
      error: messages.getMessage("error", 14).replace("%1", req.url),
      path: req.url,
      method: req.method
    });
  }

  const _error500 = function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      error: messages.getMessage("error", 15),
      path: req.url,
      method: req.method
    });
  }

  const controller = {
    list:   _list,
    get:    _get,
    post:   _post,
    put:    _put,
    delete: _delete,
    error404: _error404,
    error500: _error500
  };

  return controller;

}
