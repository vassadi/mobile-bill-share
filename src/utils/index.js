export const formatter = (amount) => {
  const options = { style: 'currency', currency: 'USD' };
  const numberFormat2 = new Intl.NumberFormat('en-US', options);

  return numberFormat2.format(amount);
};

export const monthMapper = (monthYear) => {
  if (monthYear) {
    const mapper = {
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'Apr',
      5: 'May',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec',
    };
    const [year, month] = monthYear.split('-');

    return month ? `${mapper[Number(month)]} ${year}` : year;
  }
  return 'monthYear';
};
