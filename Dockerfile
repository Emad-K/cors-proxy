FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy application files
COPY . .

# Expose port (internal only)
EXPOSE 8080

# Set default environment variables
ENV PORT=8080

# Run the application
CMD ["pnpm", "run", "start"]
