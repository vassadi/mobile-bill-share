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

const padToString = (num) => {
  return String('0' + num).slice(-2);
};

export const monthYearSortComparator = (a, b) => {
  const [ay, am] = a.split('-');
  const [by, bm] = b.split('-');
  const aa = ay + padToString(am);
  const bb = by + padToString(bm);
  return aa - bb;
};

export const phoneFormatter = (value) => {
  return value
    ? value.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    : '';
};
