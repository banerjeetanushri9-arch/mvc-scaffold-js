const fs = require("fs");
const path = require("path");

async function createProject(projectName) {
  if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
    throw new Error("Invalid project name. Use letters, numbers, hyphens or underscores.");
  }

  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    throw new Error("A folder with this name already exists.");
  }

  const folders = [
    "models",
    "views",
    "controllers",
    "routes",
    "middleware",
    "config"
  ];

  fs.mkdirSync(projectPath);

  for (const folder of folders) {
    fs.mkdirSync(path.join(projectPath, folder));
  }

  const files = {
    "package.json": JSON.stringify({
      name: projectName,
      version: "1.0.0",
      main: "server.js",
      scripts: {
        start: "node server.js",
        dev: "node --watch server.js"
      },
      dependencies: {
        express: "^5.1.0"
      }
    }, null, 2),

    "app.js": `
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MVC application is running"
  });
});

module.exports = app;
`,

    "server.js": `
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
`,

    "README.md": `
# ${projectName}

Express MVC application generated using mvc-scaffold-js.

## Getting Started

1. Install dependencies:

   npm install

2. Start the server:

   npm start

3. Open http://localhost:3000
`
  };

  for (const [file, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(projectPath, file), content.trimStart());
  }

  console.log("\\nMVC project created successfully!");
  console.log("\\nNext steps:");
  console.log("cd " + projectName);
  console.log("npm install");
  console.log("npm start");
}

module.exports = { createProject };
