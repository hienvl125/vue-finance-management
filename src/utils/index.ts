export const stringToCurrencyFormat = (amount: string): string => {
  let value = amount.replace(/[^0-9.]/g, '');
  let parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  amount = parts.join('.');
  if (parts.length > 1 && parts[1].length > 2) {
    amount = `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  return amount
}

export const stringToNumeric = (amount: string): number => {
  // Remove commas from the input value
  const numericValue = parseFloat(amount.replace(/,/g, ''));

  // Check if the parsed value is a valid number
  if (isNaN(numericValue)) {
    // Return NaN if the input is not a valid number
    return NaN;
  } else {
    // Round the numeric value to 2 decimal places
    return Math.round(numericValue * 100) / 100;
  }
};
