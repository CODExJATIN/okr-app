# OKR App

A full-stack Objectives and Key Results (OKR) management application.

## Tech Stack

### Client
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4
- **Language:** TypeScript
- **State/Validation:** Formik, Yup
- **Routing:** React Router DOM

### Server
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Database:** PostgreSQL (with `pgvector` extension)
- **AI Integration:** Google Generative AI, LangChain
- **Language:** TypeScript
- **Testing:** Jest

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (Package manager)
- [Docker](https://www.docker.com/) (Required for the database)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CODExJATIN/okr-app.git
   cd okr-app
   ```

2. **Install dependencies:**
   Since this project uses a root `pnpm-lock.yaml`, you can install dependencies for all packages from the root:
   ```bash
   pnpm install
   ```

## Database Setup

The server requires a PostgreSQL database with the `pgvector` extension, which is provided via Docker.

1. **Start the database container:**
   ```bash
   cd server
   docker-compose up -d
   ```
   This will start a PostgreSQL instance on port `5433` (as configured in `docker-compose.yaml`).

2. **Initialize the database schema:**
   Apply the Prisma migrations to set up the database tables (run this from the `server` directory):
   ```bash
   npx prisma migrate dev
   ```
   *Note: Ensure your `.env` file in the `server` directory is configured to point to the local database.*

## Running the Application

You will need to run the client and server in separate terminal instances.

### Start the Server (API)
```bash
cd server
pnpm start:dev
```
The server will start (default port is usually 3000).

### Start the Client (Frontend)
```bash
cd client
pnpm run dev
```
The frontend will start (default port is usually 5173). Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

- **`client/`**: React frontend application.
- **`server/`**: NestJS backend application.
- **`server/prisma/`**: Database schema and migrations.
- **`server/docker-compose.yaml`**: Database container configuration.
