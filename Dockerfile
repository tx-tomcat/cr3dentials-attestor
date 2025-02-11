FROM node:18-slim

WORKDIR /app

# Install git using apt-get
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Create required directory and file
RUN mkdir -p /app/src/scripts && \
    touch /app/src/scripts/prepare.sh

# Install dependencies
RUN pnpm install
RUN pnpm download:zk-files

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Start the application
CMD ["pnpm", "run", "start"]
