import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import OAuthButton from "./Auth0Button";
import TextWithDivider from "./TextWithDivider";
import InputGroup from "../UI/InputGroup";
import AuthFooterText from "./AuthFooter";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion } from "framer-motion";

const formVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const AuthForm = ({ mode, code }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (mode === "login") {
        const response = await api.post("/api/auth/local", {
          identifier: data.identifier,
          password: data.password,
        });
        login(response.data.jwt, response.data.user, data.remember);
        navigate("/dashboard");
      } else if (mode === "register") {
        const response = await api.post("/api/auth/local/register", {
          username: data.username,
          email: data.email,
          password: data.password,
        });
        login(response.data.jwt, response.data.user, data.remember);
        navigate("/dashboard");
      } else if (mode === "forgot") {
        await api.post("/api/auth/forgot-password", { email: data.email });
        alert("Check your email for reset link!");
      } else if (mode === "reset") {
        await api.post("/api/auth/reset-password", {
          password: data.password,
          passwordConfirmation: data.confirmPassword,
          code: data.code || code,
        });
        alert("Password updated successfully!");
        navigate("/login");
      }
    } catch (err) {
      const errorData = err.response?.data;
      const message =
        errorData?.message ||
        errorData?.error?.message ||
        "Something went wrong, try again later";

      const field = errorData?.error?.field || "identifier";
      setError(field, { type: "manual", message });
    }
  };

  // OAuth handler
  // const handleOAuthRedirect = (provider) => {
  //   const callback = encodeURIComponent("http://localhost:5173/auth/callback");
  //   window.location.href = `http://localhost:1337/api/connect/${provider}?callback=${callback}`;
  // };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mt-4 space-y-4"
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {mode === "register" && (
        <>
          <div className="flex flex-col gap-0 items-center justify-center sm:gap-0 md:flex-col lg:flex-row lg:gap-3">
            <OAuthButton
              icon={<FcGoogle size={20} />}
              onClick={() => {
                // 1. Define the final client destination URL
                const finalClientCallback =
                  "http://localhost:5173/auth/callback";

                // 2. URL-encode the destination URL
                const encodedCallback = encodeURIComponent(finalClientCallback);

                // 3. Append the encoded callback to the Strapi initiation URL
                window.location.href = `http://localhost:1337/api/connect/google?callback=${encodedCallback}`;
              }}
            >
              Sign Up with Google
            </OAuthButton>

            {/* <OAuthButton
              icon={<FaGithub size={20} />}
              onClick={() => {
                const callback = encodeURIComponent(
                  "http://localhost:5173/auth/callback"
                );
                window.location.href = `http://localhost:1337/api/connect/github?callback=${callback}`;
              }}
            >
              Sign Up with GitHub
            </OAuthButton> */}
          </div>
          <TextWithDivider
            text="or continue with email"
            className="continueWith"
          />
        </>
      )}

      {(mode === "login" ||
        mode === "register" ||
        mode === "forgot" ||
        mode === "reset") && (
        <>
          {mode === "login" && (
            <InputGroup
              id="identifier"
              label="Email or Username"
              placeholder="Enter your email or username"
              {...register("identifier", {
                required: "This field is required",
                onChange: () => clearErrors("identifier"),
              })}
              error={errors.identifier?.message}
            />
          )}

          {mode === "register" && (
            <>
              <InputGroup
                id="username"
                label="Username"
                placeholder="Enter username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  onChange: () => clearErrors("username"),
                })}
                error={errors.username?.message}
              />
              <InputGroup
                id="email"
                label="Email"
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /.+@.+\..+/,
                    message: "Please enter a valid email",
                  },
                  onChange: () => clearErrors("email"),
                })}
                error={errors.email?.message}
              />
              <InputGroup
                id="password"
                label="Password"
                type="password"
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  onChange: () => clearErrors("password"),
                })}
                error={errors.password?.message}
              />
              <InputGroup
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="********"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                  onChange: () => clearErrors("confirmPassword"),
                })}
                error={errors.confirmPassword?.message}
              />
            </>
          )}

          {mode === "login" && (
            <InputGroup
              id="password"
              label="Password"
              type="password"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                onChange: () => clearErrors("password"),
              })}
              error={errors.password?.message}
            />
          )}
        </>
      )}

      {mode === "login" && (
        <div className="checkbox-wrapper">
          <input type="checkbox" id="remember" {...register("remember")} />
          <label htmlFor="remember">Remember Me</label>
        </div>
      )}

      <button type="submit" className="w-full mt-2">
        {mode === "login" && "Login"}
        {mode === "register" && "Register"}
        {mode === "forgot" && "Send Reset Link"}
        {mode === "reset" && "Update Password"}
      </button>

      {mode === "login" && (
        <AuthFooterText
          question="Forgot your password?"
          linkText="Reset it here"
          linkTo="/forgotpassword"
        />
      )}
      {mode === "register" && (
        <AuthFooterText
          question="Already have an account?"
          linkText="Login"
          linkTo="/login"
        />
      )}
    </motion.form>
  );
};

export default AuthForm;
