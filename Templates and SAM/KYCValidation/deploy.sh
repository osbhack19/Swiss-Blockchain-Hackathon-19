#!/bin/bash

aws cloudformation package --template-file kyc_api.yaml --output-template-file new_app_spec.yml --s3-bucket osb-sbhack19-lambda
aws cloudformation deploy --template-file new_app_spec.yml --stack-name SBHACK19-KYCAPI --capabilities CAPABILITY_IAM
