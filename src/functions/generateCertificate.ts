import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import dayjs from "dayjs";
import { readFileSync } from "fs";
import { join } from "path";

import { document } from "@utils/dynamoDBClient";
import { generatePDF } from "@utils/generatePDF";
import { parseTemplate } from "@utils/parseTemplate";
import response from "@utils/response";

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
      TableName: "users_certificates",
      Item: {
        id,
        name,
        grade,
      },
    })
    .promise();

  const templatePath = join(
    process.cwd(),
    "src",
    "templates",
    "certificate.hbs"
  );

  const medalPath = join(process.cwd(), "src", "templates", "selo.png");

  const medal = readFileSync(medalPath, "base64");

  const content = await parseTemplate({
    path: templatePath,
    variables: {
      id,
      name,
      grade,
      date: dayjs().format("DD/MM/YYYY"),
      medal,
    },
  });

  await generatePDF(content);

  return response({ body: { message: "Certificate generated" }, status: 201 });
};
