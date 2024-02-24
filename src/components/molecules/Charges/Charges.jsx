/* eslint-disable react/prop-types */
import { formatter } from '../../../utils';
import KeyValueText from '../../atoms/KeyValueText/KeyValueText';

const Charges = ({ totalBill, charges = {}, numberOfLines = 7 }) => {
  console.log('***  Charges  ***', charges);
  const getLineCharges = (number = 1) => {
    return formatter(
      (totalBill - charges.devices - charges.additional + charges.kickbacks) /
        number
    );
  };

  return (
    <div className="calculator">
      <h4>Charges</h4>
      <KeyValueText keyValue={['Device charges', formatter(charges.devices)]} />
      <KeyValueText
        keyValue={['Additoanl charges', formatter(charges.additional)]}
      />

      <h4>Credits</h4>
      <KeyValueText keyValue={['Kickbacks', formatter(charges.kickbacks)]} />
      <KeyValueText keyValue={['Credits', formatter(charges.credits)]} />
      <br></br>
      <h4>Total</h4>
      <KeyValueText keyValue={['Total line changes', getLineCharges()]} />
      <KeyValueText
        keyValue={['Cost per line', getLineCharges(numberOfLines)]}
        highlight
      />
    </div>
  );
};

export default Charges;
