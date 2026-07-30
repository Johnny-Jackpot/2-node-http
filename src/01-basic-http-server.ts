import http, {type IncomingMessage, type ServerResponse} from "node:http";

const PORT = 5000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
  console.log('req.headers: ', req.method);
  console.log('req.headers: ', req.headers);
  console.log('req.url: ', req.url);

  const userAgent = req.headers['user-agent'];
  console.log('userAgent: ', userAgent);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Basic HTTP node server: ${req.method}: ${req.url}: ${userAgent}`);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

