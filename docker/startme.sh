#!/bin/bash

pushd application
echo "REACT_APP_VOSK_SERVER_URL=$REACT_APP_VOSK_SERVER_URL"   > .env
echo "REACT_APP_SOTRA_SERVER_URL=$REACT_APP_SOTRA_SERVER_URL" > .env
echo "REACT_APP_YOUTUBE_REGION=$REACT_APP_YOUTUBE_REGION"     > .env

popd

cd application && npm start
