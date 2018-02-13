#!/usr/bin/env bash

rm -rf build
open -a Terminal.app scripts/dev-truffle.sh
npm run compile
npm run migrate