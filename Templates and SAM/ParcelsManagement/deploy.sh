#!/bin/bash

aws cloudformation package --template-file parcels_management_api.yaml --output-template-file parcels_management_spec.yml --s3-bucket osb-sbhack19-lambda
aws cloudformation deploy --template-file parcels_management_spec.yml --stack-name OSBHACK19-PARCELSAPI --capabilities CAPABILITY_IAM
