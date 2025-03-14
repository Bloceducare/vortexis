import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function Login() {
  const session = await getServerSession(options);
  console.log(session);
  const user = session?.user?.name;

  // {
  //   session ? (
  //     <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
  //   ) : (
  //     <Link href="/api/auth/signin">Login</Link>
  //   );
  // }

  return <div>{`You're welcome ${user}`}</div>;
}
