import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionView } from "@/components/session-view";

export default function SessionPage({ params }: PageProps<"/session/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      {params.then(({ id }) => (
        <SessionView id={id} />
      ))}
    </Suspense>
  );
}
