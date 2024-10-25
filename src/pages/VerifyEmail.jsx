import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const { signupData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If signup data is not available, redirect to signup page
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      <div className="max-w-[500px] p-4 lg:p-8">
        <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
          Verify Email
        </h1>
        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
          An email verification link has been sent to your email address. Please check your inbox and click on the link to verify your email.
        </p>
        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
          If you don't see the email in your inbox, please check your spam folder.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
