import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletApi = createApi({
    reducerPath: "walletApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://starbackr.me/",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.walletBearer;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
        
    }),
    tagTypes: ['Balance'],
    endpoints: (builder) => ({
        postNewWallet: builder.mutation({
            query: ({ login, password }) => ({
                url: `create`,
                method: "POST",
                body: {
                    login,
                    password,
                    partnerid: "starbackr",
                    accounttype: "wallet",
                },
            }),
        }),
        postLogin: builder.mutation({
            query: ({ login, password }) => ({
                url: `auth`,
                method: "POST",
                body: {
                    login: login,
                    password: password,
                },
            }),
        }),
        getWalletBalance: builder.query({
            query: () => `balance`,
            providesTags: ['Balance']
        }),
        postInvoice: builder.mutation({
            query: ({ amtinusd, memo }) => ({
                url: `addinvoice`,
                method: "POST",
                body: {
                    amtinusd,
                    memo,
                },
            }),
            invalidatesTags: ['Balance'],
        }),
        checkUsername: builder.query({
            query: (username) => `.well-known/nostr.json?name=${username}`
        }),
        postPayment: builder.mutation({
            query: ({invoice}) => ({
                url: 'payinvoice',
                method: 'POST',
                body: {
                    invoice
                }
            }),
            invalidatesTags: ['Balance']
        }),
        getTransactions: builder.mutation({
            query: (page) => ({
                url: 'txnhistory',
                method: 'POST',
                body: {
                    limit: 100,
                    offset: page ? page * 100 : 0
                }
            })
        }),
    }),
});

export const {
    usePostNewWalletMutation,
    useGetWalletBalanceQuery,
    usePostLoginMutation,
    usePostInvoiceMutation,
    useCheckUsernameQuery,
    usePostPaymentMutation,
    useLazyGetWalletBalanceQuery,
    useGetTransactionsMutation
} = walletApi;
