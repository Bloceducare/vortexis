import { signInGoogleAction } from "@/lib/actions";
import Divider from "./Divider";
import Button from "./AuthButton";
import Link from "next/link";

type AuthFormType = "organizers" | "participants";
interface SignUpFormProps {
  type: AuthFormType;
  // fields: FormField[];
}

function AuthLogin({ type }: SignUpFormProps) {
  return (
    <div className="shadow-md bg-white w-[814px] h-[633px] rounded-[24px] p-2">
      {/* <div>
        <h1 className="text-2xganil text-center py-4 text-[rgb(46,11,244)] font-[700] ">
          {type === "organizers" ? "Organizer Login" : "Participant Login"}
        </h1>
      </div> */}
      <div className="w-[798px] h-[483px] mt-[75px] gap-[24px]">
        <form className="flex flex-col pt-5 text-[#2F3036] px-4">
          <label htmlFor="email" className="font-medium block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="border border-gray-300 p-2 rounded-sm mb-8"
          />

          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="input your password"
            className="border border-gray-300 p-2 rounded-sm mb-5"
          />

          <span className="flex justify-between mb-5">
            <span>
              <input type="checkbox" />{" "}
              <label className="ml-2">Remember me</label>
            </span>
            <span className="text-[#2E0BF4]"> Forgotten Password?</span>
          </span>

          <button className="bg-[#2E0BF4] w-[690px] h-[45px] text-white py-2 rounded-[3px]">
            Log In to {type === "organizers" ? "Organization" : "Participation"}{" "}
            Dashboard
          </button>
        </form>

        <div className="w-[655.0309448242188px] h-[27px] mx-auto">
          <Divider>or</Divider>
        </div>
        <Button
          onClick={signInGoogleAction}
          type="secondary"
          className="relative flex w-[50%] mx-auto items-center justify-center"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            className="absolute left-3 h-5 w-5"
            alt="google logo"
            height="24"
            width="24"
          />
          Sign in with Google
        </Button>

        <p className="text-center font-[600] mt-3 text-[#2F3036]">
          {type === "organizers"
            ? "Don't have an organizer account?"
            : "Don't have  a participant account?"}
          <Link className="underline pl-1" href="/login">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;
