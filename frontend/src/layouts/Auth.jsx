import FormHeader from "../components/Auth/FormHeader";

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    <div className="bg-[var(--color-bg)] w-full flex flex-col justify-center px-4 md:px-6 lg:px-8 xl:px-40 py-10">
      {title && <FormHeader title={title} description={subtitle} />}
      {children}
    </div>
    <div className="hidden md:flex my-14 mr-14 p-20 rounded-xl bg-[var(--color-superlightbg)] flex-col justify-center items-center">
      <h3 className="text-center">Welcome to Snippetify</h3>
    </div>
  </div>
);

export default AuthLayout;
