FROM node:18-alpine as build
WORKDIR /backend
COPY . /backend/
RUN npm install
RUN apk add --no-cache curl

FROM node:18-alpine AS release
COPY --from=build /backend /backend
WORKDIR /backend
EXPOSE 3000
CMD [ "npm", "start" ]