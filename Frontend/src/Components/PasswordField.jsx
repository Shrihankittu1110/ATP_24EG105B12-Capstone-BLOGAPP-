import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { errorClass, inputClass, labelClass } from "../styles/common";

function PasswordField({
  label = "Password",
  placeholder = "Enter your password",
  error,
  register,
  name = "password",
  rules,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          className={`${inputClass} pr-12`}
          {...register(name, rules)}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#64748b] transition hover:bg-slate-100 hover:text-[#0f172a]"
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {isVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>

      {error && <p className={errorClass}>{error.message}</p>}
    </div>
  );
}

export default PasswordField;