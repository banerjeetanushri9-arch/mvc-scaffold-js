const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { createProject } = require("../src/createProject");
const { generateResource } = require("../src/generateResource");

test("createProject generates the MVC project structure", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mvc-test-"));
  const originalDir = process.cwd();

  try {
    process.chdir(tempDir);

    await createProject("test-app");

    const projectPath = path.join(tempDir, "test-app");

    for (const folder of [
      "models",
      "views",
      "controllers",
      "routes",
      "middleware",
      "config"
    ]) {
      assert.ok(fs.existsSync(path.join(projectPath, folder)));
    }

    assert.ok(fs.existsSync(path.join(projectPath, "app.js")));
    assert.ok(fs.existsSync(path.join(projectPath, "server.js")));
    assert.ok(fs.existsSync(path.join(projectPath, "package.json")));
  } finally {
    process.chdir(originalDir);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generateResource creates CRUD resource files and registers route", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mvc-resource-"));
  const originalDir = process.cwd();

  try {
    process.chdir(tempDir);

    await createProject("test-app");
    process.chdir(path.join(tempDir, "test-app"));

    generateResource("Product");

    assert.ok(fs.existsSync("models/Product.js"));
    assert.ok(fs.existsSync("controllers/productController.js"));
    assert.ok(fs.existsSync("routes/productRoutes.js"));

    const appContent = fs.readFileSync("app.js", "utf8");
    assert.ok(appContent.includes('/api/products'));
  } finally {
    process.chdir(originalDir);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
