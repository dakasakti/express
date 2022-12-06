const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "Hello World by Dakasakti", "OK", res);
});

app.get("/students", (req, res) => {
  const qs = "SELECT * FROM students";
  db.query(qs, (error, result) => {
    if (error) throw response(500, null, "INTERNAL_SERVER_ERROR", res);
    result.length === 0
      ? response(404, null, "NOT_FOUND", res)
      : response(200, result, "OK", res);
  });
});

app.get("/students/:nim", (req, res) => {
  const nim = req.params.nim;
  const qs = `SELECT * FROM students WHERE nim = ${nim}`;
  db.query(qs, (error, result) => {
    if (error) throw response(500, null, "INTERNAL_SERVER_ERROR", res);
    result.length === 0
      ? response(404, null, "NOT_FOUND", res)
      : response(200, result, "OK", res);
  });
});

app.post("/students", (req, res) => {
  const { nim, name, major } = req.body;
  const qs = `INSERT INTO students (nim, name, major) VALUES (${nim}, '${name}', '${major}')`;
  db.query(qs, (error, result) => {
    if (error) throw response(400, "nim already exist", "BAD_REQUEST", res);
    if (result?.affectedRows) response(201, null, "OK", res);
  });
});

app.put("/students/:nim", (req, res) => {
  const nim = req.params.nim;
  let { name, major } = req.body;

  if (Object.keys(req.body).length === 0) {
    return response(400, "request body must be filled", "BAD_REQUEST", res);
  }

  const qs = `SELECT * FROM students WHERE nim = ${nim}`;
  db.query(qs, (error, result) => {
    if (error) throw response(500, null, "INTERNAL_SERVER_ERROR", res);
    if (result.length === 0) {
      return response(404, null, "NOT_FOUND", res);
    }

    // set
    setData((name ??= result[0].name), (major ??= result[0].major));
  });

  function setData(setName, setMajor) {
    const qs = `UPDATE students SET name= '${setName}', major= '${setMajor}' WHERE nim = ${nim}`;
    db.query(qs, (error, result) => {
      if (error) throw response(500, null, "INTERNAL_SERVER_ERROR", res);
      if (result?.affectedRows) {
        return response(200, null, "OK", res);
      }
    });
  }
});

app.delete("/students/:nim", (req, res) => {
  const nim = req.params.nim;

  const qs = `DELETE FROM students WHERE nim = ${nim}`;
  db.query(qs, (error, result) => {
    if (error) throw response(500, null, "INTERNAL_SERVER_ERROR", res);
    if (result?.affectedRows) {
      return response(200, null, "OK", res);
    }

    return response(404, null, "NOT_FOUND", res);
  });
});

app.listen(port, () => {
  console.log(`dakasakti listening on port ${port}`);
});
