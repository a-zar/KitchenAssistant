# Kitchen Assistant

Aplikacja webowa do zarządzania spiżarnią, listą zakupów i przepisami w jednej lokalnej platformie.

## Opis projektu

Kitchen Assistant to aplikacja, która pozwala:

- przeglądać i zarządzać produktami,
- tworzyć oraz utrzymywać listę zakupów,
- przechowywać i organizować przepisy,
- korzystać z prostego, intuicyjnego interfejsu użytkownika.

Projekt składa się z osobnych warstw backendu i frontendu, co ułatwia rozwój, testowanie i utrzymanie aplikacji.

## Stack technologiczny

- Backend: Java 17, Spring Boot 3.2.5, Spring Data REST, Spring Validation
- Frontend: Angular 14, TypeScript, Bootstrap
- Baza danych: MySQL
- Migracje schematu: Flyway

## Struktura repozytorium

- `KitchenAssistantBackend/` – aplikacja backendowa
- `KitchenAssistantFrontend/` – aplikacja frontendowa
- `README.md` – dokumentacja projektu

## Wymagania wstępne

- Java 17+
- Maven Wrapper / Maven
- Node.js i npm
- MySQL uruchomione lokalnie

## Uruchomienie lokalne

### Backend

1. Przejdź do katalogu backendu:
   ```bash
   cd KitchenAssistantBackend
   ```
2. Uruchom aplikację:
   ```bash
   ./mvnw spring-boot:run
   ```
   albo na Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

Backend domyślnie działa pod adresem:

- `http://localhost:8080`

### Frontend

1. Przejdź do katalogu frontendu:
   ```bash
   cd KitchenAssistantFrontend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom aplikację:
   ```bash
   npm start
   ```

Frontend dostępny jest pod adresem:

- `http://localhost:4200`

## Konfiguracja

Backend odczytuje ustawienia z pliku:

- `KitchenAssistantBackend/src/main/resources/application.properties`

W projekcie używane są lokalne dane bazy MySQL oraz konfiguracja Flyway.

## Funkcjonalności

- zarządzanie produktami i kategoriami,
- lista zakupów,
- przepisy kuchenne,
- integracja z usługami REST,
- wsparcie dla podstawowych operacji CRUD.
