FROM node:20-alpine

WORKDIR /app/webapp

COPY webapp/package*.json ./
RUN npm ci

COPY webapp ./

EXPOSE 3000

# WebApp 构建与部署命令（官方说明）[3](https://github.com/datascale-ai/inksight/blob/main/docs/en/button-controls.md)
RUN npm run build
CMD ["npm", "run", "start"]
