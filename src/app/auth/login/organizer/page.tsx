import AuthLogin from "@/components/ui/AuthLogin";

function page() {
  return (
    <div>
      <div className="text-white mb-7">
        <h1 className="md:text-3xl text-xl text-center text-white font-[700] ">
          Welcome!{" "}
        </h1>
        <p className="md:text-xl mt-3 w-[98%] text-center">
          Sign up to create and manage hackathons, connect with participants,
          and build amazing projects.
        </p>
      </div>
      <AuthLogin type="organizers" />
    </div>
  );
}

export default page;
