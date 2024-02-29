import {type H3Event} from 'h3';

export const getContext = (event: H3Event): {
  provider: string | undefined
  tenantId: string | undefined
} => {
  const {providerHeaderKey, tenantIdHeaderKey} = useRuntimeConfig().databaseModule;

  return {
    provider: getHeader(event, providerHeaderKey) || getQuery(event)[providerHeaderKey],
    tenantId: getHeader(event, tenantIdHeaderKey) || getQuery(event)[tenantIdHeaderKey],
  }
};
