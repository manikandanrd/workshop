.PHONY: deploy

S3_BUCKET=$(shell grep '^BUCKET_NAME=' config.env | awk -F= '{print $$2}')
REGION_NAME=$(shell grep '^REGION_NAME=' config.env | awk -F= '{print $$2}') 
AIRMILES_SNS_ARN=$(shell if grep -q '^AIRMILES_SNS_ARN=arn:' config.env; then grep '^AIRMILES_SNS_ARN=' config.env | awk -F= '{print $$2}'; else echo "REPLACE-AIRMILES-SNS-ARN"; fi) 
STACK_NAME=FlightBooking
SAM_TEMPLATE=sam-flight-booking.yaml
TEMPLATE=cfn-sam-flight-booking.yaml
PARAMETERS=parameters.json

cfndsl:
	which cfndsl || gem install cfndsl

jq:
	which jq || brew install jq

compile: cfndsl jq
	cfndsl bookaflight.rb | jq . --sort-keys | tee bookaflight.json


transform-sam-template:
	aws cloudformation package --template-file $(SAM_TEMPLATE) --output-template-file $(TEMPLATE) --s3-bucket $(S3_BUCKET) --region $(REGION_NAME)

deploy: transform-sam-template
	aws cloudformation deploy \
		--template-file $(TEMPLATE) \
		--stack-name $(STACK_NAME) \
		--capabilities CAPABILITY_IAM \
		--parameter-override AirmilesSnsArn=$(AIRMILES_SNS_ARN) \
		--region $(REGION_NAME)

update: transform-sam-template
		aws cloudformation deploy \
			--template-file $(TEMPLATE) \
			--stack-name $(STACK_NAME) \
			--capabilities CAPABILITY_IAM \
			--parameter-override AirmilesSnsArn=$(AIRMILES_SNS_ARN) \
			--region $(REGION_NAME) 

query-bookings-api:
	@aws cloudformation describe-stacks --stack-name $(STACK_NAME) --query Stacks[0].Outputs[0].OutputValue --output text --region $(REGION_NAME)

clean:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION_NAME) && \
	aws cloudformation wait stack-delete-complete --stack-name $(STACK_NAME) --region $(REGION_NAME)

sns-topic-output:

