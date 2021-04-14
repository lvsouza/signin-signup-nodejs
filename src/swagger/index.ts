const store: any = {
  paths: {} as { [path: string]: any }
};

interface swaggerProps {
  route: string;
  tags?: string[];
  summary?: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  responses?: {
    statusCode: number;
    description?: string;
    contentType: 'application/json' | 'text/plain' | 'image/jpeg' | 'multipart/form-data' | 'application/x-www-form-urlencoded' | '*/*';
    content: any;
  }[];
}
const swagger = (props: swaggerProps) => {
  const responses: { [statusCode: string]: any } = {};

  props.responses?.forEach(response => {
    responses[response.statusCode] = {
      description: response.description,
      contentType: response.contentType,
      content: {
        [response.contentType]: {
          schema: {
            type: 'array',
            content: response.content,
          }
        }
      },
    }
  });

  store.paths[props.route] = {
    [props.method.toLowerCase()]: {
      responses,
      tags: props.tags,
      summary: props.summary || '',
      description: props.description || '',
    }
  };
}

interface ISwaggerSpecificationOptions {
  title?: string,
  openapi: string,
  version?: string,
  description?: string,
  servers: {
    url: string,
    description?: string,
  }[],
}
const swaggerSpecification = (options: ISwaggerSpecificationOptions) => {
  return {
    ...options,
    ...store,
  }
};

export { swagger, swaggerSpecification }
