
interface IResponse {
    body: Record<string, any>,
    status?: number;
}

export function response({body, status}: IResponse) {
  return {
    statusCode: status || 200,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
