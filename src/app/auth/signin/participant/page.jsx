import SignUpForm from "@/components/ui/AuthSignin";

function page() {
  return (
    <div className="md:w-[1440px] pt-20 flex justify-center">
      <div className="">
        <div className="text-white">
          <h1 className="md:text-5xl text-2xl text-center text-white font-[700] ">
            Ready to Build Something Big?
          </h1>
          <p className="md:text-3xl text-xl mt-3 text-center">
            Join the Vortexis community, participate in hackathons, form teams,
            and build great ideas from start to finish.
          </p>
        </div>

        <div className="w-[814px] mx-auto mt-10">
          <SignUpForm type="participants" />
        </div>
      </div>
    </div>
  );
}

export default page;
