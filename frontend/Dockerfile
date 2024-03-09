FROM node:18-alpine as build
WORKDIR /frontend
COPY . /frontend/

RUN echo "Installation de Angular CLI"
RUN npm install -g @angular/cli@latest

RUN echo "Installation des dépendances npm"
RUN npm install

RUN echo "Construction de l'application Angular en mode production"
RUN ng build --configuration production

FROM nginx:latest AS ngi
RUN rm -rf /usr/share/nginx/html/*

RUN echo "Copie des fichiers de construction Angular vers Nginx"
COPY --from=build /frontend/dist /usr/share/nginx/html

COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 4200
