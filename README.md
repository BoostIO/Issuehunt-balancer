# Balancer

## Development

### Requirements

- Postgresql
- Node.js

### Prepare env vars

Create `.env` file.

Example:

```
NODE_ENV=development
PORT=3002
BASE_URL=http://localhost:3002

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=balancer
```

### Migrate

```
npm run migration:run
```

### Run server

```
npm run dev
```

## Test

### Prepare env vars

Create `test.env` file just like `.env`.

### Migrate

```
NODE_ENV=test npm run migration:run
```

### Run test

```
npm test
```

## Deployment

### Prepare env vars

Create `production.env` just like `.env`.

> You should exclude `PORT`. It will be provided by now.sh

### Migrate

```
NODE_ENV=production npm run migration:run
```

### Prepare now.json

Example:

```
{
  "engines": {
    "node": "8.11.1"
  },
  "dotenv": "production.env",
  "alias": "DOMAIN_SHOULD_BE_HERE"
}
```

### Deploy

```
now && now alias
```
