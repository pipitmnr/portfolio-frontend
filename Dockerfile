FROM nginx:stable
MAINTAINER Purnama Syafitri M  "syafitri@alterra.id"

RUN mkdir -p /alterra/www/react
RUN mkdir -p /alterra/logs/nginx

COPY default.conf /etc/nginx/conf.d/
COPY . /alterra/www/react

WORKDIR /alterra/www/react