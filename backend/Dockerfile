FROM node:18-alpine

WORKDIR /app

# Install required dependencies for Prisma
RUN apk add --no-cache openssl1.1-compat

COPY package.json ./

RUN npm install || (echo "npm install failed" && exit 1)

COPY . .

RUN npx prisma generate || (echo "prisma generate failed" && exit 1)

EXPOSE 3000

# Use start for production
CMD ["npm", "start"]