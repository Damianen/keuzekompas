#!/bin/sh
set -e

# Set default API_URL if not provided
API_URL=${API_URL:-http://localhost:3000}

# Replace runtime environment variables in config.js
if [ -f /usr/share/nginx/html/config.js ]; then
    envsubst '${API_URL}' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp
    mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js
    echo "Config.js updated with API_URL=${API_URL}"
else
    echo "Warning: config.js not found, creating it..."
    echo "window.APP_CONFIG = { API_URL: '${API_URL}' };" > /usr/share/nginx/html/config.js
fi

# Start nginx
exec nginx -g 'daemon off;'
