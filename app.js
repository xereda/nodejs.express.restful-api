"use strict";

// Script inicializações dos resources das restful apis do Docmob.

const mongoose = require("mongoose");
const app = require("./config/listener");
const userInterface = require("./controller/interface")("user");

app.get("/users", userInterface.list);
app.get("/users/:_id", userInterface.get);
app.post("/users", userInterface.post);
app.put("/users", userInterface.put);
app.delete("/users/:_id", userInterface.delete);

app.use(userInterface.error404);

app.use(userInterface.error500);
