# Use official Nginx image
FROM nginx:latest

# Copy frontend files to Nginx html directory
COPY . /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80
