
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/

# Environment variables can be passed at runtime
ENV AZURE_OPENAI_ENDPOINT=""
ENV AZURE_OPENAI_KEY=""
ENV AZURE_OPENAI_DEPLOYMENT="gpt-4"

# Create a directory for snapshots
RUN mkdir -p /app/snapshots

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
