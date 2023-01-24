import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users: [],
    relayReady: false,
};

export const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const newMessage = action.payload.event;
            const exists = state.messages.find(
                (message) => message.id === newMessage.id
            );
            if (exists) {
                return;
            }

            let updatedArray = [...state.messages, action.payload.event];
            updatedArray.sort((a, b) => b.created_at - a.created_at);
            state.messages = updatedArray;
        },
        addUser: (state, action) => {
            const newUser = action.payload.user
            const updatedUsers = [...state.users, newUser].reduce(
                (a, user) => {
                    const existingUser = a.find(
                        (u) => u.pubkey === user.pubkey
                    );
                    if (existingUser) {
                        if (existingUser.created_at < user.created_at) {
                            return a.map((u) =>
                                u.pubkey === user.pubkey ? user : u
                            );
                        } else {
                            return a;
                        }
                    } else {
                        return [...a, user];
                    }
                }, []
            );
            state.users = updatedUsers
        },
    },
});

export const { addMessage, addUser } = messageSlice.actions;

export default messageSlice.reducer;
