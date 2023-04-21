/* eslint-disable operator-linebreak */
export const hexRegex = /^[0-9a-f]{64}$/i;

export const bech32Regex = /^(npub)[a-zA-HJ-NP-Z0-9]+$/i;

export const bech32Sk = /^(nsec)[a-zA-HJ-NP-Z0-9]+$/i;

export const twitterRegex = /^@?(\w){1,15}$/;

export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

export const httpRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

export const imageRegex =
  /(http(s?):)([\/|.|\w|\s|\-|_])*\.(?:jpg|gif|png|jpeg)/g;

export const bolt11Regex = /(lnbc\d+[munp][A-Za-z0-9]+)/i;

export const nip27Regex = /(nostr:[A-Za-z0-9]+)/i;

export const usernameRegex = /^[a-z0-9]{4,32}$/i;
