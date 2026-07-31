import http, {type IncomingMessage, type ServerResponse} from "node:http";

const PORT = 5002;

type CreateUserBody = {
  name?: string;
  email?: string;
};

const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
  const method = req.method ?? "GET";
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers['host']}`);
  const pathName = requestUrl.pathname;

  res.setHeader('Content-Type', 'text/plain');

  if (method === "POST" && pathName === "/users") {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const rawBody = Buffer.concat(chunks).toString('utf-8');
        if (!rawBody) {
          res.statusCode = 400;
          res.end('req body is required');
          return;
        }

        const body = JSON.parse(rawBody) as CreateUserBody;
        if (!body.name || !body.email) {
          res.statusCode = 400;
          res.end('both name and email are required');
          return;
        }

        res.statusCode = 201;
        res.end(`user created ${body.name} and ${body.email}`);
      } catch (error) {
        res.statusCode = 400;
        res.end('invalid request body');
      }
    });

    req.on('error', () => {
      res.statusCode = 500;
      res.end('failed to read request body');
    });

    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})