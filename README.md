# AWS Serverless Architecture Demo for X12 Serverless Bootcamp 2017


## Issues

| #  | Reporter | Issue | Status |
|---|---------|---------|--------|
| 1  |  Cam   | theres a weird issue where every previous booking is getting resubmitted. Try spamming  the Book Flight button for a few seconds and watch the server console log  | Open |

## Deployment 

### Prerequisite

- OS X/Linux (this demo must be deployed from OS X or Linux workstation)
- awscli (you need to install awscli `pip install awscli --user`, if you have awscli, we recommend to update it to latest version `pip install aws --upgrade --user`)
- NodeJS (you need to have nodejs runtime installed, in OS X `brew install node`, see [NodeJS installation](https://nodejs.org/en/download/package-manager/) for installation via different package managers)
- Download this project `git clone ssh://git.amazon.com/pkg/X12-Serverless-Demo-2017`

You have two options when it comes to running the scripts below:
- Use the shortcut 'step' goals; there is one step goal for each step
- Enter each individual goal as described in this README. You may choose to do this if you want to demo each individual step

### Step 0 - Configure Settings

The deployment needs a bucket for cloudformation deployments, you can create a new bucket or choose an existing bucket that you own. 

Either run:

```
make step0
```

Note that 'step0' tries to create an S3 bucket. If the bucket already exists it will fail; don't worry about this, it's safe to run it multiple times with the same bucket name.

or do the following:

If you want to create a new bucket for deployment, replace the bucket name and run the following command:

```
export BUCKET_NAME=YOUR-BUCKET-NAME
aws s3 mb s3://$BUCKET_NAME --region us-east-1
```

If you want to reuse an existing bucket, replace the bucket name in the export statement below and run the following command:

```
export BUCKET_NAME=YOUR-BUCKET-NAME
```


The following statements must be run regardless of whether you are creating a new bucket or not. They create the config for the deployment:


```
echo "REGION_NAME=us-east-1" > ./Booking/config.env
echo "BUCKET_NAME=$BUCKET_NAME" >>./Booking/config.env
echo "REGION_NAME=us-east-1" > ./Airmiles/config.env
echo "BUCKET_NAME=$BUCKET_NAME" >>./Airmiles/config.env
```

### Step 1 - Deploy Ticket Booking System

Now it is time to deploy the first API, Flight Booking.

Either run:

```
make step1
```

or do the following:

Run the following command:

```
make booking-api
```

### Step 2 - Start Web Sever

Now install Web Server dependencies.

Either run:

```
make step2
```

or do the following:

```
make webserver-dependency
```

After the installation, now you need to create the config for the Web Server, and put the Booking API's endpoint to the config. Run the following command to prepare the Web Server config

```
make update-web-booking-api-endpoint
```

```
make start-webserver
```

Now you can start your brower and visit [Localhost URL](http://127.0.0.1:3000/)

You should see the airline ticket booking site. 

Fill in the form and book a flight. After you have booked a ticket, the bookings table (at the bottom of the website page) shows your current bookings. Because we haven't deployed the Airmiles API yet, *you should see the airmiles column showing "N/A"*


### Step 3 - Deploy Airmiles API

As we now need to get the Airmile API's function working, we need to deploy the Airmile API and update our web server config.

Hit `CTRL+C` to stop the web server. 

Either run:

```
make step3
```

or do the following:

Run the following command to deploy Airmile API:

```
make airmiles-api
```

After deploying the Airmile API, we need to update the Booking API to include the Airmile SNS Topic Arn as a parameter, so run the following command:

```
make update-sns-topic-arn-for-booking-api
make update-booking-api
```

Now, you also need to configure the web server to use the Airmile API, so run the following command to configure the web server:

```
make update-web-airmile-api-endpoint
make start-webserver
```

Now, go back to your web browser and create a new booking. After the booking is submitted, *you should see the airmiles for the new booking*

### Clean Up

Clean up APIs

```
make clean
```
