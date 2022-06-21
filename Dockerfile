FROM nginx:1.18.0-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
