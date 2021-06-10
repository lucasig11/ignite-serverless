import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { document } from '@utils/dynamoDBClient';
import response from '@utils/response';

export const handle = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;

    const dbQuery = await document
        .query({
            TableName: 'users_certificates',
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id,
            },
        })
        .promise();

    const [userCertificate] = dbQuery.Items;

    if (!userCertificate) {
        return response({
            status: 400,
            body: { message: 'Certificado inválido' },
        });
    }

    return response({
        body: {
            name: userCertificate.name,
            url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${id}.pdf`,
        },
    });
};
