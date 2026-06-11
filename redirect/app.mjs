import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const redirectHandler = async (event, context) => {
    const shortCode = event.pathParameters.shortCode;
    const result = await docClient.send(new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            shortCode: shortCode
        }
    }));
    const item = result.Item;
    if (!item){
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Short code not found"
            })
        };
    }else{
        return {
            statusCode: 301,
            headers: {
                Location: item.originalUrl
            },
            body: null
            };
            }
       };

 
