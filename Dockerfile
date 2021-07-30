FROM node:14.17.3

RUN mkdir -p /app
RUN mkdir -p /data/db
WORKDIR /app
ADD . /app
RUN npm install

ENV NODE_ENV development

EXPOSE 80

CMD ["npm", "run", "build"]