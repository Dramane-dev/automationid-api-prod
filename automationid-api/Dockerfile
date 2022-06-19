FROM node:16.14.2-slim
WORKDIR /automationid-api
EXPOSE 3001
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]