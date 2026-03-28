# OKR APP
The OKR (Objectives and Key Results) App is a simple application for creating, tracking and managing objectives and their measurable key results.

## Initial Setup
Ignore this step if you have already installed these technologies
- install nodejs [click here](https://nodejs.org/en/download)
- install Docker Desktop [click here](https://www.docker.com/products/docker-desktop/)
- setup pnpm : npm install -g pnpm

---

## Server

### env setup
- DATABASE_URL=postgresql://{user}:{postgres}@localhost:5433/{db-name}

### Database
- cd server
- docker compose up

### Nest application
- pnpm install
- pnpx prisma db push
- pnpm start:dev

---

## Client

### Vite application

- pnpm install
- pnpm run dev

