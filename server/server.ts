import express, { NextFunction, Request, Response } from "express";
import next from 'next';
import { GoogleAuth, IdTokenClient } from 'google-auth-library';
import { execSync } from "child_process";
import fs from "fs";

const port = parseInt(process.env.PORT!, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const DEFAULT_TARGET_AUDIENCE =
  '541620653883-djvsk0b5pv2s7m006mmdvq1a9si8h1n2.apps.googleusercontent.com';

function rawBodyMiddleware(req: any, res: Response, next: NextFunction) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function (chunk: any) {
    req.rawBody += chunk;
  });
  req.on('end', function () {
    next();
  });
  req.on('error', function () {
    // TODO Better error message
    return res.status(400).send('An error occured');
  });
}

function iapProxy(client: IdTokenClient, url: string, target: string) {
  return async function (req: any, res: Response, next: NextFunction) {
    if (req.url !== url) {
      return next();
    }

    try {
      const response = await client.request({
        ...req,
        // Override variables
        url: target + req.url,
        headers: {
          'Content-Type': req.headers['content-type'],
          'Content-Length': req.headers['content-length'],
          'User-Agent': req.headers['user-agent'],
          Cookie: req.headers.cookie,
        },
        body: req.rawBody,
        timeout: 60000,
      });
      return res.status(200).send(response.data);
    } catch (error: any) {
      const code = error.code;
      const data = error.response.data;
      return res.status(code).send(data);
    }
  };
}

// TODO add fetch target code from Jenny in RISK/src/setupProxy.js
// default target
const TARGET = 'https://risk.anchorage-development.com';

app.prepare().then(async () => {
  const server = express()

  const keyLocation =
    process.env.HOME + '/.config/dotfiles/frontend-tester-key.json';
  if (!fs.existsSync(keyLocation)) {
    execSync(
      'gcloud iam service-accounts keys create --iam-account frontend-tester@development-204920.iam.gserviceaccount.com ' +
      keyLocation
    );
  }

  const client = await new GoogleAuth({
    keyFilename: keyLocation,
  }).getIdTokenClient(DEFAULT_TARGET_AUDIENCE);

  server.use(rawBodyMiddleware);
  server.use(iapProxy(client, '/v1', TARGET));
  server.use(iapProxy(client, '/graphql', TARGET));

  server.all("*", (req: Request, res: Response) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
