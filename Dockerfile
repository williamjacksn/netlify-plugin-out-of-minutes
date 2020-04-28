FROM node:12.16.2-alpine3.11

COPY .npmrc /root/
COPY index.js manifest.yml package.json README.md /netlify-plugin-out-of-minutes/

WORKDIR /netlify-plugin-out-of-minutes

ENTRYPOINT ["/bin/sh"]
