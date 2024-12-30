import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { overRideStyle } from "../../utils/spinnerProperty";
import { seller_register } from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import { messageClear } from "../../store/Reducers/authReducer";
import { validateUserDetails } from "../../utils/validation";

const Register = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { loader, successMessage, errorMessage } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handling the input

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  // handling the submission of the form

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateUserDetails(
      state.username,
      state.password,
      state.email
    );
    if (error) {
      toast.error(error);
      return;
    }
    dispatch(seller_register(state));
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  return (
    <div className="min-w-screen min-h-screen bg-[#719671] flex justify-center items-center">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-md">
        <div className="p-6 shadow-xl">
          <h1 className="text-xl font-bold text-gray-800">
            Welcome to EasyShop
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Please Register Your Account
          </p>
          {/* form*/}
          <form onSubmit={handleSubmit}>
            {/* username */}
            <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={state.username}
                onChange={inputHandle}
                placeholder="Username"
                required
                className="border-2 rounded-md p-2 focus:outline-none focus:border-blue-500 "
              />
            </div>
            {/* email */}

            <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={state.email}
                onChange={inputHandle}
                placeholder="Email"
                required
                className="border-2 rounded-md p-2 focus:outline-none focus:border-blue-500 required:"
              />
            </div>
            {/* password */}
            <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={state.password}
                onChange={inputHandle}
                name="password"
                placeholder="Password"
                required
                className="border-2 rounded-md p-2 focus:outline-none focus:border-blue-500 required:"
              />
            </div>
            {/* checkBox */}
            <div className="flex items-center w-full gap-3 mb-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 overflow-hidden"
                name="checkbox"
                required
              />
              <label htmlFor="checkbox">
                I agree to privacy policy & terms
              </label>
            </div>
            {/* signup button */}
            <div className="flex justify-center mb-3">
              <button
                disabled={loader}
                className="bg-green-600 w-full text-white px-3  py-2 rounded-lg hover:bg-green-700 "
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overRideStyle} />
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
            {/* already have account */}
            <div className="flex justify-center gap-2 mb-3 text-[.75em]">
              <span>Already have Account?</span>{" "}
              <Link to="/login" className="font-semibold hover:text-blue-600">
                Sign In
              </Link>
            </div>
            {/* or */}
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="w-[45%] h-[1px] bg-slate-500"></div>
              <div className="w-[10%] justify-center items-center">
                <span className="pb">Or</span>
              </div>
              <div className="w-[45%] h-[1px] bg-slate-500"></div>
            </div>
            {/* google sign Up */}
            <div className="flex justify-center">
              <button className="bg-red-600 text-white px-3  py-2 rounded-lg hover:bg-red-700 w-full flex justify-center items-center">
                <span className="pr-3">
                  <FaGoogle />
                </span>
                <span>Google SignUp</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
