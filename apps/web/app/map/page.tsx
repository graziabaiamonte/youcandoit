import { LearningMap } from "@/components/learning-map";

export default function MapPage() {
  return (
    <div data-fullbleed className="flex h-[calc(100svh-3rem)] flex-col">
      <header className="border-b px-4 py-4 md:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">Learning map</h1>
        <p className="text-muted-foreground">
          Your journey, track by track. Each pill is a module — click it to jump in. Drag to pan, scroll to zoom.
        </p>
      </header>
      <LearningMap />
    </div>
  );
}
