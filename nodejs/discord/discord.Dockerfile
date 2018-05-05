FROM node:alpine

ADD . /discord
WORKDIR /discord
RUN chmod +x /discord/discord.sh
CMD ["/discord/discord.sh"]
