import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const shortenHandler = async (event, context) => {
    const requestData = JSON.parse(event.body);
    const url = requestData.url;
    const shortCode = Math.random().toString(36).substring(2, 8);
    await docClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            shortCode: shortCode,
            originalUrl: url,
            createdAt: new Date().toISOString()
        }
    }));
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: {"received": url, "shortCode": shortCode}
        })
    };

    return response;
}