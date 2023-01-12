import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletApi = createApi({
    reducerPath: "walletApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://starbackr.me/",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.walletBearer;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
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
        }),
        checkUsername: builder.query({
            query: (username) => `.well-known/nostr.json?name=${username}`
        })
    }),
});

export const {
    usePostNewWalletMutation,
    useGetWalletBalanceQuery,
    usePostLoginMutation,
    usePostInvoiceMutation,
    useCheckUsernameQuery
} = walletApi;
