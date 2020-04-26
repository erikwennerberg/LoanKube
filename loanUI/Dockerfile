FROM node:dubnium
WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .
RUN chmod +x ./startup.sh

EXPOSE 3000

CMD [ "npm", "start" ]