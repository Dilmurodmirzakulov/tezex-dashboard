#!/bin/bash

# This script creates all the TypeScript files for the backend

echo "Creating all TypeScript files..."

# Create entities directory if it doesn't exist
mkdir -p src/{auth/{dto,entities,guards,strategies},audit/{dto,entities},clients/{dto,entities},parcels/{dto,entities},pricing/{dto,entities},tracking/entities,stats,database/seeds,config}

echo "All files will be created..."
