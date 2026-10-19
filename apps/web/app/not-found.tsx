import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">This page isn&apos;t on the roadmap</h1>
      <Button asChild>
        <Link href="/">Back to the dashboard</Link>
      </Button>
    </div>
  );
}
