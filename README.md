
# UBS Project Management Portal

A web application for project management data visualization with AI assistant capabilities.

## Features

- Dashboard with workstream status overview
- RAG (Red/Amber/Green) status monitoring
- Interactive dependency visualization
- AI-powered chat interface for data queries
- Integration with SharePoint and GitLab
- Sentiment analysis for workstream performance
- Automated bi-weekly data snapshots

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling (following UBS design guidelines)
- Recharts for data visualization
- React Query for state management

### Backend
- FastAPI (Python)
- Azure OpenAI API integration for AI assistant
- Schedule for automated tasks

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- Docker and Docker Compose (optional for containerized deployment)

### Development Setup

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```
4. Create a `.env` file from `.env.example` and add your Azure OpenAI credentials

5. Start the backend:
   ```
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

6. In a separate terminal, start the frontend:
   ```
   npm run dev
   ```

7. Visit `http://localhost:5173` (or the port indicated by Vite)

### Using Docker Compose

1. Create a `.env` file with your Azure OpenAI credentials
2. Run:
   ```
   docker-compose up
   ```
3. Visit `http://localhost:8000`

## Azure OpenAI Integration

This application uses the Azure OpenAI service for the AI assistant capabilities. You'll need:

1. An Azure subscription
2. An Azure OpenAI resource
3. A model deployment (GPT-4 recommended)
4. The API key and endpoint

Add these credentials to your `.env` file:

```
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_KEY=your-azure-openai-key
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
```

## Data Snapshots

Data snapshots are automatically created every two weeks and stored in the `snapshots` directory. You can also manually trigger a snapshot via the API.
