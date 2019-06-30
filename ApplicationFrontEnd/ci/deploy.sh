#!/bin/bash
npm run start;
aws s3 sync build/ s3://padely.ch --acl public-read

