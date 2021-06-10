import {document} from '@utils/dynamoDBClient';
import {response} from '@utils/response';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

export const handle = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {id, name, grade} = JSON.parse(event.body) as ICreateCertificate;

  await document.put({
    TableName: 'users_certificates',
    Item: {
      id,
      name,
      grade,
    },
  }).promise();

  return response({body: {message: 'Certificate generated'}, status: 201});
};
