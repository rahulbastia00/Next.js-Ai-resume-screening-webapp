# AI Resume Matcher - Documentation

## 1. Overview
AI Resume Matcher is a full-stack application that uses AI to analyze resumes and match them against job descriptions. The backend is built using FastAPI, MongoDB, and AI models, while the frontend is developed using Next.js and Tailwind CSS.

## 2. Architecture Diagram
```
User -> Frontend (Next.js) -> Backend (FastAPI) -> Database (MongoDB)
                                        |                      |
                                  AI Model (Sentence Transformers)     LLM API (ChatGroq)
```

## 3. Tech Stack
- **Frontend:** Next.js, Tailwind CSS, ShadCN UI
- **Backend:** FastAPI, Uvicorn, Pymongo, Sentence Transformers
- **Database:** MongoDB
- **Deployment:** Docker, Render
- **AI Model:** Sentence Transformers, ChatGroq API
- **Version Control:** GitHub

## 4. Deployment Setup
### 4.1 Dockerization
#### Backend (FastAPI)
Dockerfile:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
#### Frontend (Next.js)
Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### 4.2 Cloud Deployment
#### Render Deployment (Backend)
```yaml
services:
  - type: web
    name: resume-analyzer-api
    env: docker
    rootDir: ai-model
    buildCommand: docker build -t resume-analyzer-api .
    startCommand: docker run -p $PORT:8000 resume-analyzer-api
    envVars:
      - key: GROQ_API_KEY
        sync: false
      - key: MONGO_DB
        sync: false
      - key: CORS_ORIGIN
        value: https://your-frontend-domain.com
```

## 5. Environment Variables
Create a `.env` file in the backend:
```
GROQ_API_KEY=your_api_key
MONGO_DB=mongodb+srv://username:password@cluster0.mongodb.net
CORS_ORIGIN=https://your-frontend-domain.com
```

## 6. API Endpoints
### 6.1 Resume Upload
**Endpoint:** `POST /upload/`
- Accepts: Resume file (PDF/DOCX) and job description
- Response: Similarity score and AI-generated analysis

### 6.2 Analytics
**Endpoint:** `GET /api/analytics/skills`
- Returns: Top 10 skills extracted from resumes

**Endpoint:** `GET /api/analytics/education`
- Returns: Distribution of education levels

**Endpoint:** `GET /api/analytics/similarity-scores`
- Returns: Resume match score distribution

**Endpoint:** `GET /api/analytics/top-candidates`
- Returns: Top 5 candidates based on match score

## 7. CI/CD Pipeline (GitHub Actions)
```yaml
name: Deploy Backend

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v3
        with:
          python-version: 3.9
      - name: Install Dependencies
        run: |
          pip install -r ai-model/requirements.txt
      - name: Build and Push Docker Image
        run: |
          docker build -t resume-analyzer-api ./ai-model
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy  --header "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

## 8. Monitoring & Logging
- **Backend Logs:** Uvicorn logs available in Render dashboard
- **Database Monitoring:** MongoDB Atlas monitoring tools
- **Error Handling:** Exception logging in FastAPI middleware

## 9. Security Best Practices
- **API Keys:** Store in environment variables, never hardcode
- **CORS Handling:** Restrict frontend origins in `CORS_ORIGIN`
- **Data Encryption:** MongoDB Atlas encryption enabled
- **User Input Sanitization:** Regex and NLP filtering for resume text

## 10. Future Enhancements
- Implement authentication for user profiles
- Improve AI model with deep learning techniques
- Integrate third-party job boards for real-time job matches

