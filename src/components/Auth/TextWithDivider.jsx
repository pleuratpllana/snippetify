const TextWithDivider = ({ text }) => (
  <div className="flex items-center my-4">
    <hr className="flex-grow border-gray-300" />
    <span className="mx-2 text-gray-500 text-sm">{text}</span>
    <hr className="flex-grow border-gray-300" />
  </div>
);

export default TextWithDivider;
