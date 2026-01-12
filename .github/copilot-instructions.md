<!-- Copilot instructions for AI coding agents working on KitchenAssistant -->
# KitchenAssistant — Copilot instructions

This file gives concise, concrete guidance for AI coding agents to be productive in this repository.

- **High-level architecture:** Backend is a Spring Boot (Java 17) application in `KitchenAssistantBackend` and frontend is an Angular 14 app in `KitchenAssistantFrontend`.
- **Build / run:** Backend uses Maven wrapper (`mvnw` / `mvnw.cmd`). Frontend uses `npm` / Angular CLI.

- **Key files / locations (examples):**
  - Backend main: `KitchenAssistantBackend/src/main/java/com/azet/KitchenAssistant/KitchenAssistantApplication.java`
  - Controllers: `KitchenAssistantBackend/src/main/java/com/azet/KitchenAssistant/controller/` (e.g. `CategoryController.java`, `NutrientsController.java`)
  - Service layer: `.../service/`
  - DAO: `.../dao/`
  - Entities: `.../Entity/` (note capital `E`) and DTOs under `.../dto/`
  - Flyway migrations: `KitchenAssistantBackend/src/main/resources/db/migration/` (keep migrations additive)
  - Backend config: `KitchenAssistantBackend/src/main/resources/application.properties` (DB, CORS, API base-path)
  - Frontend services: `KitchenAssistantFrontend/src/app/services/` (example `product.service.ts` uses `baseUrl = 'http://localhost:8080/api/products'`)

- **Run locally (typical):**
  - Backend (Linux/macOS): `cd KitchenAssistantBackend && ./mvnw spring-boot:run`
  - Backend (Windows): `cd KitchenAssistantBackend && mvnw.cmd spring-boot:run`
  - Build backend jar: `./mvnw package` (or `mvnw.cmd package` on Windows) then `java -jar target/<artifact>.jar`
  - Frontend: `cd KitchenAssistantFrontend && npm install && npm start` (runs `ng serve` on port 4200)

- **API contract / expectations:**
  - Backend exposes REST under `/api` (see `spring.data.rest.base-path=/api` in `application.properties`).
  - Frontend services call `http://localhost:8080/api/...` (see `ProductService.baseUrl`). Keep host/port in sync during local dev.

- **Database & migrations:**
  - MySQL is expected (see `spring.datasource.*`). Flyway migrations live under `src/main/resources/db/migration/`; modify schema by adding new versioned migration files — do not edit applied migrations.

- **Secrets & environment:**
  - Do not read or commit secrets from `application.properties`. Prefer environment variables (e.g., `SPRING_AI_OPENAI_API_KEY`) when testing features that call external APIs.

- **Project-specific patterns & conventions:**
  - Package layout follows controller → service → dao → Entity → dto.
  - Entity folder is named `Entity` (capital E) — preserve capitalization when importing.
  - Backend uses Spring Data / Spring Boot idioms; for altering exposed repository behavior check `config/MyDataRestConfig.java`.
  - Frontend uses Angular services that embed full backend URLs; prefer updating `baseUrl` consistently in `src/app/services/*` when changing host/port.

- **Tests & verification:**
  - Backend tests: `cd KitchenAssistantBackend && ./mvnw test` (or `mvnw.cmd test` on Windows).
  - Frontend tests: `cd KitchenAssistantFrontend && npm test`.

- **Editing guidance for agents:**
  - When changing DB schema add a new Flyway migration; do not alter existing `V*.sql` files.
  - When adding REST endpoints, add controller + service + unit tests and update any affected frontend service `baseUrl` or endpoints.
  - Preserve existing package names and folder capitalization (Java imports depend on it).

- **Quick checks / grep targets:**
  - Search for `baseUrl =` in frontend services to find API consumers.
  - Inspect `src/main/resources/db/migration/` for migration history.
  - Look at `application.properties` for DB / CORS / Flyway configuration.

If anything here is unclear or you need examples for a specific task (e.g., adding a migration, creating a new controller, or updating a frontend service), say which area and I will expand with concrete code examples and tests.
