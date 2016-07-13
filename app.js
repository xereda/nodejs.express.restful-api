"use strict";

const mongoose = require("mongoose");
const config = require("./config/config");
const messages = require("./controller/messages");
const app = require("./config/listener")(messages, config);
const userController = require("./controller/user")(messages);
const validator = require("validator");
const schemaDefUsers = require("./database/user-schema-definition");

const _validate = function(parameter) {
  return validator.trim(validator.escape(parameter));
}

const _getUserObject = function(req, schema) {
  const _userObject = {};

  console.log(req.body.updatedById + " - " + req.body.createdById);

  if (req.method == "POST") {
    if (req.body.createdById) {
      console.log("o parametro createdById foi informado: " + req.body.updatedById + " - " + req.body.createdById);
      req.body.updatedById = req.body.createdById;
    } else {
      req.body.updatedById = config.defaultCreatedById;
      console.log(req.body.updatedById + " - " + req.body.createdById);
    }
  }

  Object.keys(schema).forEach(function (key) {
    // exemplo apos parser do eval :
    // (req.body.name) ? _userObject.name = _validate(req.body.name) : null;
    eval("(req.body." + key + ") ? _userObject." + key + " = _validate(req.body." + key + ") : null;");
  });

  // (req.body.name) ? _userObject.name = _validate(req.body.name) : null;
  // (req.body.email) ? _userObject.email = _validate(req.body.email) : null;
  // (req.body.password) ? _userObject.password = _validate(req.body.password) : null;
  // (req.body.admin) ? _userObject.admin = _validate(req.body.admin) : null;
  // (req.body.active) ? _userObject.active = _validate(req.body.active) : null;
  // (req.body.createdById) ? _userObject.createdById = _validate(req.body.createdById) : null;
  // (req.body.updatedById) ? _userObject.updatedById = _validate(req.body.updatedById) : null;

  return _userObject;
}

const _toJSObject = function(type, param) {
  const _obj = {};
  if (param) {
    _validate(param.replace(/[^A-Za-z0-9,-_]/g, '')).split(",").forEach(function(v) {

      if (v) {

        if (v == "-_id") {
          (type == "fields") ? _obj["_id"] = 0 : null;
        } else if (v[0] == "-") {
          (type == "fields") ? _obj[v.substring(1)] = 1 : _obj[v.substring(1)] = -1;
        } else {
          _obj[v] = 1;
        }
      }

    });
  }
  return _obj;
}

const _toFiltersObject = function(req, schema) {

  let _obj = {};

  Object.keys(req.query).forEach(function(key,index) {

    const _cleanKey = key.replace("_start", "").replace("_end", "");

    // O parametro informado na url é um campo do schema?
    // Se sim, então determina-o como um filtro no find
    if (schema.hasOwnProperty(_cleanKey)) {

      switch (schema[_cleanKey].type) {
        case Number:

          _obj[key] = parseInt(req.query[key]);
          break;

        case Boolean:

          ((req.query[key].toLowerCase() == "true") || (req.query[key].toLowerCase() == "yes")) ? _obj[key] = true : _obj[key] = false;
          break;

        default:
          _obj[key] = req.query[key];
      }
    }

  });


  console.log("_obj", _obj);

  return _obj;

}


app.get("/users", function(req, res, next) {

  const _fields = _toJSObject("fields", req.query._fields);
  const _sort = _toJSObject("sort", req.query._sort);
  const _filters = _toFiltersObject(req, schemaDefUsers.schema);

  userController.readAll(_filters, _fields, _sort, function(userlist, status) {
    res.status(status).json(userlist);
  });

});

app.get("/users/:_id", function(req, res, next) {

  const _id = _validate(req.params._id);
  const _fields = _toJSObject("fields", req.query._fields);

  userController.read(_id, _fields, function(user, status) {
    res.status(status).json(user);
  });

});

app.post("/users", function(req, res, next) {

  userController.create(_getUserObject(req, schemaDefUsers.schema), function(createdUser, status) {
    res.status(status).json(createdUser);
  });

});

app.put("/users", function(req, res, next) {

  if (!req.body._id) {
    res.status(400).json({ error: messages.getMessage("error", 6) });
    next(new Error(messages.getMessage("error", 6)));
  }
  const _id = _validate(req.body._id);

  userController.update(_id, _getUserObject(req, schemaDefUsers.schema), function(updatedUser, status) {
    res.status(status).json(updatedUser);
  });

});

app.delete("/users/:_id", function(req, res, next) {

  const _id = _validate(req.params._id);

  userController.delete(_id, function(deletedUser, status) {
    res.status(status).json(deletedUser);
  });

});

app.use(function(req, res, next) {
  res.status(404).json({
    error: messages.getMessage("error", 14).replace("%1", req.url),
    path: req.url,
    method: req.method
  });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({error: messages.getMessage("error", 15) });
});
