# Task Management Application

MERN stack application with PostgreSQL database.

## Features
- User authentication (JWT)
- Task CRUD operations
- Dashboard with Chart.js statistics
- PostgreSQL database with Sequelize ORM

## Live Demo
- Frontend: 
![Login](login.png)
![Home](home.png)
![Task](task.png)

- Backend API: 

The backend is built with Node.js and Express, providing a RESTful API for secure user authentication and task management. It utilizes Sequelize ORM to interact with the PostgreSQL database.

## Request Flow

The application follows a secure request flow integrating Supabase for authentication and a local PostgreSQL database for data persistence.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Supabase
    participant Database

    User->>Frontend: Perform Action (e.g., Create Task)
    Frontend->>Backend: API Request (with Bearer Token)
    Note right of Frontend: Token from Supabase Auth

    Backend->>Supabase: Verify Token (getUser)
    Supabase-->>Backend: User Data (Email, Metadata)

    Backend->>Database: Find or Create User (Sync)
    Database-->>Backend: Local User Record (ID)

    Backend->>Database: Perform Task Operation (scoped to User ID)
    Database-->>Backend: Operation Result

    Backend-->>Frontend: API Response (JSON)
    Frontend-->>User: Update UI
```


### System Interaction Flow

```mermaid
graph TD
    User((User))
    Frontend[Frontend]
    Backend[Backend API]
    Supabase[Supabase Auth]
    DB[(PostgreSQL DB)]

    User -->|Interacts| Frontend
    Frontend -->|1. Request + JWT| Backend
    Backend -->|2. Verify Token| Supabase
    Supabase -->|User Metadata| Backend
    Backend -->|3. Sync User & Operation| DB
    DB -->|Result| Backend
    Backend -->|4. Response| Frontend
    Frontend -->|Update UI| User
```


## Login Flow

The application uses GitHub OAuth via Supabase for authentication.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase
    participant GitHub

    
User -> Frontend: Click "Login with GitHub"
Frontend -> Supabase SDK: signInWithOAuth({ provider: 'github' })

Supabase -> Browser: 302 Redirect to GitHub OAuth URL

User -> GitHub: Authenticate & Authorize

GitHub -> Supabase Callback URL: /auth/v1/callback?code=xyz

Supabase -> Browser: 302 Redirect to Frontend Redirect URL with session hash

Frontend -> Supabase SDK: getSession()
Supabase -> Frontend: Session (user + access token)

Frontend -> Redux: setCredentials()
Frontend -> User: Redirect to Dashboard

```

1.  **Initiation**: User clicks login button.
2.  **Redirect**: App redirects to GitHub via Supabase.
3.  **Authentication**: User signs in on GitHub.
4.  **Callback**: GitHub calls back Supabase, which redirects to the app with a session hash.
5.  **Session Restoration**: `AuthWrapper` detects the session, fetches user details, and updates the global state.

## Local Development
[Your local setup instructions]
add env 
    PORT=5000
    NODE_ENV=development
    JWT_SECRET=your_jwt_secret
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    SUPABASE_URL=your_supabase_connection_string

