/* eslint-disable react/prop-types */
import { currencyFormatter } from '../../../utils';
import KeyValueText from '../../atoms/KeyValueText/KeyValueText';

const Charges = ({ totalBill, charges = {}, numberOfLines = 1 }) => {
  console.log('***  Charges  ***');

  const getLineCharges = (number = 1) => {
    return currencyFormatter(
      (totalBill -
        charges.devices -
        charges.additional +
        charges.kickbacks +
        charges.credits) /
        number
    );
  };

  return (
    <div className="calculator basis-1/4">
      <h4 className="font-bold py-2.5">Charges</h4>
      <KeyValueText
        keyValue={['Device charges', currencyFormatter(charges.devices)]}
      />
      <KeyValueText
        keyValue={['Additoanl charges', currencyFormatter(charges.additional)]}
      />

      <h4 className="font-bold py-2.5">Credits</h4>
      <KeyValueText
        keyValue={['Kickbacks', currencyFormatter(charges.kickbacks)]}
      />
      <KeyValueText
        keyValue={['Credits', currencyFormatter(charges.credits)]}
      />
      <br></br>
      <h4 className="font-bold py-2.5">Total</h4>
      <KeyValueText keyValue={['Total line charges', getLineCharges()]} />
      <KeyValueText
        keyValue={['Cost per line', getLineCharges(numberOfLines)]}
        highlight="true"
      />
    </div>
  );
};

export default Charges;
