#!/bin/sh

/bin/echo "//registry.npmjs.org/:_authToken=${NPMJS_AUTH_TOKEN}" > ~/.npmrc
/usr/local/bin/npm publish
