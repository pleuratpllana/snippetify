import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import OAuthButton from "./Auth0Button";
import TextWithDivider from "./TextWithDivider";
import InputGroup from "../UI/InputGroup";
import AuthFooterText from "./AuthFooter";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";

const formVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const getAuthErrorField = (mode) => {
  if (mode === "register" || mode === "forgot") return "email";
  if (mode === "reset") return "password";
  return "identifier";
};

const ensurePasswordRecoverySession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return;

  const code = new URLSearchParams(window.location.search).get("code");

  if (!code) {
    throw new Error(
      "Password reset session expired. Please request a new reset link."
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) throw error;

  window.history.replaceState({}, document.title, window.location.pathname);
};

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { signUp, signInWithPassword } = useAuth();
  const [emailPending, setEmailPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (mode === "login") {
        await signInWithPassword({
          email: data.identifier,
          password: data.password,
        });
        navigate("/dashboard");
      } else if (mode === "register") {
        await signUp({
          username: data.username,
          email: data.email,
          password: data.password,
        });
        setEmailPending(true);
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          data.email,
          {
            redirectTo: `${window.location.origin}/resetpassword`,
          }
        );
        if (error) throw error;
        alert("Check your email for reset link!");
      } else if (mode === "reset") {
        await ensurePasswordRecoverySession();
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        });
        if (error) throw error;
        alert("Password updated successfully!");
        navigate("/login");
      }
    } catch (err) {
      const message = err.message || "Something went wrong, try again later";
      const field = getAuthErrorField(mode);
      setError(field, { type: "manual", message });
    } finally {
      setLoading(false);
    }
  };

  if (emailPending) {
    return (
      <div className="w-full mt-4 text-center">
        <p>Check your email to confirm your account!</p>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mt-4 space-y-4"
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* OAuth + divider for register */}
      {mode === "register" && (
        <>
          <div className="flex flex-col gap-2 items-center sm:flex-row lg:gap-3">
            <OAuthButton
              icon={<FcGoogle size={20} />}
              onClick={async () => {
                setLoading(true);
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });
                if (error) setError("email", { type: "manual", message: error.message });
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up with Google"}
            </OAuthButton>

            <OAuthButton
              icon={<FaGithub size={20} />}
              onClick={async () => {
                setLoading(true);
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "github",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });
                if (error) setError("email", { type: "manual", message: error.message });
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up with GitHub"}
            </OAuthButton>
          </div>
          <TextWithDivider text="or continue with email" />
        </>
      )}

      {/* Email / username inputs */}
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
      )}

      {mode === "forgot" && (
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
      )}

      {mode === "register" && (
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
      )}

      {/* Password / Confirm Password via Controller */}
      {(mode === "login" || mode === "register" || mode === "reset") && (
        <>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field, fieldState }) => (
              <InputGroup
                id="password"
                label="Password"
                type="password"
                placeholder="********"
                value={field.value || ""}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          {(mode === "register" || mode === "reset") && (
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
              render={({ field, fieldState }) => (
                <InputGroup
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="********"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          )}
        </>
      )}

      {/* Remember me for login */}
      {mode === "login" && (
        <div className="checkbox-wrapper flex items-center gap-2">
          <input type="checkbox" id="remember" {...register("remember")} />
          <label htmlFor="remember">Remember Me</label>
        </div>
      )}

      <button type="submit" className="w-full mt-2" disabled={loading}>
        {loading
          ? "Processing..."
          : mode === "login"
          ? "Login"
          : mode === "register"
          ? "Register"
          : mode === "forgot"
          ? "Send Reset Link"
          : "Update Password"}
      </button>

      {/* Footer links */}
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
