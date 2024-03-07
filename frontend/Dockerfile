FROM node:18-alpine as build
WORKDIR /frontend
COPY . /frontend/
RUN npm install -g @angular/cli@latest
RUN npm install
RUN ng build --configuration production

FROM nginx:latest AS ngi
RUN rm -rf /usr/share/nginx/html/*
COPY /dist/frontend /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 4200