const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

type HttpMethods = (typeof HttpMethods)[keyof typeof HttpMethods];

export default HttpMethods;
