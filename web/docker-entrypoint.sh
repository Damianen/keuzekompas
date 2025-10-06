#!/bin/sh

# Replace runtime environment variables in config.js
envsubst '${API_URL}' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp
mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g 'daemon off;'
