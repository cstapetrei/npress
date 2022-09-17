FROM node:14.16.0-buster-slim
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y --no-install-recommends \
      ca-certificates \
      bzip2 \
      libfontconfig \
      curl
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
#RUN npm install -g pm2
#RUN npm install -g gulp
#RUN gulp
COPY start.sh ./
RUN chmod +x start.sh
CMD [ "bash","-x","start.sh" ]