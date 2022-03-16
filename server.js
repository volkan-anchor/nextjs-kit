const express = require('express')
const next = require('next')
const proxy = require('http-proxy-middleware');
const { GoogleAuth } = require('google-auth-library');
const execSync = require('child_process').execSync;
const fs = require('fs');


const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const DEFAULT_TARGET_AUDIENCE =
  '541620653883-djvsk0b5pv2s7m006mmdvq1a9si8h1n2.apps.googleusercontent.com';

function rawBodyMiddleware(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function (chunk) {
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

function iapProxy(client, url, target) {
  return async function (req, res, next) {
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
    } catch (error) {
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

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
