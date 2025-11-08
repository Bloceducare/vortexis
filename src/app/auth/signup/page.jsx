import SignUpForm from "@/components/ui/AuthSignin";

function page() {
  return (
    <div className="md:w-[1440px] pt-20 flex justify-center">
      <div className="">
      <div className="text-white px-4 md:px-8 lg:px-12 max-w-5xl mx-auto text-center">
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
    Ready to Build Something Big?
  </h1>
  <p className="mt-4 text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed">
    Join the Vortexis community, participate in hackathons, form teams,
    and build great ideas from start to finish.
  </p>
</div>


        <div className="px-3 md:px-10 md:w-[814px] mx-auto mt-10">
          <SignUpForm type="participants" />
        </div>
      </div>
    </div>
  );
}

export default page;
