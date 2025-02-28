import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();
  //console.log({session});
    
  return (
    <div className="">
      <main>
        <h1 className="text-3xl font-bold underline">
          Home/Deals Page. (Feature Deals, Community Deals, and Trending Deals)
        </h1>
        {!session || !session.user ? (
          <div>
            <Button variant="outline">
              <Link href="/auth/signin" className="font-semibold">
                Sign In
              </Link>
            </Button>
            <Button variant="outline">
              <Link href="/auth/register" className="font-semibold">
                Sign Up
              </Link>
            </Button>
          </div>
        ) : (
          <div>
            <p>Welcome {session.user.username}</p>
            <Button variant="outline">
              <Link href="/api/auth/signout" className="font-semibold">
                Sign Out
              </Link>
            </Button>
          </div>
        )}        
      </main>
    </div>
  );
}
