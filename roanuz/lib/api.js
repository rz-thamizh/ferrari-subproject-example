import axios from 'axios';
import Config from '@/config';

let apiInstance = null;

export const MappanAPI = {
  forMappanApiHeaderKey: 'x-api-key',

  createInstance(mappanApiKey) {
    const defaultHeaders = {};

    defaultHeaders[MappanAPI.forMappanApiHeaderKey] = mappanApiKey;
    const instance = axios.create({
      baseURL: Config.MappanApiPath,
      headers: defaultHeaders,
    });

    instance.interceptors.request.use((_config) => {
      // Do something before request is sent
      const config = _config;
      config.params = config.params || {};
      config.meta = config.meta || {};
      config.meta.requestStartedAt = new Date().getTime();
      return config;
    }, (error) => {
      // Do something with request error
      return Promise.reject(error);
    });

    instance.interceptors.response.use((config) => {
      return config;
    }, (config) => {
      console.error(`APIRequestFAILED\t${config}\t`);
    });

    console.log('Created new MappanAPI Instance');

    return instance;
  },

  instance(mappanApiKey) {
    if (apiInstance == null) {
      apiInstance = this.createInstance(mappanApiKey);
    }
    return apiInstance;
  },
};
