import AuthForm from "../components/Auth/AuthForm";
import PageWrapper from "./PageWrapper";

const LoginPage = () => (
  <PageWrapper>
    <AuthForm mode="login" />
  </PageWrapper>
);

export default LoginPage;
