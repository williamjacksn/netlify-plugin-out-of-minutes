FROM node:12.16.2-alpine3.11

COPY index.js manifest.yaml package.json README.md /netlify-plugin-out-of-minutes/
WORKDIR /netlify-plugin-out-of-minutes
