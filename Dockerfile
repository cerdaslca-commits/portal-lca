FROM node:22-alpine
ENV NODE_ENV=production PUBLIC_DIR=/app/public WEB_DIR=/app/web DATA_DIR=/data
WORKDIR /app
COPY server.js /app/server.js
COPY index.html admin.html kata.json kisah.json sitemap.xml robots.txt /app/public/
COPY media /app/public/media
# Desain baru (hasil build web-src/ → web/): beranda, /donasi, /desa
COPY web /app/web
EXPOSE 3000
CMD ["node", "server.js"]
