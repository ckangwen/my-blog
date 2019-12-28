#!/usr/bin/env sh

set -e

yarn run build

cd docs/.vuepress/dist

git add -A
git commit -m 'deploy'

git push -f https://github.com/ckangwen/my-blog.git master:gh-pages

cd -