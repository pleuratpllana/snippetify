import { Link } from "react-router-dom";

const AuthFooterText = ({ question, linkText, linkTo }) => (
  <p className="text-sm mt- text-center">
    {question} <Link to={linkTo}>{linkText}</Link>
  </p>
);

export default AuthFooterText;
