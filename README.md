# Smart Task Manager

A modern, polished task management application with intelligent auto-categorization, priority levels, and a beautiful card-based interface.

## Features

- **Auto-Categorization**: Tasks are automatically categorized based on keywords in the title and description
- **Priority Management**: Set and visualize task priorities (High, Medium, Low)
- **Status Tracking**: Track tasks through Todo, In Progress, and Done statuses
- **Smart Filtering**: Filter tasks by status, priority, and category
- **Beautiful UI**: Modern card-based design with smooth animations and responsive layout
- **Statistics Dashboard**: View task counts by status at a glance

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite + Tailwind CSS
- **Storage**: JSON file-based persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "SFL CANDIDATE ASSESSMENT TASK"
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running Locally

1. Start the backend server:
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001`

2. Start the frontend development server (in a new terminal):
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### Building for Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The built files will be in the `frontend/dist` directory

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /health` - Health check endpoint

## Deployment

### Backend Deployment (Railway)

1. Push your code to GitHub
2. Go to [Railway](https://railway.app) and create a new project
3. Connect your GitHub repository
4. Railway will auto-detect the Node.js project
5. Set the root directory to `backend` in project settings
6. Railway will automatically set the PORT environment variable
7. Once deployed, copy your backend URL (e.g., `https://your-app.railway.app`)

### Backend Deployment (Render - Alternative)

1. Push your code to GitHub
2. Go to [Render](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variable `PORT` (Render auto-assigns, but you can set it explicitly)
6. Once deployed, copy your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
4. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL + `/api` (e.g., `https://your-app.railway.app/api`)
5. Deploy!

### Testing Deployment

After deployment:
1. Test backend health: Visit `https://your-backend-url/health`
2. Test API: Visit `https://your-backend-url/api/tasks` (should return `[]`)
3. Test frontend: Visit your Vercel URL and try creating a task
4. Verify the frontend can communicate with the backend

## Project Structure

```
/
├── backend/
│   ├── server.js          # Express server setup
│   ├── routes/
│   │   └── tasks.js       # Task CRUD routes
│   ├── utils/
│   │   └── categorize.js  # Auto-categorization logic
│   ├── data/
│   │   └── tasks.json     # Task storage (gitignored)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   └── styles/        # CSS styles
│   └── package.json
└── README.md
```

## Auto-Categorization

Tasks are automatically categorized based on keywords:

- **Work**: meeting, call, email, project, deadline, etc.
- **Personal**: personal, family, friend, home, etc.
- **Shopping**: buy, purchase, grocery, shopping, etc.
- **Health**: exercise, workout, gym, doctor, etc.
- **Learning**: study, learn, course, book, etc.
- **Travel**: travel, trip, flight, hotel, etc.
- **Finance**: bill, payment, invoice, budget, etc.

## License

ISC
