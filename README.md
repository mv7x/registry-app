# Registry App

A modern Angular registry management application for creating, editing, searching, filtering, and organizing bilingual registry records through a simple and responsive interface.

The project is built as a practical frontend task-based application, with a local `json-server` mock API used for development and testing.

## What is this for?

Registry App is designed for managing structured records such as internal forms, requests, documents, or administrative entries.

Users can:

- Create new registry records
- Edit existing records
- Delete records with a custom confirmation dialog
- Validate record data before saving
- Search records by code, name, deadline, or across all fields
- Filter records by department
- Navigate records with client-side pagination
- Jump directly to a page
- Switch between light and dark themes
- Switch between English and Arabic
- Use right-to-left layout when Arabic is selected
- Keep theme and language preferences after reloading the page

## Tech Stack

- Angular 22
- TypeScript
- Reactive Forms
- Angular Signals
- RxJS
- JSON Server
- npm
- CSS

## How it works

The Angular application runs as the frontend and communicates with a local JSON Server API during development.

```text
Angular App
    │
    │ HTTP
    ▼
JSON Server
    │
    ▼
db.json
```

The frontend is available at:

```text
http://localhost:4200
```

The mock API is available at:

```text
http://localhost:3000/forms
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mv7x/registry-app.git
cd registry-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the mock API

Open a terminal and run:

```bash
npm run api
```

The API will run on:

```text
http://localhost:3000
```

### 4. Start Angular

Open another terminal in the project directory and run:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run api` | Start the JSON Server mock API |
| `npm run build` | Create a production build |
| `npm test` | Run unit tests |

## Main Features

### Record Management

The application provides a complete registry workflow for adding, editing, and deleting records. Forms use validation rules for required values, name character sets, valid codes, deadlines, unique codes, and duplicate records.

### Search and Filtering

Records can be narrowed using a department filter and a field-based search. Search can target:

- Code
- Name
- Deadline
- All fields

Search and department filtering work together and automatically return pagination to the first page.

### Pagination

The table uses client-side pagination with a fixed page size. Users can move between the first, previous, numbered, next, and last pages or enter a page number directly.

The pagination also protects against empty pages after records are added or removed.

### Theme Support

The interface supports light and dark themes across the entire application, including forms, tables, filters, pagination, alerts, and dialogs.

The selected theme is stored locally so it remains active after a page reload.

### Language Support

The interface supports English and Arabic. Switching to Arabic changes the user interface text and the page direction to right-to-left.

The selected language is stored locally and restored after reload.

## Project Structure

```text
src/
└── app/
    ├── models/
    │   └── form-record.ts
    ├── services/
    │   └── records.ts
    ├── validators/
    │   └── form-record.validators.ts
    ├── app.ts
    ├── app.html
    └── app.css

db.json
```

## Data Model

Each registry record contains:

```text
id
code
arabicName
englishName
department
submissionDeadline
createdAt
```

Departments currently supported:

```text
HR
Finance
IT
Legal
```

## Development Notes

This project uses `json-server` as a lightweight local backend for frontend development. Data is stored in `db.json`, making it easy to run the application without setting up a separate database server.

The project is intended for development, learning, task implementation, and frontend/API integration practice rather than production data storage.

## License

This project is currently intended for personal development and learning purposes.
