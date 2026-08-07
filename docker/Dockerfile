FROM node:20.11.1-bookworm
MAINTAINER Daniel Sobe <daniel.sobe@sorben.com>

# docker build -t webcaptioner-ng .
# docker build -t webcaptioner-ng . --no-cache

# RUN useradd -u 1000 -m reactapp

RUN mkdir -p /application/public && chown 1000:1000 /application/public
RUN mkdir -p /application/src && chown 1000:1000 /application/public

COPY --chown=1000:1000 public /application/public
COPY --chown=1000:1000 src    /application/src
COPY --chown=1000:1000 package.json package-lock.json tsconfig.json /application/

RUN cd application && npm install && cd .. && chown -R 1000:1000 /application/

COPY --chown=1000:1000 docker/startme.sh /

USER 1000

CMD ["/bin/bash", "-c", "/startme.sh"] 
