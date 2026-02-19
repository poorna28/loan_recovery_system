const calculateInterest = (balance, annualRate) => {
  const monthlyRate = annualRate / 12 / 100;
  return balance * monthlyRate;
};

const clampMoney = (value) => Number(value.toFixed(2));

const processPayment = ({ balance, annualRate, paymentAmount }) => {
  const interest = calculateInterest(balance, annualRate);

  /* Case 1 — Payment does not even cover interest */
  if (paymentAmount <= interest) {
    const unpaidInterest = interest - paymentAmount;

    return {
      interestComponent: clampMoney(paymentAmount),
      principalComponent: 0,
      remainingBalance: clampMoney(balance + unpaidInterest)
    };
  }

  /* Case 2 — Normal payment */
  const principal = paymentAmount - interest;

  /* Prevent over-reduction */
  const safePrincipal = principal > balance ? balance : principal;

  const newBalance = balance - safePrincipal;

  return {
    interestComponent: clampMoney(interest),
    principalComponent: clampMoney(safePrincipal),
    remainingBalance: clampMoney(newBalance)
  };
};

module.exports = { processPayment };
