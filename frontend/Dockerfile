FROM oven/bun:1.1.22

WORKDIR /app

COPY package*.json bun.lockb* ./
RUN bun install

COPY ./tsconfig.json ./

EXPOSE 3000

CMD ["bun", "run", "dev"]