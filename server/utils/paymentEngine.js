const calculateInterest = (balance, annualRate) => {
  const r = annualRate / 12 / 100;
  return balance * r;
};

const processPayment = ({ balance, annualRate, paymentAmount }) => {
  const interest = calculateInterest(balance, annualRate);
  const principal = paymentAmount - interest;

  const safePrincipal = principal < 0 ? 0 : principal;
  const newBalance = balance - safePrincipal;

  return {
    interestComponent: Number(interest.toFixed(2)),
    principalComponent: Number(safePrincipal.toFixed(2)),
    remainingBalance: Number(newBalance.toFixed(2))
  };
};

module.exports = { processPayment };
