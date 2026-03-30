# Libheros — Application de gestion de tâches

Application fullstack de gestion de listes de tâches, développée dans
le cadre du test technique Libheros.

## Stack technique

| Couche       | Technologies                                   |
|--------------|-------------------------------------------------|
| **Backend**  | NestJS, Sequelize, PostgreSQL, JWT (bcrypt)     |
| **Frontend** | Vue 3 (Composition API), TypeScript, Tailwind   |
| **Tests**    | Jest, Supertest (e2e)                           |
| **Infra**    | Docker Compose                                  |

## Lancer le projet

### Avec Docker (recommandé)

```bash
docker compose up --build
```

- Frontend : **http://localhost:5173**
- Backend API : **http://localhost:3000**

### Sans Docker

Prérequis : Node.js 20+, PostgreSQL 16+

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE libheros_todo;"

# Backend
cd backend
cp .env.example .env
npm install
npm run start:dev    # → http://localhost:3000

# Frontend (autre terminal)
cd frontend
npm install
npm run dev          # → http://localhost:5173
```

### Lancer les tests

```bash
cd backend
npm run test:e2e
```

## Fonctionnalités

- Authentification JWT (inscription avec vérification + connexion)
- CRUD complet listes de tâches (création, lecture, renommage, suppression)
- CRUD complet tâches (description courte/longue, échéance optionnelle, statut)
- Modification des tâches (description, échéance) via vue détaillée
- Renommage des listes (double-clic)
- Toggle tâches terminées / à faire
- Section "Mes tâches terminées" (masquable)
- Vue détaillée avec date de création
- Suppression avec confirmation (modals)
- Sidebar rétractable
- Session persistante (7 jours)
- Cascade delete (liste → tâches)

## Structure du projet

```
├── backend/src/
│   ├── auth/          # Authentification JWT
│   ├── users/         # Module utilisateurs
│   ├── task-lists/    # CRUD listes de tâches
│   ├── tasks/         # CRUD tâches
│   ├── app.module.ts
│   └── main.ts
├── frontend/src/
│   ├── views/         # LoginView, RegisterView, HomeView
│   ├── components/    # Layout, Tasks, UI
│   ├── composables/   # useAuth, useTaskLists, useTasks
│   ├── services/      # Axios + interceptors
│   └── router/        # Routes + guard
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Méthode | Route                      | Description               |
|---------|----------------------------|---------------------------|
| POST    | /auth/register             | Inscription               |
| POST    | /auth/login                | Connexion                 |
| POST    | /task-lists                | Créer une liste           |
| GET     | /task-lists                | Lister ses listes         |
| PATCH   | /task-lists/:id            | Renommer une liste        |
| DELETE  | /task-lists/:id            | Supprimer une liste       |
| POST    | /task-lists/:listId/tasks  | Créer une tâche           |
| GET     | /task-lists/:listId/tasks  | Lister les tâches         |
| GET     | /tasks/:id                 | Détail d'une tâche        |
| PATCH   | /tasks/:id                 | Modifier une tâche        |
| DELETE  | /tasks/:id                 | Supprimer une tâche       |

## Auteur

**NGUYEN Dinh Huy** — dinh_huy.nguyen@insa-cvl.fr
- GitHub : [github.com/dhuy21](https://github.com/dhuy21)
- Portfolio : [portfolio-ndhuy.up.railway.app](https://portfolio-ndhuy.up.railway.app)
