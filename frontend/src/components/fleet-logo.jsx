import { cn } from "@/lib/utils";
function FleetLogo({ className }) {
  return <div className={cn("flex items-center gap-2.5", className)}>
      <div
    aria-hidden="true"
    className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg"
  >
        <svg viewBox="0 0 24 24" fill="none" className="size-[18px]">
          <path
    d="M3 16.5V9.5a1 1 0 0 1 1-1h8.5a1 1 0 0 1 1 1v7"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
  />
          <path
    d="M13.5 11.5H17l3 3v2"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
          <path d="M3 16.5h1.6M9.4 16.5h5.1M19.4 16.5H21" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="7" cy="16.8" r="1.9" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="17.2" cy="16.8" r="1.9" stroke="currentColor" strokeWidth="1.9" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">FleetIQ</span>
        <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">Fleet Intelligence</span>
      </div>
    </div>;
}
export {
  FleetLogo
};
