import { Navigate, Route, Routes } from "react-router-dom"
import { BellRing, ChartNoAxesCombined, Settings, Sparkles, Wrench } from "lucide-react"

import DashboardPage from "@/pages/dashboard"
import SectionPlaceholder from "@/pages/section-placeholder"
import VehicleDetailPage from "@/pages/vehicle-detail"
import VehiclesPage from "@/pages/vehicles"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vehicles/:id" element={<VehicleDetailPage />} />

      <Route
        path="/maintenance"
        element={
          <SectionPlaceholder
            title="Maintenance"
            description="Service scheduling and workshop capacity"
            icon={Wrench}
          />
        }
      />
      <Route
        path="/alerts"
        element={
          <SectionPlaceholder title="Alerts" description="Fleet-wide alert inbox and routing rules" icon={BellRing} />
        }
      />
      <Route
        path="/analytics"
        element={
          <SectionPlaceholder
            title="Analytics"
            description="Cost, downtime and reliability reporting"
            icon={ChartNoAxesCombined}
          />
        }
      />
      <Route
        path="/copilot"
        element={
          <SectionPlaceholder
            title="AI Copilot"
            description="Ask questions about fleet health and maintenance"
            icon={Sparkles}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <SectionPlaceholder title="Settings" description="Depots, thresholds and team access" icon={Settings} />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
