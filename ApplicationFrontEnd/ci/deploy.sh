#!/bin/bash
npm run build;
aws s3 sync build/ s3://padely.ch --acl public-read

