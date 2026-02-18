import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50">
      <Skeleton className="h-56 w-full bg-slate-700/50" />
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24 bg-slate-700/50" />
          <Skeleton className="h-4 w-20 bg-slate-700/50" />
        </div>
        <Skeleton className="h-6 w-full bg-slate-700/50" />
        <Skeleton className="h-4 w-full bg-slate-700/50" />
        <Skeleton className="h-4 w-3/4 bg-slate-700/50" />
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full bg-slate-700/50" />
            <Skeleton className="h-4 w-24 bg-slate-700/50" />
          </div>
          <Skeleton className="h-4 w-20 bg-slate-700/50" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-800/50 h-[500px] md:h-[600px]">
      <Skeleton className="absolute inset-0 bg-slate-700/30" />
      <div className="absolute inset-0 flex items-end p-6 md:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24 bg-slate-700/50" />
            <Skeleton className="h-6 w-20 bg-slate-700/50" />
          </div>
          <Skeleton className="h-12 w-full bg-slate-700/50" />
          <Skeleton className="h-6 w-full bg-slate-700/50" />
          <Skeleton className="h-6 w-3/4 bg-slate-700/50" />
          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-10 w-10 rounded-full bg-slate-700/50" />
            <Skeleton className="h-8 w-40 bg-slate-700/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full bg-slate-700/50" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-700/50" />
          <Skeleton className="h-4 w-32 bg-slate-700/50" />
        </div>
      </div>
      <Skeleton className="h-24 w-full bg-slate-700/50" />
    </div>
  );
}
