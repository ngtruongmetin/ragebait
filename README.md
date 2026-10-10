# ragebait

React/Vite frontend and Express API foundation. Requirements: Node.js 22+ and npm.

## Local

1. Copy `.env.example` to `.env` if custom environment values are required.
2. Run `npm ci`.
3. Run `npm run dev`.

Open `http://localhost:9000`. API health is `http://localhost:9001/api/health`. The development server fails rather than changing ports if 9000 is unavailable; the API validates that its port is exactly 9001.

Useful checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Docker

Run `docker compose up --build`. Browser traffic reaches `http://localhost:9000`; the frontend's `/api` requests are proxied internally to `backend:9001`, while the API remains directly available at `http://localhost:9001/api/health`. Docker DNS is never embedded into browser JavaScript.

See `docs/architecture.md` for decisions and `docs/development.md` for the feature workflow.

## VPS deployment: ragebait.bcic.site

Production keeps the application ports fixed but binds them only to the VPS loopback interface:

- Frontend container: `127.0.0.1:9000` -> `9000`
- API container: `127.0.0.1:9001` -> `9001`
- Public HTTPS endpoint: `https://ragebait.bcic.site`

On the DNS provider, create an `A` record for `ragebait.bcic.site` pointing to the VPS public IPv4 address. Open ports `80` and `443` in the VPS firewall. Do not expose `9000` or `9001` publicly.

On an Ubuntu/Debian VPS with Docker Compose, run these commands after cloning the repository:

```bash
cp .env.production.example .env.production
nano .env.production
chmod +x scripts/deploy-vps.sh scripts/healthcheck-vps.sh
./scripts/deploy-vps.sh
```

Install the reverse-proxy configuration, enable it, and obtain the first certificate:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo cp deploy/nginx/ragebait.bcic.site.http.conf /etc/nginx/sites-available/ragebait.bcic.site
sudo ln -s /etc/nginx/sites-available/ragebait.bcic.site /etc/nginx/sites-enabled/ragebait.bcic.site
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d ragebait.bcic.site
sudo cp deploy/nginx/ragebait.bcic.site.conf /etc/nginx/sites-available/ragebait.bcic.site
sudo nginx -t
sudo systemctl reload nginx
```

The temporary HTTP configuration lets Certbot validate the domain before the TLS server block references certificate files. For later releases, pull the code and run `./scripts/deploy-vps.sh`. Verify with `./scripts/healthcheck-vps.sh`.
