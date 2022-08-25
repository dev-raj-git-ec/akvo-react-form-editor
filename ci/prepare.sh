docker run \
       --rm \
       --volume "$(pwd):/home/akvo-react-form-editor" \
       --workdir "/home/akvo-react-form-editor" \
       --entrypoint /bin/sh \
       node:17.3.0-alpine3.15 -c './build.sh'
