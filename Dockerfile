FROM node:20.17.0-slim

RUN npm install -g @nestjs/cli@10.1.17 pnpm@9.13.12

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]
