# Transport Registry App

Fullstack-приложение для ведения реестра транспорта:
- **backend**: Node.js + Express + Sequelize + PostgreSQL
- **frontend**: React (Create React App) + MUI
- запуск backend+DB — через **Docker Compose**

## Структура репозитория

- `server/` — backend + docker-compose для backend и PostgreSQL
- `client/` — frontend (React)

## Требования

### Для запуска через Docker (backend + DB)
- Docker
- Docker Compose (plugin `docker compose`)

### Для запуска фронтенда
- Node.js (рекомендуется **Node 20+**)
- npm

---

## Быстрый старт

### 1) Backend + PostgreSQL (Docker Compose)

Перейдите в папку сервера:

```bash
cd server

Создайте файл .env в папке server/:

PORT=3001
DB_NAME=vehicle_registration
DB_USER=postgres
DB_PASSWORD=00000000
DB_HOST=db
DB_PORT=5432
SECRET_KEY=d0a9d3cc8347615464a062deb740589ae8e2efb8ed3af3ea3a3aba97cda41b07
SALT_ROUNDS=10
NODE_ENV=development

Запуск:

docker compose up --build

После старта:
	•	backend будет доступен на http://localhost:3001
	•	PostgreSQL будет доступен на localhost:5432 (логин/пароль см. ниже)

Остановка:

docker compose down

Остановка с удалением volume БД (удалит данные):

docker compose down -v

Параметры БД по умолчанию в server/docker-compose.yml:

• user: postgres
•	password: 00000000
•	db: vehicle_registration

Если по каким-то причинам не заработает бд.

docker compose exec app sh -lc 'printf "DB_PASSWORD=<%s>\n" "$DB_PASSWORD"; env | egrep "DB_USER|DB_PASSWORD|DB_HOST|DB_PORT|DB_NAME|NODE_ENV"'

docker compose exec app sh -lc 'printf "%s" "$DB_PASSWORD" | od -An -t x1'

docker compose exec app sh -lc 'apk add --no-cache postgresql-client >/dev/null 2>&1 || true; PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "select 1;"'

docker compose exec db sh -lc 'apk add --no-cache postgresql-client >/dev/null 2>&1 || true; PGPASSWORD=00000000 psql -h 127.0.0.1 -U postgres -d vehicle_registration -c "select 1;"'

docker compose exec db sh -lc 'psql -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '\''00000000'\'';"'

docker compose exec app sh -lc 'apk add --no-cache postgresql-client >/dev/null 2>&1 || true; PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "select 1;"'
docker compose restart app
