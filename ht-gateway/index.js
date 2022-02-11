const express = require('express');
const bodyParser = require('body-parser');
const hash = require('object-hash');
const morgan = require('morgan');
const cors = require('cors');
const zlib = require('zlib');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3101;
const HOST = '127.0.0.1';
const API_SERVICE_URL = process.env.HTSRC;

app.use(cors());

// Logging
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Info GET endpoint
app.get('/info', (req, res) => {
  res.send('This is a proxy service which proxies for graphql.');
});

// Authorization
// app.use('', (req, res, next) => {
//   if (req.headers.authorization) {
//       next();
//   } else {
//       res.sendStatus(403);
//   }
// });

const CACHE = {};
const skipCache = {
  createEmptyCart: true,
  addToCartMutation: true,
  mergeCartMutation: true,
  SetShippingMethodMutation: true,
  setShippingAddressesOnCartMutation: true,
  setPaymentMethodAndOrderMutation: true,
  rzNetgiroToken: true,
  rzPaymentCaptureNetgiro: true,

  cart: true,
  customerCart: true,
  createCustomer: true,
  customerToken: true,
  cartDetail: true,
  customerCartDetail: true,
  cartMini: true,
  customerCartMini: true,
  CustomerCartId: true,
  customerOrder: true,
  // ProductDetailQuery: true,

  customerWishList: true,
  customerProfileMini: true,
};

function getCache(key) {
  return CACHE[key];
}

function setCache(key, data) {
  CACHE[key] = data;
}

app.use((req, res, next) => {
  if (req.path === '/proxy/graphql') {
    const { body } = req;
    // console.log('Headers', req.headers);
    // console.log('Body', body);

    if (body.operationName && skipCache[body.operationName] === undefined) {
      const variableHash = { ...body.variables };
      variableHash.operationName = body.operationName;
      let cacheKey = hash(variableHash);
      const cachedResponse = getCache(cacheKey);
      if (cachedResponse) {
        console.log('Using Cache', cacheKey, variableHash);
        res.send(cachedResponse);
        cacheKey = null;
        // next();
        return;
      }
      console.log('Creating Cache', cacheKey, variableHash);
      const oldWrite = res.write;
      const oldEnd = res.end;

      const chunks = [];
      res.write = function writeResponse(chunk, ...args) {
        chunks.push(chunk);
        return oldWrite.apply(res, [chunk, ...args]);
      };

      res.end = function responseEnd(chunk, ...args) {
        try {
          if (chunk) {
            chunks.push(chunk);
          }
          if (chunks.length > 0 && (typeof chunks[0] === 'string')) {
            console.log('Skipping Error');
            oldEnd.apply(chunks.join(''), [chunk, ...args]);
          } else {
            const buffer = Buffer.concat(chunks);
            const responseBody = zlib.gunzipSync(buffer).toString('utf-8');
            if (!responseBody.startsWith('{"errors:[')) {
              setCache(cacheKey, responseBody);
              oldEnd.apply(res, [chunk, ...args]);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
    } else if (body.operationName) {
      console.log('Skipping Cache for ', body.operationName);
    }
  }
  next();
});

function logProvider(provider) {
  // replace the default console log provider.
  return require('winston');
}

// Proxy endpoints
app.use('/proxy', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  logProvider,
  onProxyReq: (...a) => {
    console.log(a);
    fixRequestBody(...a);
  },
}));

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
