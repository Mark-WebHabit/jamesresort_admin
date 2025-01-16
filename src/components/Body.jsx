import PropTypes from "prop-types";

function Body({ children }) {
  return (
    <main className="w-screen h-screen bg-[url('/images/resort_bg.jpeg')] flex flex-col bg-center relative">
      {children}
    </main>
  );
}

Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Body;
