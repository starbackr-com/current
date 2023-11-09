import bolt11Decoder from 'light-bolt11-decoder';

type ParsedInvoice = {
  amountInMSats: number;
  amountInSats: number;
  paymentRequest: string;
  memo?: string;
};
export function parseInvoice(invoice: string): ParsedInvoice {
  const decodedInvoice = bolt11Decoder.decode(invoice);
  const parsedInvoice = {} as ParsedInvoice;
  parsedInvoice.paymentRequest = decodedInvoice.paymentReuest;
  for (let i = 0; i < decodedInvoice.sections.length; i++) {
    if (decodedInvoice.sections[i].name === 'amount') {
      parsedInvoice.amountInMSats = decodedInvoice.sections[i].value;
      parsedInvoice.amountInSats = Math.floor(
        decodedInvoice.sections[i].value / 1000,
      );
    }
    if (decodedInvoice.sections[i].name === 'description') {
      parsedInvoice.memo = decodedInvoice.sections[i].value;
    }
  }
  return parsedInvoice;
}
