FROM node:14.17.0

MAINTAINER jinhyeokfang <jinhyeokfang@gmail.com>

RUN mkdir -p /app
RUN mkdir -p /data/db
WORKDIR /app
ADD . /app
RUN npm install

ENV NODE_ENV development

EXPOSE 80

CMD ["npm", "run", "build"]