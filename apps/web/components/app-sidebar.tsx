"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  ChevronRightIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  LayoutDashboardIcon,
  MapIcon,
  NewspaperIcon,
  RocketIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StatsMini } from "@/components/stats-mini";
import { StarButton } from "@/components/star-button";
import { sessionProgress, trackColor, type SessionNode, type TrackNode } from "@/lib/api";
import { useArticles, useRoadmap } from "@/lib/hooks";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/map", label: "Learning map", icon: MapIcon },
  { href: "/news", label: "News & reading list", icon: NewspaperIcon },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 p-3">
        <Link href="/" className="flex items-center gap-2 px-1 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <RocketIcon className="size-4" aria-hidden />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">YouCanDoIt</span>
        </Link>
        <div className="group-data-[collapsible=icon]:hidden"><StatsMini /></div>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<NavSkeleton />}>
          <MainNav />
          <RoadmapNav />
        </Suspense>
        <DailyNews />
        <Favorites />
      </SidebarContent>
    </Sidebar>
  );
}

function NavSkeleton() {
  return (
    <SidebarGroup>
      {Array.from({ length: 8 }, (_, i) => (
        <SidebarMenuSkeleton key={i} showIcon />
      ))}
    </SidebarGroup>
  );
}

function MainNav() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {NAV.map(({ href, label, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton asChild isActive={pathname === href} tooltip={label} className="rounded-full">
              <Link href={href}>
                <Icon aria-hidden />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function StatusIcon({ session }: { session: SessionNode }) {
  const { done, total } = sessionProgress(session);
  if (done === total) return <CircleCheckIcon className="text-success!" aria-label="Completed" />;
  if (done > 0) return <CircleDashedIcon className="text-track!" aria-label="In progress" />;
  return <CircleIcon className="text-muted-foreground!" aria-label="Not started" />;
}

function trackPercent(track: TrackNode) {
  const subs = track.modules.flatMap((m) => m.sessions.flatMap((s) => s.subchapters));
  return subs.length ? Math.round((subs.filter((c) => c.done).length / subs.length) * 100) : 0;
}

function RoadmapNav() {
  const pathname = usePathname();
  const { data: tracks, error } = useRoadmap();
  const activeId = pathname.startsWith("/session/") ? pathname.split("/")[2] : null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Roadmap</SidebarGroupLabel>
      <SidebarGroupContent>
        {error && <p className="px-2 text-xs text-destructive">Could not load the roadmap.</p>}
        {!tracks && !error && <NavSkeleton />}
        <SidebarMenu aria-label="Roadmap">
          {tracks?.map((track) => (
            <Collapsible
              key={track.id}
              asChild
              defaultOpen={activeId?.startsWith(`${track.id}.`)}
              className="group/track"
            >
              <SidebarMenuItem style={{ "--track": trackColor(track.id) } as React.CSSProperties}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="h-auto py-1.5" tooltip={`${track.id}. ${track.title}`}>
                    <span className="size-2.5 shrink-0 rounded-full bg-track" aria-hidden />
                    <span className="flex-1 truncate">
                      <span className="text-muted-foreground">{track.id}.</span> {track.title}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">{trackPercent(track)}%</span>
                    <ChevronRightIcon
                      className="transition-transform group-data-[state=open]/track:rotate-90"
                      aria-hidden
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {track.modules.map((module) => (
                    <div key={module.id} className="mt-1">
                      <p className="truncate px-6 pt-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                        {module.title}
                      </p>
                      <SidebarMenuSub>
                        {module.sessions.map((session) => (
                          <SidebarMenuSubItem key={session.id}>
                            <SidebarMenuSubButton asChild size="sm" isActive={session.id === activeId}>
                              <Link href={`/session/${session.id}`}>
                                <StatusIcon session={session} />
                                <span>{session.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </div>
                  ))}
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ArticleList({ favorites, limit, empty }: { favorites: boolean; limit: number; empty: string }) {
  const { data } = useArticles(favorites);
  if (!data) return <SidebarMenuSkeleton />;
  if (!data.length) return <p className="px-2 text-xs text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-1">
      {data.slice(0, limit).map((a) => (
        <li key={a.id} className="flex items-start gap-1 rounded-md px-2 py-1 hover:bg-sidebar-accent">
          <a href={a.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 text-xs leading-snug">
            <span className="line-clamp-2">{a.title}</span>
            <span className="text-[11px] text-muted-foreground">{a.source}</span>
          </a>
          <StarButton article={a} />
        </li>
      ))}
    </ul>
  );
}

function DailyNews() {
  return (
    <SidebarGroup data-testid="daily-news" className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel asChild>
        <Link href="/news">Daily news</Link>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <ArticleList favorites={false} limit={6} empty="News arrives every morning at 07:00." />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function Favorites() {
  return (
    <SidebarGroup data-testid="favorites" className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarGroupContent>
        <ArticleList favorites limit={20} empty="Star an article to keep it here." />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
