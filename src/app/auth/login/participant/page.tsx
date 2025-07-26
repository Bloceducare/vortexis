import AuthLogin from "@/components/ui/AuthLogin";

function page() {
  return (
    <div>
      <div className="text-white mb-7">
        <h1 className="text-3xl text-center text-white font-[700] ">
          Welcome Back!{" "}
        </h1>
        <p className="text-xl mt-3 w-[98%] text-center">
          Log in to find new hackathons, connect with your team, and continue
          building amazing projects.
        </p>
      </div>
      <AuthLogin type="participants" />
    </div>
  );
}

export default page;
