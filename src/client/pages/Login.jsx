import { useState } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const { success, message } = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setErrorMessage(message);
    }
  };

  const renderInputField = (id, label, value, setValue, type = "text") => (
    <div className="relative mb-4">
      <input
        type={type}
        id={id}
        className="peer appearance-none border-b-2 border-red-200 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500 placeholder-transparent"
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-gray-500 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );

  return (
    <Layout>
      <div className="flex h-screen w-full">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex flex-col justify-center items-center p-10">
          <img
            src="https://via.placeholder.com/300"
            alt="Placeholder"
            className="mb-6 w-48 h-48 object-cover rounded-full"
          />
          <p className="text-lg font-semibold mb-4">
            "Your journey starts here."
          </p>
          <div className="flex flex-col space-y-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
              Login with Facebook
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
              Login with Google
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
              )}
              {renderInputField("email", "Email", email, setEmail, "email")}
              {renderInputField(
                "password",
                "Password",
                password,
                setPassword,
                "password"
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="underline hover:text-green-500">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
