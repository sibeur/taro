export function decodeBasicAuthToken(token): {
  clientId: string;
  secretKey: string;
} {
  const decodedToken = Buffer.from(token, 'base64').toString('binary');
  const [clientId, secretKey] = decodedToken.split(':');
  return { clientId, secretKey };
}
