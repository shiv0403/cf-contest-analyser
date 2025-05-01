#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Install PM2 globally
npm install -g pm2

# Build the application
npm run build 