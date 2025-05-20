FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source
COPY . .

# Generate Prisma client
RUN npx prisma generate

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

# Use entrypoint
ENTRYPOINT ["entrypoint.sh"]
