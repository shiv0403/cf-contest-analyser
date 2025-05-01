#!/usr/bin/env bash
# exit on error
set -o errexit

# Start the application with PM2
if [ "$RENDER_SERVICE_TYPE" = "web" ]; then
  npm run start
else
  npm run start:worker
fi 