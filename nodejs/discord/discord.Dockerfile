FROM node:alpine

ADD . /discord
WORKDIR /discord
COPY $IN_POM_PATH $OUT_POM_PATH
RUN chmod 600 $OUT_POM_PATH
RUN chmod +x /discord/discord.sh
CMD ["/discord/discord.sh"]
