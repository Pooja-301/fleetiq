import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
function SectionPlaceholder({ title, description, icon: Icon }) {
  return <AppShell title={title} description={description}>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
          <span className="bg-secondary text-muted-foreground flex size-11 items-center justify-center rounded-xl">
            <Icon className="size-5" />
          </span>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
            This section is part of the FleetIQ design system but has not been built out yet. The Dashboard and
            Vehicles views show the full visual language.
          </p>
          <Button variant="outline" size="sm" asChild className="mt-2">
            <Link to="/">
              <ArrowLeft />
              Back to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AppShell>;
}
export {
  SectionPlaceholder as default
};
