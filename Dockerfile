FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN sed -i 's/\r$//' /app/scripts/entrypoint.sh && chmod +x /app/scripts/entrypoint.sh \
    && sed -i 's/\r$//' /app/scripts/entrypoint-worker.sh && chmod +x /app/scripts/entrypoint-worker.sh

EXPOSE 3000

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
