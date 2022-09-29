#!/usr/bin/env bash
#shellcheck disable=SC2039

set -exuo pipefail

IMAGE_CACHE_LIST=$(grep image ./docker-compose.yml \
    | sort -u | sed 's/image\://g' \
    | sed 's/^ *//g')
mkdir -p ./ci/images

# RESTORE IMAGE
while IFS= read -r IMAGE_CACHE; do
    IMAGE_CACHE_LOC="./ci/images/${IMAGE_CACHE//\//-}.tar"
    if [ -f "${IMAGE_CACHE_LOC}" ]; then
        docker load -i "${IMAGE_CACHE_LOC}"
    fi
done <<< "${IMAGE_CACHE_LIST}"

docker run --rm \
       --volume "$(pwd):/home/akvo-react-form-editor" \
       --workdir "/home/akvo-react-form-editor" \
       --entrypoint /bin/bash \
       akvo/akvo-node-18-alpine:20220923.084347.0558ee6 -c './build.sh'

if [[ "${CI_BRANCH}" != "main" ]]; then
docker run -it --rm \
    --volume "$(pwd)/docs:/docs" \
        akvo/akvo-sphinx:20220829.093307.b5bbf28 make html
fi

# STORE IMAGE CACHE
while IFS= read -r IMAGE_CACHE; do
    IMAGE_CACHE_LOC="./ci/images/${IMAGE_CACHE//\//-}.tar"
    if [[ ! -f "${IMAGE_CACHE_LOC}" ]]; then
        docker save -o "${IMAGE_CACHE_LOC}" "${IMAGE_CACHE}"
    fi
done <<< "${IMAGE_CACHE_LIST}"
