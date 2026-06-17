import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { generateShortCode } from "./shortcode.mjs";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const shortenHandler = async (event, context) => {
    const requestData = JSON.parse(event.body);
    const url = requestData.url;
    let shortCode;
    while (true){
        shortCode = generateShortCode();
        try{
            await docClient.send(new PutCommand({
                TableName: process.env.TABLE_NAME,
                Item: {
                    shortCode: shortCode,
                    originalUrl: url,
                    createdAt: new Date().toISOString()
                },
                ConditionExpression: "attribute_not_exists(shortCode)"
             }));
            break;
            } catch (err){
                if (err.name === "ConditionalCheckFailedException"){
                    console.log("Collision on code:", shortCode, "- retrying");
                    continue;
                }
                throw err;
            }
    }
    
    
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: {"received": url, "shortCode": shortCode}
        })
    };

    return response;
}