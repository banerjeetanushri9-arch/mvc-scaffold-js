#!/usr/bin/env node

const { createProject } = require("../src/createProject");
const { generateResource } = require("../src/generateResource");

const args = process.argv.slice(2);

async function main() {
  const [command, name, resourceName] = args;

  try {
    if (command === "create") {
      if (!name) {
        throw new Error("Usage: mvc-scaffold-js create <project-name>");
      }

      await createProject(name);
      return;
    }

    if (command === "generate" && name === "resource") {
      if (!resourceName) {
        throw new Error("Usage: mvc-scaffold-js generate resource <name>");
      }

      generateResource(resourceName);
      return;
    }

    console.log(`
MVC Scaffold JS

Commands:
  create <name>              Create an Express MVC project
  generate resource <name>   Generate CRUD resource files
`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}

main();
