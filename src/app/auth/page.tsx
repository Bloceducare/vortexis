import LoginForm from "@/components/ui/AuthSignin";

function page() {
  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Sign in to your account</p>

      <LoginForm type="participants" />
    </div>
  );
}

export default page;
