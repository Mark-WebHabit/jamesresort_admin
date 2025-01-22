import PropTypes from "prop-types";

const RevenueHeader = ({ text }) => {
  return (
    <div className="bg-[#ffd699] flex-1 py-4 text-center text-xl font-bold">
      {text}
    </div>
  );
};

RevenueHeader.propTypes = {
  text: PropTypes.string,
};

export default RevenueHeader;
