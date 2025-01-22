import PropTypes from "prop-types";

function RevenueContent({ text }) {
  return <div className="flex-1 py-4 bg-[#ffebcd] text-center">{text}</div>;
}

RevenueContent.propTypes = {
  text: PropTypes.string,
};

export default RevenueContent;
