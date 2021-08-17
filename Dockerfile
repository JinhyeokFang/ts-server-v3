FROM node:14.17.3

RUN mkdir -p /app
RUN mkdir -p /data/db
WORKDIR /app
ADD . /app
RUN npm install
RUN npm run build

ENV NODE_ENV development

EXPOSE 80

CMD ["npm", "start"]