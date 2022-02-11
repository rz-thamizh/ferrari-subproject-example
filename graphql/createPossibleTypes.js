/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config({ path: './.env' });
const fetch = require('cross-fetch');
const fs = require('fs');

console.log(`Fetching ${process.env.RZ_PRIVATE_BACKEND_PATH}`);
fetch(process.env.RZ_PRIVATE_BACKEND_PATH, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
}).then((result) => result.json())
  .then((result) => {
    const possibleTypes = {};

    // eslint-disable-next-line no-underscore-dangle
    result.data.__schema.types.forEach((supertype) => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] = supertype.possibleTypes.map((subtype) => subtype.name);
      }
    });

    console.log('Crating new file');
    fs.writeFile('./graphql/possibleTypes.json', JSON.stringify(possibleTypes, undefined, 4), (err) => {
      if (err) {
        console.error('Error writing possibleTypes.json', err);
      } else {
        console.log('Fragment types successfully extracted!');
      }
    });
  });
