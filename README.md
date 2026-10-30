# Equipment Inventory API

CST-391 Milestone 3 — Eric Tudor

REST API for the Equipment Inventory Manager, built with Node.js,
Express, TypeScript, and MySQL.

## Setup

1. Install Node.js and MySQL.
2. Clone this repository and open its folder.
3. Run `npm install`.
4. Execute `sql/schema.sql` in MySQL Workbench.
5. Copy `.env.example` to `.env` and enter your MySQL credentials.
6. Run `npm run build`.
7. Run `npm start`.

Base URL: http://localhost:5000

After changing TypeScript files, stop the server, rebuild, and restart.

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | /api/equipment-items | List equipment |
| GET | /api/equipment-items/:id | Retrieve one record |
| POST | /api/equipment-items | Create a record |
| PUT | /api/equipment-items/:id | Update a record |
| DELETE | /api/equipment-items/:id | Delete a record |

Authentication is not required.

POST and PUT require `Content-Type: application/json` and all four
editable fields:

```json
{
  "name": "Cordless Drill",
  "description": "18-volt cordless drill with battery and charger.",
  "quantity": 5,
  "isAvailable": true
}
```

MySQL generates `equipmentId`. Do not include it in request bodies.

## Validation

- Name: trimmed, 1–100 characters.
- Description: string up to 2000 characters or null; blank becomes null.
- Quantity: integer from 0 to 2147483647.
- Availability: Boolean indicating usability independently of quantity.
- IDs: integers from 1 to 2147483647.
- Unknown request fields are rejected.

Successful responses use 200 for reads and updates, 201 for creates,
and 204 for deletes. Errors use 400, 404, 415, or 500 as appropriate.

## Postman

Import `postman/EquipmentInventoryAPI.postman_collection.json`.
The collection includes endpoint descriptions and saved requests.
Use an existing record ID for individual read, update, and delete requests.

## Implementation Notes

The API separates routes, controllers, services, and database access.
Database queries use parameters. Credentials are stored in `.env`,
which is excluded from Git.

The development database is MySQL 5.7.24. Validation rules are enforced
by the API; this schema does not provide database CHECK enforcement.
Direct database writes can bypass API validation.

Angular and React interfaces are planned for later milestones.
Concurrent edits use last-write-wins behavior.