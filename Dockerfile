FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
CMD [ "node", "src/app.mjs" ]