// import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login() {
  // const session = await getServerSession(options);
  // console.log(session);
  // const user = session?.user?.name;

  const session = null;
  const user = null;
  if (!session) {
    redirect("/auth/signup?callbackUrl=/auth/login");
  }
  return (
    <div>
      <p>
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )}
      </p>
      {`You're welcome ${user}`}
    </div>
  );
}
