import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8 text-muted-foreground max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">You might want to check out:</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link href="/">Home Page</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/trending-deals">Trending Deals</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/community-picks">Community Picks</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
