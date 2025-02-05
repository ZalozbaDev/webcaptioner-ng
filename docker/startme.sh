#!/bin/bash

pushd application
echo "REACT_APP_WEBCAPTIONER_SERVER=$REACT_APP_WEBCAPTIONER_SERVER"                 >  .env
echo "REACT_APP_YOUTUBE_REGION=$REACT_APP_YOUTUBE_REGION"                           >> .env
echo "REACT_APP_PASSWORD=$REACT_APP_PASSWORD"                                       >> .env
echo "REACT_APP_DEFAULT_SOTRA_MODEL=$REACT_APP_DEFAULT_SOTRA_MODEL"                 >> .env
echo "REACT_APP_DEFAULT_YOUTUBE_TIME_OFFSET=$REACT_APP_DEFAULT_YOUTUBE_TIME_OFFSET" >> .env
echo "REACT_APP_SEND_TIMESTAMP=$REACT_APP_SEND_TIMESTAMP"                           >> .env
echo "REACT_APP_SEND_TIMESTAMP_COUNT=$REACT_APP_SEND_TIMESTAMP_COUNT"               >> .env

popd

cd application && npm start
