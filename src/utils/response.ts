import { APIGatewayProxyResult } from 'aws-lambda';

interface IResponse {
    body: Record<string, unknown>;
    status?: number;
}

export default function response({
    body,
    status = 200,
}: IResponse): APIGatewayProxyResult {
    return {
        statusCode: status,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    };
}
