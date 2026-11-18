const fs = require("fs");
const path = require("path");

function generateResource(name) {
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error("Resource name must start with a capital letter.");
  }

  const root = process.cwd();
  const lower = name[0].toLowerCase() + name.slice(1);

  const plural = lower.endsWith("y")
    ? lower.slice(0, -1) + "ies"
    : lower.endsWith("s")
      ? lower
      : lower + "s";

  const appPath = path.join(root, "app.js");

  for (const dir of ["models", "controllers", "routes"]) {
    if (!fs.existsSync(path.join(root, dir))) {
      throw new Error("Run this command inside an MVC project.");
    }
  }

  if (!fs.existsSync(appPath)) {
    throw new Error("app.js not found.");
  }

  const files = {
    [`models/${name}.js`]: `
class ${name} {
  static records = [];
  static nextId = 1;

  static findAll() {
    return this.records;
  }

  static findById(id) {
    return this.records.find(item => item.id === Number(id));
  }

  static create(data) {
    const record = { id: this.nextId++, ...data };
    this.records.push(record);
    return record;
  }

  static update(id, data) {
    const index = this.records.findIndex(item => item.id === Number(id));
    if (index === -1) return null;

    this.records[index] = {
      ...this.records[index],
      ...data,
      id: Number(id)
    };

    return this.records[index];
  }

  static delete(id) {
    const index = this.records.findIndex(item => item.id === Number(id));
    if (index === -1) return false;

    this.records.splice(index, 1);
    return true;
  }
}

module.exports = ${name};
`,

    [`controllers/${lower}Controller.js`]: `
const ${name} = require("../models/${name}");

exports.getAll = (req, res) => {
  res.json(${name}.findAll());
};

exports.getOne = (req, res) => {
  const item = ${name}.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

exports.create = (req, res) => {
  const item = ${name}.create(req.body);
  res.status(201).json(item);
};

exports.update = (req, res) => {
  const item = ${name}.update(req.params.id, req.body);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

exports.remove = (req, res) => {
  const deleted = ${name}.delete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
`,

    [`routes/${lower}Routes.js`]: `
const express = require("express");
const router = express.Router();
const controller = require("../controllers/${lower}Controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
`
  };

  const appContent = fs.readFileSync(appPath, "utf8");
  const exportPattern = /module\.exports\s*=\s*app\s*;?/;

  if (!exportPattern.test(appContent)) {
    throw new Error("Could not find module.exports = app in app.js.");
  }

  const mount = `app.use("/api/${plural}", require("./routes/${lower}Routes"));`;

  if (appContent.includes(mount)) {
    throw new Error("Resource is already registered.");
  }

  for (const file of Object.keys(files)) {
    if (fs.existsSync(path.join(root, file))) {
      throw new Error(file + " already exists. No files overwritten.");
    }
  }

  for (const [file, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, file), content.trimStart());
    console.log("Created " + file);
  }

  const updatedApp = appContent.replace(
    exportPattern,
    `${mount}\n\nmodule.exports = app;`
  );

  fs.writeFileSync(appPath, updatedApp);

  console.log(`\n${name} CRUD resource generated successfully!`);
  console.log(`API endpoint: /api/${plural}`);
}

module.exports = { generateResource };
