import AuthLayout from "../layouts/Auth";
import AuthForm from "../components/Auth/AuthForm";
import PageWrapper from "./PageWrapper";

const LoginPage = () => (
  <AuthLayout title="Welcome Back" subtitle="Login to continue">
    <PageWrapper>
      <AuthForm mode="login" />
    </PageWrapper>
  </AuthLayout>
);

export default LoginPage;
