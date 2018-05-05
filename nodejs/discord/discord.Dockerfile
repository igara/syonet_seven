FROM node:alpine

ADD . /discord
WORKDIR /discord
COPY $POM_PATH $POM_PATH
RUN mkdir $POM_DIR_PATH
RUN chmod 600 $POM_PATH
RUN chmod +x /discord/discord.sh
CMD ["/discord/discord.sh"]
