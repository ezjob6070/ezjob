
// Fix arithmetic operation errors on lines 102-103
// Ensure we're working with numbers instead of potential undefined/null values
// Replace the problematic section with:

const totalExpenses = jobSourceFinances.reduce((sum, source) => {
  const expenseValue = typeof source.expenses === 'number' ? source.expenses : 0;
  return sum + expenseValue;
}, 0);

const totalCompanyProfit = jobSourceFinances.reduce((sum, source) => {
  const profitValue = typeof source.companyProfit === 'number' ? source.companyProfit : 0;
  return sum + profitValue;
}, 0);
