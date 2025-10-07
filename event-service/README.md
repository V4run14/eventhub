# Event Service

Spring Boot microservice that manages local and Ticketmaster-backed events with JWT-based authentication provided by the Auth Service.

## Running locally

```bash
mvn -pl event-service -am spring-boot:run
```

Or run the Docker stack:

```bash
docker compose up --build event-service
```

The service listens on port `8081` and expects PostgreSQL at `jdbc:postgresql://localhost:5432/eventdb`. Configure credentials via Spring `SPRING_DATASOURCE_*` environment variables as needed.

## JWT configuration

`security.jwt.secret` must match the secret used by `auth-service`. All requests require `Authorization: Bearer <token>` headers. Only tokens with role `ADMIN` may create, update, or delete events; `USER` tokens are limited to read-only operations.

## cURL examples

Replace `<TOKEN>` with a valid JWT and adjust payloads as needed.

Create event (ADMIN only):

```bash
curl -X POST http://localhost:8081/events \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Indie Fest",
    "category": "Music",
    "venue": "Red Hat Amphitheater",
    "city": "Raleigh",
    "dateTime": "2025-06-01T19:30:00",
    "source": "LOCAL",
    "status": "UPCOMING",
    "description": "Outdoor summer concert",
    "priceMin": 25.0,
    "priceMax": 75.0
  }'
```

List events (USER or ADMIN):

```bash
curl http://localhost:8081/events \
  -H "Authorization: Bearer <TOKEN>"
```

Get single event:

```bash
curl http://localhost:8081/events/1 \
  -H "Authorization: Bearer <TOKEN>"
```

Update event (ADMIN only):

```bash
curl -X PUT http://localhost:8081/events/1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Indie Fest",
    "category": "Music",
    "venue": "Red Hat Amphitheater",
    "city": "Raleigh",
    "dateTime": "2025-06-01T20:00:00",
    "source": "LOCAL",
    "status": "UPCOMING",
    "description": "Updated set times",
    "priceMin": 25.0,
    "priceMax": 75.0
  }'
```

Delete event (ADMIN only):

```bash
curl -X DELETE http://localhost:8081/events/1 \
  -H "Authorization: Bearer <TOKEN>"
```

Search by filters:

```bash
curl "http://localhost:8081/events/search?city=Raleigh&category=Music" \
  -H "Authorization: Bearer <TOKEN>"
```

## Status enum values

Valid values for `status` are `UPCOMING`, `CANCELLED`, and `PAST`. Valid `source` values are `LOCAL` and `TICKETMASTER`.