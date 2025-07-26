import SignUpForm from "@/components/ui/AuthSignin";

function page() {
  return (
    <div className="md:w-[1440px] h-full flex justify-center">
      <div className="">
        <div className="text-white">
          <h1 className="md:text-5xl text-2xl text-center text-white font-[700] ">
            Host Game-Changing Hackathons with Vortexis
          </h1>
          <p className="md:text-3xl mt-3 w-[98%] text-center px-2">
            Create, manage, and scale your hackathons — all from one intuitive
            dashboard.
          </p>
        </div>

        <div className="md:w-[814px] mx-auto mt-10">
          <SignUpForm type="organizers" />
        </div>
      </div>
    </div>
  );
}

export default page;
