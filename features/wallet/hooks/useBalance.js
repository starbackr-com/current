import { useGetWalletBalanceQuery } from '../../../services/walletApi';

const useBalance = () => {
  const { data, error } = useGetWalletBalanceQuery();
  if (!error) {
    return data.balance;
  }
  return undefined;
};

export default useBalance;
