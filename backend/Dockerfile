FROM oven/bun:1.1.22

WORKDIR /app

# copy package files แยกเพื่อ cache
COPY package*.json bun.lockb* ./

# install deps
RUN bun install

# copy ที่จำเป็น (src จะ override ด้วย volume ตอน dev)
COPY ./prisma ./prisma
COPY ./tsconfig.json ./

EXPOSE 4000

CMD ["bun", "run", "dev"]