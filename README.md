# Weatherbot_backend
A telegram bot repository which send daily weather updates.

## For installing the project on your localhost

1. Open git bash inside the folder you want to clone the repository.
2. Type command git clone https://github.com/00shalini/weatherbot_backend.git <folder name> !Folder name is optional.
3. Navigate to the project root folder and type command npm install.
4. npm start to start the project.

## To test the telegram bot 

1. You need to search @weather_updatesbot on telegram
2. click on start. To again start it type /start.

# To deploy

1. Create a new [AWS Lambda function](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions): Go to the AWS Management Console, navigate to Lambda and click on "Create function". Choose "Author from scratch" and give your function a name. Choose the appropriate runtime for your code Node.js and set the execution role to "Create a new role with basic Lambda permissions".

2. Upload your code: In the function code section, you can either upload a ZIP file containing your code or paste your code directly into the inline code editor. Make sure your code includes all the required dependencies and configuration files.

3. Set environment variables: In the "Configuration" tab of your Lambda function, you can set environment variables for your function. This is where you can store your Telegram bot token and other sensitive information.

4. Create an [API Gateway](https://us-east-1.console.aws.amazon.com/apigateway/main/apis?region=us-east-1): To allow incoming HTTP requests to your Lambda function, you need to create an API Gateway. In the "API Gateway" section of your Lambda function, click on "Create API" and choose "REST API".

5. Configure your API Gateway: Once your API Gateway is created, you can configure the integration between your Lambda function and your API Gateway. In the "Integration Request" section of your API Gateway, choose "Lambda Function" as the integration type and select your Lambda function from the dropdown menu.

6. Deploy your API Gateway: After configuring the integration, you need to deploy your API Gateway to make it publicly accessible. In the "Actions" dropdown menu, choose "Deploy API" and select a deployment stage (e.g., "prod").

7. Set up your webhook: Once your API Gateway is deployed, you can use the URL of your API Gateway as your Telegram bot webhook. Use the setWebhook method of the Telegram API to set the URL of your API Gateway as the webhook for your bot.

That's it.
### Here's the vedio presentation of telegram bot working. 
  https://github.com/00shalini/weatherbot_backend/assets/61345989/5737c01e-5bf8-418d-922a-f6ddd7b1a329
