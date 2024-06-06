#!/bin/bash

pushd application
echo "REACT_APP_VOSK_SERVER_URL=$REACT_APP_VOSK_SERVER_URL" > .env
popd

cd application && npm start
