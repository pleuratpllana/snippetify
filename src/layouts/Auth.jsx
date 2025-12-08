// src/layouts/AuthLayout.jsx
import FormHeader from "../components/Auth/FormHeader";

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    {/* LEFT COLUMN */}
    <div className="bg-white w-full flex flex-col justify-center px-6 sm:px-12 md:px-10 lg:px-20 xl:px-40 py-10">
      <FormHeader title={title} description={subtitle} />
      {children}
    </div>

    {/* RIGHT COLUMN */}
    <div className="hidden md:flex my-14 mr-14 p-20 rounded-xl bg-gray-100 flex-col justify-center items-center">
      <h3 className="text-center">Welcome to Snippetify</h3>
    </div>
  </div>
);

export default AuthLayout;
