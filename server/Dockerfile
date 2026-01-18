FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir .

# Expose port 8080 (standard for uvicorn, though Railway will override usage)
EXPOSE 8080

# Start command
# We use ${PORT:-8080} to use the env var PORT if set, otherwise default to 8080
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
