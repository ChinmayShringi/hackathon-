import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AlphaHeader() {
  return (
    <header className="w-full bg-bg-primary border-b border-border-primary">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/alpha">
          <div className="text-xl font-bold text-white">Delula</div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/alpha/credits">
            <Button variant="ghost" className="text-white hover:text-accent-blue">
              Credits
            </Button>
          </Link>
          <Link href="/alpha/account">
            <Button variant="ghost" className="text-white hover:text-accent-blue">
              Account
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
