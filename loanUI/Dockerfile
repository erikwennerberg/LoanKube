FROM node:16
WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .
RUN chmod +x ./startup.sh

EXPOSE 3000

CMD [ "npm", "start" ]