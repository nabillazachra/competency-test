const http = require("http");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const exphbs = require("express-handlebars");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//connection
const dbConn = require("./connection/db");
//upload
const uploadFile = require("./middlewares/uploadFiles");
const { throws } = require("assert");

//membuat parsial file
hbs.registerPartials(__dirname + "/views/partials");

//menyimpan folder file
var pathFile = "http://localhost:3000/uploads/";

hbs.registerHelper("select", function (selected, options) {
  return options
    .fn(this)
    .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"');
});

//index list
app.get("/", (request, response) => {
  const title = "Heroes App";
  const query =
    "SELECT t1.*, t2.name as type FROM heroes_tb t1 join type_tb t2 on t1.type_id=t2.id";

  dbConn.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let heroes = [];

      for (const res of results) {
        heroes.push({
          id: res.id,
          name: res.name,
          photo: pathFile + res.photo,
          type: res.type,
        });
      }

      if (heroes.length == 0) {
        heroes = false;
      }

      response.render("index", {
        title,
        heroes,
      });
    });
  });
});

//CRUD HERO TYPE
app.get("/type", function (request, response) {
  const title = "Hero App";
  const link = "active";

  const query = "SELECT * FROM type_tb";

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, results) {
      if (err) throw err;

      let types = [];
      for (var result of results) {
        types.push({
          id: result.id,
          name: result.name,
        });
      }

      if (types.length == 0) {
        types = false;
      }

      response.render("type", {
        title,
        link,
        types,
      });
      conn.release();
    });
  });
});

app.get("/add-type", function (request, response) {
  const title = "Add type";
  response.render("addType", {
    title,
  });
});

app.post("/add-type", function (request, response) {
  const { name } = request.body;

  if (name == "") {
    request.message = {
      type: "danger",
      message: "Please input all the field!",
    };
    return response.redirect("/add-type");
  }

  const query = `INSERT INTO type_tb (name) VALUES ("${name}");`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, result) {
      if (err) throw err;

      request.message = {
        type: "success",
        message: "Input data success!",
      };
      response.redirect("/type");
    });
    conn.release();
  });
});

app.get("/edit-type/:id", function (request, response) {
  const title = "Edit type";
  const { id } = request.params;

  const query = `SELECT * FROM type_tb WHERE id = ${id}`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, results) {
      if (err) throw err;

      const type = {
        ...results[0],
      };

      response.render("editType", {
        title,
        type,
      });
    });
    conn.release();
  });
});

app.post("/edit-type", function (request, response) {
  var { id, name } = request.body;

  const query = `UPDATE type_tb SET name = "${name}" WHERE id = ${id}`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, result) {
      if (err) throw err;
      response.redirect("/type");
    });
    conn.release();
  });
});

app.get("/delete-type/:id", function (request, response) {
  const { id } = request.params;
  const query = `DELETE FROM type_tb WHERE id = ${id}`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, result) {
      if (err) throw err;
      response.redirect("/type");
    });
    conn.release();
  });
});

//CRUD HEROES
app.get("/add-heroes", function (request, response) {
  const title = "Add Hero";

  const queryType = `SELECT id as typeId, name as type from type_tb`;
  dbConn.getConnection((err, connType) => {
    if (err) throw err;
    connType.query(queryType, (err, resultsT) => {
      if (err) throw err;

      let type = [];

      for (const result of resultsT) {
        type.push({
          typeId: result.typeId,
          type: result.type,
        });
      }

      if (type.length == 0) {
        type = false;
      }

      response.render("addHeroes", {
        title,
        type,
      });
    });
  });
});

app.post("/add-heroes", uploadFile("photo"), function (request, response) {
  const { name, type_id } = request.body;
  var photo = "";

  if (request.file) {
    photo = request.file.filename;
  }

  if (name == "" || type_id == "") {
    request.message = {
      type: "danger",
      message: "Please input all the field!",
    };
    return response.redirect("/add-heroes");
  }

  const query = `INSERT INTO heroes_tb (name, photo, type_id) VALUES ("${name}", "${photo}", "${type_id}");`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, result) {
      if (err) throw err;

      request.message = {
        type: "success",
        message: "Add data success!",
      };
      response.redirect("/heroes");
    });
    conn.release();
  });
});

app.get("/heroes", function (request, response) {
  const title = "Heroes App";
  const link = "active";

  const query =
    "SELECT t1.*, t2.name as type FROM heroes_tb t1 join type_tb t2 on t1.type_id=t2.id";

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, results) {
      if (err) throw err;

      let heroes = [];
      for (var result of results) {
        heroes.push({
          id: result.id,
          name: result.name,
          photo: result.photo,
          type: result.type,
        });
      }

      if (heroes.length == 0) {
        heroes = false;
      }

      response.render("heroes", {
        title,
        link,
        heroes,
      });
    });
    conn.release();
  });
});

app.get("/edit-heroes/:id", function (request, response) {
  const title = "Edit Hero";
  const { id } = request.params;

  const query = `SELECT * FROM heroes_tb WHERE id = ${id}`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, results) {
      if (err) throw err;

      const heroes = {
        ...results[0],
        photo: pathFile + results[0].photo,
      };
      const queryType = `SELECT name as type, id as typeId from type_tb`;
      dbConn.getConnection((err, connType) => {
        if (err) throw err;

        connType.query(queryType, (err, resultsT) => {
          if (err) throw err;

          let type = [];

          for (const result of resultsT) {
            type.push({
              typeId: result.typeId,
              type: result.type,
            });
          }

          if (type.length == 0) {
            type = false;
          }

          response.render("editHeroes", {
            title,
            heroes,
            type,
          });
        });
      });
    });
    conn.release();
  });
});

app.post("/edit-heroes", uploadFile("photo"), function (request, response) {
  var { id, name, oldPhoto, type_id } = request.body;

  var photo = oldPhoto.replace(pathFile, "");

  if (request.file) {
    photo = request.file.filename;
  }

  const query = `UPDATE heroes_tb SET name = "${name}", photo = "${photo}", type_id = "${type_id}" WHERE id = ${id}`;
  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, results) {
      if (err) throw err;

      response.redirect(`/heroes`);
    });
    conn.release();
  });
});

app.get("/delete-heroes/:id", function (request, response) {
  const { id } = request.params;
  const query = `DELETE FROM heroes_tb WHERE id = ${id}`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, result) {
      if (err) throw err;
      response.redirect("/");
    });
    conn.release();
  });
});

app.get("/detail-heroes/:id", function (request, response) {
  const title = "Detail Hero";
  const { id } = request.params;

  const query = `SELECT t1.*, t2.name as type FROM heroes_tb t1 join type_tb t2 on t1.type_id=t2.id WHERE t1.id = ${id}`;

  dbConn.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query, function (err, results) {
      if (err) throw err;

      const heroes = {
        ...results[0],
        photo: pathFile + results[0].photo,
      };

      response.render("detailHeroes", {
        title,
        heroes,
      });
    });
    conn.release();
  });
});

const port = 3000;
const server = http.createServer(app);
server.listen(port);
console.debug(`Server listening on port ${port}`);
