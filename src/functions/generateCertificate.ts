import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import dayjs from 'dayjs';
import { readFileSync } from 'fs';
import { join } from 'path';

import { document } from '@utils/dynamoDBClient';
import { generatePDF } from '@utils/generatePDF';
import { parseTemplate } from '@utils/parseTemplate';
import response from '@utils/response';

interface ICreateCertificate {
    id: string;
    name: string;
    grade: string;
}

export const handle = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;

    await document
        .put({
            TableName: 'users_certificates',
            Item: {
                id,
                name,
                grade,
            },
        })
        .promise();

    const templatePath = join(
        process.cwd(),
        'src',
        'templates',
        'certificate.hbs'
    );

    const medalPath = join(process.cwd(), 'src', 'templates', 'selo.png');

    const medal = readFileSync(medalPath, 'base64');

    const content = await parseTemplate({
        path: templatePath,
        variables: {
            id,
            name,
            grade,
            date: dayjs().format('DD/MM/YYYY'),
            medal,
        },
    });

    const pdf = await generatePDF(content);

    const s3 = new S3();

    await s3
        .putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: `${id}.pdf`,
            ACL: 'public-read',
            Body: pdf,
            ContentType: 'application/pdf',
        })
        .promise();

    return response({
        body: {
            message: 'Certificate generated',
            url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${id}.pdf`,
        },
        status: 201,
    });
};
