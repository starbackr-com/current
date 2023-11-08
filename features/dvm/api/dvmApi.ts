import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Agent, SamplePrompts } from '../utils/agents';

type PromptRequestData = {
  agentId: string;
  offset: number;
  limit: number;
};

export const dvmApi = createApi({
  reducerPath: 'dvmApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://plebai.com/',
  }),
  tagTypes: ['Agents', 'Prompts'],
  endpoints: (builder) => ({
    getAgents: builder.query<Agent[], void>({
      query: () => `agents`,
      providesTags: ['Agents'],
    }),
    getSamplePrompts: builder.query<SamplePrompts[], PromptRequestData>({
      query: ({ agentId, offset, limit }) =>
        `prompts/${agentId}/${limit}/${offset}`,
      providesTags: (_result, _error, queryArg) => [
        { type: 'Prompts', id: queryArg.agentId },
      ],
    }),
  }),
});

export const { useGetAgentsQuery, useGetSamplePromptsQuery } = dvmApi;
