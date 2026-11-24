FROM node:22.23.1-alpine AS base

ARG BACKEND_URL
ARG COMMIT_SHA
ARG BUILD_DATE
ARG ALGOLIA_APP_ID
ENV REACT_APP_BACKEND_URL=${BACKEND_URL}
ENV REACT_APP_COMMIT_SHA=${COMMIT_SHA}
ENV REACT_APP_BUILD_DATE=${BUILD_DATE}
ENV REACT_APP_ALGOLIA_APP_ID=${ALGOLIA_APP_ID}
ENV APP /app
WORKDIR $APP

COPY package.json $APP
COPY package-lock.json $APP

RUN npm ci

COPY . $APP

RUN npm run-script build

FROM node:22.23.1-alpine AS release

ENV APP /app
WORKDIR $APP

RUN npm install -g serve

COPY --from=base /app/build/ /app/

CMD ["serve", "-s", "."]

