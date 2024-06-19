#!/bin/bash

pushd application
echo "REACT_APP_WEBCAPTIONER_SERVER=$REACT_APP_WEBCAPTIONER_SERVER" >  .env
echo "REACT_APP_YOUTUBE_REGION=$REACT_APP_YOUTUBE_REGION"           >> .env
echo "REACT_APP_PASSWORD=$REACT_APP_PASSWORD"                       >> .env

popd

cd application && npm start
