# mvc-scaffold-js

A simple command-line tool to generate Express.js MVC projects and CRUD resources.

## Features

- Generate a basic Express MVC project.
- Create Model, View, Controller, Route, Middleware and Config folders.
- Generate CRUD operations for resources.
- Automatically register generated resource routes.
- Simple command-line interface.

## Installation

```bash
npm install -g mvc-scaffold-js
\`\`\`

You can also use it without global installation:

\`\`\`bash
npx mvc-scaffold-js create my-app
\`\`\`

## Create a Project

\`\`\`bash
mvc-scaffold-js create my-app
cd my-app
npm install
npm start
\`\`\`

Open http://localhost:3000 to check your application.

## Generate a CRUD Resource

Run inside your generated project:

\`\`\`bash
mvc-scaffold-js generate resource Product
\`\`\`

This generates:
- models/Product.js
- controllers/productController.js
- routes/productRoutes.js

The resource is automatically registered in app.js.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get one product |
| POST | /api/products | Create a product |
| PUT | /api/products/:id | Update a product |
| DELETE | /api/products/:id | Delete a product |

## Important Note

Generated resources currently use in-memory storage. Data resets when the server restarts.

## Requirements

- Node.js 18 or later
- npm

## License

MIT
