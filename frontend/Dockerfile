FROM node:18-alpine as build
WORKDIR /frontend
COPY . /frontend/
RUN npm install

FROM node:18-alpine AS release
COPY --from=build /frontend /frontend
WORKDIR /frontend
EXPOSE 4200
CMD [ "npm", "start" ]