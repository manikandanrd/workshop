from __future__ import print_function
import boto3
import json
import os

print('Loading function')

TABLE_NAME = os.environ['TABLE_NAME']


# responds to GET request from API Gateway. Returns a single booking with associated airmiles
def getbooking_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    # get booking id
    bookingid = event['pathParameters']['bookingid']
    print("DynamoDB table name: " + TABLE_NAME)
    print("bookingid: " + str(bookingid))
    client = boto3.client('dynamodb')

    response = client.get_item(
        TableName=TABLE_NAME,
        Key={
            "bookingid": {
                'S': bookingid
            }
        }
    )

    print("GetItem succeeded:")
    print("get response: " + str(response))
    item = response["Item"] if ("Item" in response) else {}
    return {
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({"data": item})
    }
