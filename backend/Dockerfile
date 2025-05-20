FROM node:18-alpine
WORKDIR /app

# OS deps
RUN apk add --no-cache openssl

# 1) Copy package files
COPY package*.json ./

# 2) Copy Prisma schema so `postinstall` hook can generate client
COPY prisma ./prisma

# 3) Install deps (this will run `prisma generate` if you have it in postinstall)
RUN npm install --production

# 4) Copy rest of the source
COPY . .

# 5) (Re-)generate client in case schema changed after install
RUN npx prisma generate

# 6) Entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]
