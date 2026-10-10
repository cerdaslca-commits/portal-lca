FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html /srv/index.html
COPY kata.json /srv/kata.json
COPY kisah.json /srv/kisah.json
COPY media /srv/media
