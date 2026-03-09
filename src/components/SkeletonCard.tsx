export function SkeletonCard() {
  return (
    <div className="w-full aspect-[2/3] rounded-xl bg-slate-800 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50" />
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <div className="h-4 bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-700 rounded w-1/2" />
      </div>
    </div>
  );
}
