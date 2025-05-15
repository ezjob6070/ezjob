
// Fix for the office expense categories - adding the required properties amount and percentage
// Assuming this is line 65 where the error occurs:
{
  id: category.id,
  name: category.name,
  icon: category.icon,
  color: category.color,
  budget: category.budget || 0,
  currentSpend: category.currentSpend || 0,
  amount: category.currentSpend || 0, // Add this line
  percentage: category.budget ? (category.currentSpend || 0) / category.budget * 100 : 0 // Add this line
}
