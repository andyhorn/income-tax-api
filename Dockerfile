# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.20.3
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="NestJS"

# NestJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy application code
COPY --link . .

# Install node_modules for client
RUN npm ci --include=dev --prefix ./client

# Install node_modules for server
RUN npm ci --include=dev

# Build application
RUN npm run build:ci

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/client/dist ./dist/client

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]
