#!/bin/bash

# Create resources directory in lib if it doesn't exist
mkdir -p lib/resources

# Copy all resources from src to lib
cp -r src/resources/* lib/resources/

echo "Resources copied successfully"
