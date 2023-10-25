import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Agent } from '../utils/agents';

export const dvmApi = createApi({
  reducerPath: 'dvmApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://plebai.com/',
  }),
  tagTypes: ['Agents'],
  endpoints: (builder) => ({
    getAgents: builder.query<Agent[], void>({
      query: () => `agents`,
      providesTags: ['Agents'],
    }),
  }),
});

export const { useGetAgentsQuery } = dvmApi;    
