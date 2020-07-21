# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:latest as build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npm install @material-ui/core --save
RUN npm install @material-ui/lab --save
RUN npm install @material-ui/pickers --save
RUN npm install @amcharts/amcharts4 --save
RUN npm install @material-ui/styles --save
RUN npm install react-virtualized --save
RUN npm i @date-io/date-fns@1.x date-fns

COPY ./ /app/
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage app/nginx.conf /etc/nginx/conf.d/default.conf
