.PHONY: booking-api webserver-dependency start-webserver

#the steps below match the steps in the README. They can be used as shortcuts instead of executing each individual goal

step0: 
	@export BUCKET_NAME=mcdg-serverless-bkt && aws s3 mb s3://$$BUCKET_NAME --region us-east-1 && echo "REGION_NAME=us-east-1" > ./Booking/config.env && echo "BUCKET_NAME=$$BUCKET_NAME" >>./Booking/config.env && echo "REGION_NAME=us-east-1" > ./Airmiles/config.env && echo "BUCKET_NAME=$$BUCKET_NAME" >>./Airmiles/config.env

step1: booking-api

step2: webserver-dependency update-web-booking-api-endpoint start-webserver

step3: airmiles-api update-sns-topic-arn-for-booking-api update-booking-api update-web-airmile-api-endpoint start-webserver

clean: clean-booking-api clean-airmile-api
	@echo "Stacks are removed"

#individual goals. Either use the steps above as a shortcut or execute each goal individualy as explained in the README

booking-api:
	@cd booking && make deploy

update-booking-api:
	@cd booking && make update

airmiles-api:
	@cd Airmiles && make deploy

update-airmiles-api:
	@cd Airmiles && make update

webserver-dependency:
	@cd Web && make dependency

update-web-booking-api-endpoint:
	@cd Booking && export endpoint=`make query-bookings-api` && echo {\"endpoint\": \"$$endpoint\"} >../Web/booking-api-config.json

update-web-airmile-api-endpoint:
	@cd Airmiles && export endpoint=`make query-airmiles-api` && echo {\"endpoint\": \"$$endpoint\"} >../Web/airmile-api-config.json

update-sns-topic-arn-for-booking-api:
	@cd Airmiles && export arn=`make query-sns-arn` && echo "AIRMILES_SNS_ARN=$$arn" >>../Booking/config.env

start-webserver:
	@cd Web && make server

clean-booking-api:
	@cd Booking && make clean 

clean-airmile-api:
	@cd Airmiles && make clean
