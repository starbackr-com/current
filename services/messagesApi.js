import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messagesApi = createApi({
    reducerPath: "messagesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/",
        }),
    endpoints: (build) => ({
        getMessages: build.query({
            queryFn: (pubkeys) => ({ data: [] }),
            async onCacheEntryAdded(
              arg,
              { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
              const ws = new WebSocket('wss://nostr1.starbackr.me')
              try {
                await cacheDataLoaded
                ws.onopen = () => {
                    console.log('Connected!')
                    ws.send(JSON.stringify(['REQ', Math.random().toString().slice(2),
                    {
                      kinds: [1],
                      authors: ['02547d2ac238e94776af95cf03343d31f007a7306e909462522fff0f5c13724c']
                    }]))
                }
                ws.onerror = (e) => {
                    console.log(e.message);
                  };
                ws.onmessage = (e) => {
                    const data = JSON.parse(e.data)
                  updateCachedData((draft) => {
                    draft.push(data)
                  })
                }
              } catch {
                // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                // in which case `cacheDataLoaded` will throw
              }
              await cacheEntryRemoved
              console.log('This happened')
              ws.close()
            },
          }),
    }),
});

export const {
    useGetMessagesQuery
} = messagesApi;
