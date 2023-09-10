const { Router } = require("express");
const ProjectController = require("./app/controllers/ProjectController");
const ProgrammerController = require("./app/controllers/ProgrammerController");

const routes = Router();

// Project Endpoints
routes.get("/projects", ProjectController.index);
routes.get("/projects-sorted", ProjectController.indexSorted);
routes.get("/projects/:id", ProjectController.show);
routes.post("/projects", ProjectController.store);
routes.put("/projects/:id", ProjectController.update);
routes.delete("/projects/:id", ProjectController.destroy);

// Programmer Endpoints
routes.get("/programmers", ProgrammerController.index);
routes.get("/programmers/:id", ProgrammerController.show);
routes.post("/programmers", ProgrammerController.store);
routes.put("/programmers/:id", ProgrammerController.update);
routes.delete("/programmers/:id", ProgrammerController.destroy);


module.exports = routes;
