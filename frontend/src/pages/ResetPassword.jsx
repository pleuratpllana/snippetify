import AuthForm from "../components/Auth/AuthForm";
import PageWrapper from "./PageWrapper";

const ResetPassword = ({ code }) => (
  <PageWrapper>
    <AuthForm mode="reset" code={code} />
  </PageWrapper>
);

export default ResetPassword;
