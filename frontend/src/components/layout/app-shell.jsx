import * as React from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
function AppShell({ title, description, children }) {
  const [navOpen, setNavOpen] = React.useState(false);
  return <div className="bg-background flex min-h-svh">
      <AppSidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title={title} description={description} onMenuClick={() => setNavOpen(true)} />
        <main className="flex-1 px-4 py-6 lg:px-6">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>;
}
export {
  AppShell
};
