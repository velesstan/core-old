FROM node:14.15.1 AS development
WORKDIR /core
COPY package.json /core
RUN npm install
COPY . /core
RUN npm run build


FROM node:14.15.1-alpine as production

WORKDIR /core
ENV NODE_ENV = production
COPY package*.json ./
RUN npm i --only=production
COPY --from=development /core/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]