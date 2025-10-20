#!/bin/bash

# This script sets up the admin user and starts the development server
echo "Setting up admin user..."
npm run setup-admin

echo "Starting development server..."
npm run dev