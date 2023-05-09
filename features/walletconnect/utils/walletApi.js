import { store } from '../../../store/store';

async function postNwc(payload) {
  const { walletBearer } = store.getState().auth;
  if (!walletBearer) {
    throw new Error('WalletBearer is undefined');
  }
  const response = await fetch(`${process.env.BASEURL}/v2/walletconnect`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${walletBearer}`,
    },
  });
  const data = await response.json();
  return data;
}
