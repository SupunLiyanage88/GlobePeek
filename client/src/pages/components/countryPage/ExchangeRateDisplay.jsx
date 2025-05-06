import { FiDollarSign } from "react-icons/fi";

const ExchangeRateDisplay = ({ base, rate, currencyName }) => (
  <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2 backdrop-blur-sm">
    <span className="font-bold">1 {base}</span>
    <span className="text-sm opacity-80">≈</span>
    <span className="font-bold">
      {rate.toFixed(4)} {currencyName}
    </span>
  </div>
);

export default ExchangeRateDisplay;