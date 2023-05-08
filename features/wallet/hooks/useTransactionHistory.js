import {
  useGetIncomingTransactionsQuery,
  useGetOutgoingTransactionsQuery,
} from '../../../services/walletApi';

const useTransactionHistory = () => {
  const { data: incoming = [], isLoading: inLoading } = useGetIncomingTransactionsQuery() || [];
  const { data: outgoing = [], isLoading: outLoading } = useGetOutgoingTransactionsQuery() || [];

  if (!inLoading && !outLoading) {
    const incomingTx = incoming.map((tx) => ({ ...tx, type: 'in' }));
    const outgoingTx = outgoing.map((tx) => ({ ...tx, type: 'out' }));
    const merged = [...incomingTx, ...outgoingTx].sort(
      (a, b) => b.createdat - a.createdat,
    );
    return merged;
  }
  return undefined;
};

export default useTransactionHistory;
