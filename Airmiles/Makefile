S3_BUCKET=$(shell grep '^BUCKET_NAME=' config.env | awk -F= '{print $$2}')
REGION_NAME=$(shell grep '^REGION_NAME=' config.env | awk -F= '{print $$2}')
TEMPLATE=sam-loyalty-output.yaml
STACK_NAME=sam-loyalty

.PHONY: create-s3-bucket transform-sam-template deploy clean

create-s3-bucket:
	aws s3 mb s3://$(S3_BUCKET) --region $(REGION_NAME)

transform-sam-template:
	aws cloudformation package --template-file sam-loyalty.yaml --output-template-file $(TEMPLATE) --s3-bucket $(S3_BUCKET) --region $(REGION_NAME)

deploy: transform-sam-template
	aws cloudformation deploy --template-file $(TEMPLATE) --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION_NAME)

update: transform-sam-template
	aws cloudformation deploy --template-file $(TEMPLATE) --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION_NAME) 

query-airmiles-api:
	@aws cloudformation describe-stacks --stack-name $(STACK_NAME) --query "Stacks[].Outputs[?OutputKey == \`LoyaltyAPI\`].OutputValue[]" --output text --region $(REGION_NAME)

query-sns-arn:
	@aws cloudformation describe-stacks --stack-name $(STACK_NAME) --query "Stacks[].Outputs[?OutputKey == \`AirmilesSnsArn\`].OutputValue[]" --output text --region $(REGION_NAME)

clean:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION_NAME) && \
	aws cloudformation wait stack-delete-complete --stack-name $(STACK_NAME) --region $(REGION_NAME)


	
	
