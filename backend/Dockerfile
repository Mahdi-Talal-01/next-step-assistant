FROM node:18-alpine

WORKDIR /app

COPY ./backend/package.json /app/

RUN npm install || (echo "npm install failed" && exit 1)

COPY ./backend /app/

RUN npx prisma generate || (echo "prisma generate failed" && exit 1)

EXPOSE 3000

# Use start for production
CMD ["npm", "start"]