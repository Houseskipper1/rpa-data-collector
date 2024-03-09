FROM node:18-alpine as build
WORKDIR /backend
COPY . /backend/

RUN echo "Installation des dépendances npm"
RUN npm install

RUN echo "Installation de curl"
RUN apk add --no-cache curl

FROM node:18-alpine AS release

RUN echo "Copie des fichiers depuis l'étape de build vers l'étape de release"
COPY --from=build /backend /backend

WORKDIR /backend
EXPOSE 3000

CMD [ "npm", "start" ]
