// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

module.exports = {
  client: {
    service: {
      localSchemaFile: './graphql/schema.graphql',
    },
  },
};
