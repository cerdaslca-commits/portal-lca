FROM node:22-alpine
ENV NODE_ENV=production PUBLIC_DIR=/app/public DATA_DIR=/data
WORKDIR /app
COPY server.js penggerak.json /app/
COPY index.html admin.html kasbon.html kata.json kisah.json sitemap.xml robots.txt /app/public/
COPY media /app/public/media
EXPOSE 3000
CMD ["node", "server.js"]
