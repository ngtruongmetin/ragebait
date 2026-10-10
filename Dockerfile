FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci

FROM dependencies AS api-build
COPY tsconfig.base.json ./
COPY apps/api apps/api
RUN npm run build --workspace=@ragebait/api

FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev --workspace=@ragebait/api
COPY --from=api-build /app/apps/api/dist apps/api/dist
EXPOSE 9001
CMD ["node", "apps/api/dist/server.js"]

FROM dependencies AS web-build
COPY tsconfig.base.json ./
COPY apps/web apps/web
RUN npm run build --workspace=@ragebait/web

FROM nginx:1.27-alpine AS web
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 9000
