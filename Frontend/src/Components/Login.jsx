import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";
import { useEffect, useRef } from "react";
import {toast} from 'react-hot-toast'
import PasswordField from "./PasswordField";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const redirectedRef = useRef(false);
  //get state from auth store
  const { login, currentUser, loading, error, isAuthenticated } = useAuth((state) => state);
  //on user login
  const onUserLogin = (userCredObj) => {
    //call login() of auth store
    login(userCredObj);
  };

  useEffect(() => {
    //navigation logic
    if (isAuthenticated === true && currentUser && !redirectedRef.current) {
      redirectedRef.current = true;
      toast.success("Login success", { duration: 2000, id: "login-success" });
      navigate("/");
    }
  }, [isAuthenticated, currentUser, navigate]);

  //deal with loading
  if (loading) {
    return <p className={loadingClass}>Loading....</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Sign In</h2>

        {/* API error */}
        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",

                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <PasswordField
              label="Password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              rules={{
                required: "Password is required",
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              }}
            />
          </div>

          {/* Forgot password */}
          <div className="text-right -mt-2 mb-4">
            <button
              type="button"
              onClick={() => toast.error("Password reset is not configured yet. Contact support.")}
              className={`${linkClass} text-xs`}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;