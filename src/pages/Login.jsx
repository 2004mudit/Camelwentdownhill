import LoginForm from "../components/core/Auth/LoginForm"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image="login"
      formType="login"
    >
      <LoginForm />
    </Template>
  )
}

export default Login
