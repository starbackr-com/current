import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletApi = createApi({
    reducerPath: "walletApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https:/getcurrent.io/",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.walletBearer;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["Balance", "Transaction"],
    endpoints: (builder) => ({
        postNewWallet: builder.mutation({
            query: ({ login, password, username }) => ({
                url: `v2/users`,
                method: "POST",
                body: {
                    login,
                    password,
                    username,
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
            query: () => `v2/balance`,
            providesTags: ["Balance"],
        }),
        postInvoice: builder.mutation({
            query: ({ amount, description }) => ({
                url: `v2/invoices`,
                method: "POST",
                body: {
                    amount,
                    description,
                    description_hash: description,
                },
            }),
            invalidatesTags: ["Balance", "Transaction"],
        }),
        checkUsername: builder.query({
            query: (username) => `.well-known/nostr.json?name=${username}`,
        }),
        postPayment: builder.mutation({
            query: ({ invoice, amount }) => ({
                url: "v2/payments/bolt11",
                method: "POST",
                body: {
                    invoice,
                    amount,
                },
            }),
            invalidatesTags: ["Balance"],
        }),
        getIncomingTransactions: builder.query({
            query: () => `v2/invoices/incoming`,
            providesTags: ["Transaction"],
        }),
        getOutgoingTransactions: builder.query({
            query: () => `v2/invoices/outgoing`,
            providesTags: ["Transaction"],
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
    useGetIncomingTransactionsQuery,
    useGetOutgoingTransactionsQuery,
} = walletApi;
