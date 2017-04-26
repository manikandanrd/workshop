from __future__ import print_function
import boto3
import json
import os
import random
import math

print('Loading function')

TABLE_NAME = os.environ['TABLE_NAME']

# triggered by SNS containing airline booking record, puts record into DynamoDB
def booking_event_handler(event, context):
    # print("Received event: " + json.dumps(event, indent=2))
    print("DynamoDB table name: " + TABLE_NAME)
    message = event['Records'][0]['Sns']['Message']
    print("From SNS: " + message)
    for record in event['Records']:
        if 'aws:sns' == record['EventSource'] and record['Sns']['Message']:
            json_msg = json.loads(record['Sns']['Message'])
            bookingid = json_msg['bookingid']
            odfrom = json_msg['from']
            odto = json_msg['to']
            flighttimestamp = json_msg['flighttimestamp']
            airmiles = random.randint(50, 1000) 
            print("got booking from sns: " + str(bookingid) + odfrom + odto + flighttimestamp + str(airmiles))

        # insert into DynamoDB
        dynamodb = boto3.resource('dynamodb')

        table = dynamodb.Table(TABLE_NAME)

        response = table.put_item(
            Item={
                'bookingid': bookingid,
                'odfrom': odfrom,
                'odto': odto,
                'flighttimestamp': flighttimestamp,
                'airmiles': int(math.floor(airmiles))
            }
        )

        print("PutItem succeeded:")

    return message
