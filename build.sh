#!/usr/bin/env bash
#shellcheck disable=SC2039

set -euo pipefail

npm install -g microbundle-crl
yarn
sed -i 's/"warn"/"error"/g' .eslintrc.json
yarn test:lint
yarn test:prettier
yarn test:unit
yarn build
