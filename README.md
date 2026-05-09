# School Management API

Node.js, Express.js, and MySQL APIs for adding schools and listing schools sorted by proximity to a user-provided location.

## Features

- `POST /addSchool` validates and stores a school.
- `GET /listSchools?latitude=<lat>&longitude=<lng>` returns all schools sorted by distance from the provided coordinates.
- MySQL connection pooling with `mysql2`.
- Input validation for required strings, numeric coordinates, and valid latitude/longitude ranges.
- Postman collection with sample success and validation-error responses.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the database and table:

   ```bash
   mysql -u root -p < schema.sql
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MySQL credentials.

5. Start the API:

   ```bash
   npm start
   ```

The API runs on `http://localhost:3000` by default.

## API Endpoints

### Add School

`POST /addSchool`

Request body:

```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi",
  "latitude": 28.594,
  "longitude": 77.25
}
```

Success response:

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi",
    "latitude": 28.594,
    "longitude": 77.25
  }
}
```

### List Schools

`GET /listSchools?latitude=28.6139&longitude=77.2090`

Success response:

```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi",
      "latitude": 28.594,
      "longitude": 77.25,
      "distanceKm": 4.553
    }
  ]
}
```

## Validation

- `name`: required non-empty string, max 255 characters.
- `address`: required non-empty string, max 500 characters.
- `latitude`: required number between -90 and 90.
- `longitude`: required number between -180 and 180.

## Testing

```bash
npm test
```

## Postman Collection

Import `postman/School Management API.postman_collection.json` into Postman. The collection includes:

- Health Check
- Add School
- List Schools
- Example success and validation-error responses

Set the `baseUrl` collection variable to either `http://localhost:3000` or your deployed API URL.

## Deployment

Any Node.js hosting provider that supports environment variables and outbound MySQL access will work, such as Render, Railway, AWS Elastic Beanstalk, or a VPS.

Set these environment variables in your hosting service:

```text
PORT=3000
DB_HOST=<mysql-host>
DB_PORT=3306
DB_USER=<mysql-user>
DB_PASSWORD=<mysql-password>
DB_NAME=school_management
DB_CONNECTION_LIMIT=10
```

Run `schema.sql` once against the production MySQL database before using the live endpoints.
