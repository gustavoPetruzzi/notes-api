FROM node:12-alpine
WORKDIR /notes-api
COPY . .
RUN npm install --production
CMD ["node", "/notes-api/app.js"]
