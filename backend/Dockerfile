# Development Dockerfile สำหรับ Backend (Bun + Elysia)
FROM oven/bun:1.1.22

WORKDIR /app

# Copy package files
COPY package*.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start development server with hot reload
CMD ["bun", "run", "dev"]