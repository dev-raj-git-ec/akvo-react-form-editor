#!/bin/sh
#shellcheck disable=SC2039

if [[ "${example}" == "true" ]]; then
    cd example
    yarn install
    yarn start
else
    yarn install
    yarn start
fi
