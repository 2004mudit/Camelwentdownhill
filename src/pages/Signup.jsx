import SignupForm from "../components/core/Auth/SignupForm"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image="signup"
      formType="signup"
    >
      <SignupForm />
    </Template>
  )
}

export default Signup