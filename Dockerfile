# Base Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all files to container
COPY . .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose port (Render auto-maps it, but we use 10000 or 8080)
EXPOSE 10000

# Start the app using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
