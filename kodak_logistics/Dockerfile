# Stage 1: Build frontend
FROM node:18 as build-stage
WORKDIR /app/frontend

# Copy only necessary frontend files, excluding node_modules
COPY kodak-frontend/package*.json ./
RUN npm install

# Copy remaining frontend files
COPY kodak-frontend/ ./
RUN npm run build

# Stage 2: Django backend
FROM python:3.11.0
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

# Copy requirements first for better caching
COPY kodak_transport/requirements.txt .
RUN pip install -r requirements.txt

# Copy frontend build files
COPY --from=build-stage /app/frontend/build /app/backend/static/
COPY --from=build-stage /app/frontend/build/static /app/backend/static/
COPY --from=build-stage /app/frontend/build/index.html /app/backend/templates/

# Copy Django project
COPY kodak_transport/ .

# Collect static files and migrate
RUN python manage.py collectstatic --no-input
RUN python manage.py migrate

EXPOSE 8000
CMD ["gunicorn", "kodak_transport.wsgi:application", "--bind", "0.0.0.0:8000"]
