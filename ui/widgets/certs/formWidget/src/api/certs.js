import { getDefaultOptions, request } from 'api/helpers';

const resource = 'certs';

export const apiCertsGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiCertsPost = async (serviceUrl, certs) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: certs ? JSON.stringify(certs) : null,
  };
  return request(url, options);
};

export const apiCertsPut = async (serviceUrl, certs) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: certs ? JSON.stringify(certs) : null,
  };
  return request(url, options);
};

export const apiCertsDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
