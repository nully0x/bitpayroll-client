import AuthStatus from '../components/AuthStatus'

const Verification = () => {
  return (
    <AuthStatus
      isError={false}
      text="Your account has been created. Please confirm your email to continue, then Login"
      link='/login'
      linkText='Go to Login'
    />
  )
}

export default Verification