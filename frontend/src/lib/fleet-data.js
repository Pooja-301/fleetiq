function comp(key, label, score, detail) {
  const status = score >= 85 ? "good" : score >= 70 ? "monitor" : score >= 50 ? "attention" : "critical";
  return { key, label, score, status, detail };
}
const vehicles = [
  {
    id: "FL-1042",
    name: "Volvo FH16 Tractor",
    type: "Heavy Truck",
    plate: "MH 12 QA 4410",
    depot: "Pune Central",
    driver: "Rakesh Nair",
    healthScore: 38,
    riskLevel: "high",
    riskProbability: 0.82,
    mileage: 486920,
    avgDailyKm: 412,
    lastService: "2026-05-02",
    nextMaintenance: "2026-08-19",
    nextMaintenanceIn: "Overdue by 5 days",
    inServiceSince: "2021-03-14",
    fuelEfficiency: 3.1,
    utilisation: 91,
    components: [
      comp("engine", "Engine", 34, "Coolant temperature trending 11\xB0C above depot baseline"),
      comp("brakes", "Brakes", 41, "Front axle pad thickness at 3.1 mm, below 4 mm threshold"),
      comp("tyres", "Tyres", 58, "Uneven wear on rear-left; rotation overdue"),
      comp("battery", "Battery", 72, "Cranking voltage dips to 11.4 V on cold starts")
    ],
    history: [
      {
        id: "SR-88213",
        date: "2026-05-02",
        type: "Scheduled Service B",
        workshop: "Pune Central Workshop",
        cost: 41800,
        odometer: 471400,
        status: "completed",
        notes: "Oil, filters, brake inspection. Engine temp flagged for follow-up."
      },
      {
        id: "SR-86004",
        date: "2026-02-11",
        type: "Cooling System Repair",
        workshop: "Nashik Partner Garage",
        cost: 68250,
        odometer: 448900,
        status: "completed",
        notes: "Radiator flush and thermostat replacement."
      },
      {
        id: "SR-83771",
        date: "2025-11-06",
        type: "Brake Overhaul",
        workshop: "Pune Central Workshop",
        cost: 52400,
        odometer: 421300,
        status: "completed",
        notes: "Rear pads and discs replaced."
      },
      {
        id: "SR-89550",
        date: "2026-08-19",
        type: "Scheduled Service C",
        workshop: "Pune Central Workshop",
        cost: 58e3,
        odometer: 486920,
        status: "overdue",
        notes: "Major inspection window missed. Vehicle still in active rotation."
      }
    ],
    alerts: [
      {
        id: "AL-4401",
        vehicleId: "FL-1042",
        vehicleName: "Volvo FH16 Tractor",
        title: "Engine overheating pattern detected",
        description: "Coolant temperature exceeded threshold on 6 of the last 9 long-haul runs.",
        severity: "critical",
        category: "component",
        raisedAt: "2026-08-24T06:12:00Z"
      },
      {
        id: "AL-4390",
        vehicleId: "FL-1042",
        vehicleName: "Volvo FH16 Tractor",
        title: "Service C overdue",
        description: "Major inspection was due 2026-08-19 and has not been booked.",
        severity: "critical",
        category: "overdue",
        raisedAt: "2026-08-20T09:00:00Z"
      },
      {
        id: "AL-4372",
        vehicleId: "FL-1042",
        vehicleName: "Volvo FH16 Tractor",
        title: "Brake pad wear below threshold",
        description: "Front axle pads measured 3.1 mm at last roadside check.",
        severity: "warning",
        category: "component",
        raisedAt: "2026-08-17T14:35:00Z"
      }
    ],
    explanation: {
      summary: "Elevated failure probability is driven mainly by a persistent engine thermal anomaly combined with an overdue major service. Brake wear compounds the risk because the vehicle remains on high-utilisation long-haul routes.",
      drivers: [
        { label: "Coolant temperature deviation", weight: 0.34, direction: "increases" },
        { label: "Overdue Service C interval", weight: 0.24, direction: "increases" },
        { label: "Front brake pad thickness", weight: 0.18, direction: "increases" },
        { label: "High route utilisation (91%)", weight: 0.13, direction: "increases" },
        { label: "Recent cooling system repair", weight: 0.07, direction: "decreases" }
      ],
      confidence: 0.91,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Remove from rotation and book immediate workshop inspection",
      window: "Within 24 hours",
      priority: "immediate",
      estimatedCost: 96500,
      estimatedDowntime: "2\u20133 days",
      rationale: "Thermal anomaly plus overdue major service places this unit at the top of the fleet risk ranking. Deferring further increases the likelihood of an on-road breakdown.",
      steps: [
        "Pull FL-1042 from the Mumbai\u2013Nagpur long-haul assignment",
        "Run full cooling system pressure test and replace front brake pads",
        "Complete the deferred Service C inspection in the same bay visit",
        "Rotate rear tyres and re-baseline telemetry before returning to service"
      ]
    }
  },
  {
    id: "FL-0871",
    name: "Tata Prima 3718",
    type: "Heavy Truck",
    plate: "GJ 05 KL 7712",
    depot: "Ahmedabad North",
    driver: "Imran Shaikh",
    healthScore: 44,
    riskLevel: "high",
    riskProbability: 0.74,
    mileage: 392140,
    avgDailyKm: 355,
    lastService: "2026-06-18",
    nextMaintenance: "2026-08-28",
    nextMaintenanceIn: "In 4 days",
    inServiceSince: "2021-09-02",
    fuelEfficiency: 3.4,
    utilisation: 87,
    components: [
      comp("engine", "Engine", 61, "Injector response variance on cylinders 3 and 5"),
      comp("brakes", "Brakes", 39, "Air pressure build-up time 40% above spec"),
      comp("tyres", "Tyres", 66, "Two tyres near minimum tread depth"),
      comp("battery", "Battery", 81, "Within normal range")
    ],
    history: [
      {
        id: "SR-87902",
        date: "2026-06-18",
        type: "Scheduled Service A",
        workshop: "Ahmedabad North Workshop",
        cost: 24600,
        odometer: 381500,
        status: "completed",
        notes: "Routine service. Air brake timing noted as borderline."
      },
      {
        id: "SR-85110",
        date: "2026-01-24",
        type: "Injector Cleaning",
        workshop: "Ahmedabad North Workshop",
        cost: 18900,
        odometer: 352800,
        status: "completed",
        notes: "Cylinders 3 and 5 flagged for re-check."
      },
      {
        id: "SR-89601",
        date: "2026-08-28",
        type: "Air Brake Service",
        workshop: "Ahmedabad North Workshop",
        cost: 32e3,
        odometer: 392140,
        status: "scheduled",
        notes: "Booked following telemetry escalation."
      }
    ],
    alerts: [
      {
        id: "AL-4398",
        vehicleId: "FL-0871",
        vehicleName: "Tata Prima 3718",
        title: "Air brake pressure build-up degraded",
        description: "Build-up time measured 40% above manufacturer specification.",
        severity: "critical",
        category: "component",
        raisedAt: "2026-08-23T11:20:00Z"
      },
      {
        id: "AL-4361",
        vehicleId: "FL-0871",
        vehicleName: "Tata Prima 3718",
        title: "Injector variance recurring",
        description: "Cylinders 3 and 5 show repeat variance after January cleaning.",
        severity: "warning",
        category: "telemetry",
        raisedAt: "2026-08-15T08:05:00Z"
      }
    ],
    explanation: {
      summary: "Risk is concentrated in the braking subsystem. Air pressure build-up has degraded steadily since the June service, and recurring injector variance suggests the earlier cleaning did not resolve the root cause.",
      drivers: [
        { label: "Air brake build-up time", weight: 0.41, direction: "increases" },
        { label: "Recurring injector variance", weight: 0.22, direction: "increases" },
        { label: "Tread depth near minimum", weight: 0.16, direction: "increases" },
        { label: "Service booked within 4 days", weight: 0.11, direction: "decreases" }
      ],
      confidence: 0.87,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Restrict to short-haul routes until scheduled brake service",
      window: "Before 2026-08-28",
      priority: "high",
      estimatedCost: 54e3,
      estimatedDowntime: "1\u20132 days",
      rationale: "A service booking already exists. Limiting route length and load reduces exposure without additional downtime cost before the booked slot.",
      steps: [
        "Cap assignments at 150 km per trip until service",
        "Complete air brake service on the 2026-08-28 slot",
        "Replace the two tyres nearest minimum tread",
        "Perform injector diagnostic rather than repeat cleaning"
      ]
    }
  },
  {
    id: "FL-2210",
    name: "Ashok Leyland 1920",
    type: "Rigid Truck",
    plate: "KA 03 MN 2288",
    depot: "Bengaluru South",
    driver: "Sunil Gowda",
    healthScore: 57,
    riskLevel: "medium",
    riskProbability: 0.46,
    mileage: 268430,
    avgDailyKm: 240,
    lastService: "2026-07-09",
    nextMaintenance: "2026-09-12",
    nextMaintenanceIn: "In 19 days",
    inServiceSince: "2022-06-21",
    fuelEfficiency: 4.2,
    utilisation: 74,
    components: [
      comp("engine", "Engine", 74, "Minor oil pressure fluctuation under load"),
      comp("brakes", "Brakes", 69, "Rear pads at 55% remaining life"),
      comp("tyres", "Tyres", 52, "Front-right shoulder wear indicates alignment drift"),
      comp("battery", "Battery", 88, "Within normal range")
    ],
    history: [
      {
        id: "SR-88450",
        date: "2026-07-09",
        type: "Scheduled Service A",
        workshop: "Bengaluru South Workshop",
        cost: 21300,
        odometer: 261900,
        status: "completed",
        notes: "Alignment check recommended at next visit."
      },
      {
        id: "SR-86730",
        date: "2026-03-15",
        type: "Suspension Inspection",
        workshop: "Bengaluru South Workshop",
        cost: 15700,
        odometer: 243100,
        status: "completed",
        notes: "Bushings within tolerance."
      }
    ],
    alerts: [
      {
        id: "AL-4355",
        vehicleId: "FL-2210",
        vehicleName: "Ashok Leyland 1920",
        title: "Tyre alignment drift",
        description: "Front-right shoulder wear pattern consistent with alignment drift.",
        severity: "warning",
        category: "component",
        raisedAt: "2026-08-19T10:40:00Z"
      }
    ],
    explanation: {
      summary: "Moderate risk driven by tyre wear geometry rather than powertrain condition. Alignment drift is the dominant factor and is inexpensive to correct if addressed before the next service interval.",
      drivers: [
        { label: "Front-right shoulder wear", weight: 0.38, direction: "increases" },
        { label: "Oil pressure fluctuation", weight: 0.19, direction: "increases" },
        { label: "Moderate utilisation (74%)", weight: 0.14, direction: "decreases" },
        { label: "Recent service completion", weight: 0.12, direction: "decreases" }
      ],
      confidence: 0.83,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Add wheel alignment to the next planned service visit",
      window: "Before 2026-09-12",
      priority: "planned",
      estimatedCost: 12400,
      estimatedDowntime: "Under 4 hours",
      rationale: "Correcting alignment now avoids premature replacement of two front tyres and keeps the vehicle on its existing maintenance calendar.",
      steps: [
        "Book alignment alongside the 2026-09-12 service",
        "Rotate front tyres to even out remaining tread",
        "Log oil pressure readings weekly until the service visit"
      ]
    }
  },
  {
    id: "FL-3319",
    name: "Mahindra Furio 7",
    type: "Light Truck",
    plate: "TN 09 BR 5521",
    depot: "Chennai West",
    driver: "Karthik Raman",
    healthScore: 63,
    riskLevel: "medium",
    riskProbability: 0.38,
    mileage: 154780,
    avgDailyKm: 186,
    lastService: "2026-07-28",
    nextMaintenance: "2026-09-30",
    nextMaintenanceIn: "In 37 days",
    inServiceSince: "2023-04-11",
    fuelEfficiency: 6.8,
    utilisation: 69,
    components: [
      comp("engine", "Engine", 82, "Within normal range"),
      comp("brakes", "Brakes", 71, "Pad wear consistent with mileage"),
      comp("tyres", "Tyres", 74, "Even wear across all positions"),
      comp("battery", "Battery", 48, "Capacity at 68% of rated; slow crank reported twice")
    ],
    history: [
      {
        id: "SR-88790",
        date: "2026-07-28",
        type: "Scheduled Service A",
        workshop: "Chennai West Workshop",
        cost: 14900,
        odometer: 151200,
        status: "completed",
        notes: "Battery health flagged as declining."
      },
      {
        id: "SR-87020",
        date: "2026-04-02",
        type: "AC and Electrical Check",
        workshop: "Chennai West Workshop",
        cost: 9600,
        odometer: 138400,
        status: "completed",
        notes: "Alternator output normal."
      }
    ],
    alerts: [
      {
        id: "AL-4348",
        vehicleId: "FL-3319",
        vehicleName: "Mahindra Furio 7",
        title: "Battery capacity declining",
        description: "Measured capacity at 68% of rated with two slow-crank events logged.",
        severity: "warning",
        category: "component",
        raisedAt: "2026-08-14T07:15:00Z"
      }
    ],
    explanation: {
      summary: "Powertrain and running gear are healthy. The score is held down almost entirely by battery degradation, which is a low-cost, high-certainty fix.",
      drivers: [
        { label: "Battery capacity at 68%", weight: 0.52, direction: "increases" },
        { label: "Slow-crank events logged", weight: 0.18, direction: "increases" },
        { label: "Healthy engine telemetry", weight: 0.16, direction: "decreases" },
        { label: "Low daily distance", weight: 0.09, direction: "decreases" }
      ],
      confidence: 0.89,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Replace battery at the next depot visit",
      window: "Within 2 weeks",
      priority: "planned",
      estimatedCost: 8900,
      estimatedDowntime: "Under 1 hour",
      rationale: "A single inexpensive part replacement is expected to move this vehicle back into the healthy band without any route disruption.",
      steps: [
        "Order replacement battery to Chennai West depot",
        "Swap during the next overnight layover",
        "Verify alternator charge output after replacement"
      ]
    }
  },
  {
    id: "FL-0455",
    name: "Eicher Pro 2110",
    type: "Light Truck",
    plate: "DL 01 CX 9034",
    depot: "Delhi East",
    driver: "Vikram Singh",
    healthScore: 88,
    riskLevel: "low",
    riskProbability: 0.09,
    mileage: 97310,
    avgDailyKm: 142,
    lastService: "2026-08-06",
    nextMaintenance: "2026-11-04",
    nextMaintenanceIn: "In 72 days",
    inServiceSince: "2024-01-19",
    fuelEfficiency: 7.4,
    utilisation: 63,
    components: [
      comp("engine", "Engine", 92, "Within normal range"),
      comp("brakes", "Brakes", 89, "Within normal range"),
      comp("tyres", "Tyres", 85, "Within normal range"),
      comp("battery", "Battery", 90, "Within normal range")
    ],
    history: [
      {
        id: "SR-89010",
        date: "2026-08-06",
        type: "Scheduled Service A",
        workshop: "Delhi East Workshop",
        cost: 12400,
        odometer: 95800,
        status: "completed",
        notes: "All subsystems within tolerance."
      },
      {
        id: "SR-87500",
        date: "2026-05-12",
        type: "Tyre Rotation",
        workshop: "Delhi East Workshop",
        cost: 3200,
        odometer: 84600,
        status: "completed",
        notes: "Routine rotation."
      }
    ],
    alerts: [],
    explanation: {
      summary: "All monitored subsystems are within tolerance and the vehicle is on a current service interval. No intervention indicated beyond the standard calendar.",
      drivers: [
        { label: "All components above 85", weight: 0.44, direction: "decreases" },
        { label: "Recent service completion", weight: 0.27, direction: "decreases" },
        { label: "Low utilisation (63%)", weight: 0.18, direction: "decreases" }
      ],
      confidence: 0.94,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Continue standard maintenance calendar",
      window: "Next service 2026-11-04",
      priority: "planned",
      estimatedCost: 12e3,
      estimatedDowntime: "Under 4 hours",
      rationale: "No condition-based intervention is warranted. This unit is a candidate for higher-utilisation routes.",
      steps: [
        "Keep the 2026-11-04 service slot",
        "Consider reassigning to a longer route to balance fleet utilisation"
      ]
    }
  },
  {
    id: "FL-1780",
    name: "BharatBenz 1617R",
    type: "Rigid Truck",
    plate: "TS 07 UT 6690",
    depot: "Hyderabad Central",
    driver: "Anil Kumar",
    healthScore: 91,
    riskLevel: "low",
    riskProbability: 0.07,
    mileage: 128640,
    avgDailyKm: 168,
    lastService: "2026-08-12",
    nextMaintenance: "2026-11-18",
    nextMaintenanceIn: "In 86 days",
    inServiceSince: "2023-08-30",
    fuelEfficiency: 5.1,
    utilisation: 71,
    components: [
      comp("engine", "Engine", 94, "Within normal range"),
      comp("brakes", "Brakes", 91, "Within normal range"),
      comp("tyres", "Tyres", 87, "Within normal range"),
      comp("battery", "Battery", 93, "Within normal range")
    ],
    history: [
      {
        id: "SR-89120",
        date: "2026-08-12",
        type: "Scheduled Service B",
        workshop: "Hyderabad Central Workshop",
        cost: 26800,
        odometer: 126300,
        status: "completed",
        notes: "No exceptions recorded."
      }
    ],
    alerts: [],
    explanation: {
      summary: "Strongest health profile in the active fleet. Telemetry is stable across all subsystems with no anomalies in the last 90 days.",
      drivers: [
        { label: "Stable telemetry across 90 days", weight: 0.47, direction: "decreases" },
        { label: "Service completed 12 days ago", weight: 0.29, direction: "decreases" },
        { label: "Balanced utilisation", weight: 0.15, direction: "decreases" }
      ],
      confidence: 0.95,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "No action required",
      window: "Next service 2026-11-18",
      priority: "planned",
      estimatedCost: 27e3,
      estimatedDowntime: "Under 4 hours",
      rationale: "Vehicle is performing above fleet baseline. Suitable as a replacement unit for high-risk vehicles pulled from rotation.",
      steps: ["Maintain current service calendar", "Flag as available substitute for FL-1042 long-haul route"]
    }
  },
  {
    id: "FL-2604",
    name: "Tata Ace Gold",
    type: "Mini Truck",
    plate: "RJ 14 LP 3345",
    depot: "Jaipur Depot",
    driver: "Mahesh Yadav",
    healthScore: 79,
    riskLevel: "low",
    riskProbability: 0.16,
    mileage: 64205,
    avgDailyKm: 98,
    lastService: "2026-07-21",
    nextMaintenance: "2026-10-15",
    nextMaintenanceIn: "In 52 days",
    inServiceSince: "2024-05-08",
    fuelEfficiency: 9.2,
    utilisation: 58,
    components: [
      comp("engine", "Engine", 86, "Within normal range"),
      comp("brakes", "Brakes", 78, "Within normal range"),
      comp("tyres", "Tyres", 71, "Rear tyres at 60% tread"),
      comp("battery", "Battery", 84, "Within normal range")
    ],
    history: [
      {
        id: "SR-88600",
        date: "2026-07-21",
        type: "Scheduled Service A",
        workshop: "Jaipur Depot Workshop",
        cost: 8700,
        odometer: 62100,
        status: "completed",
        notes: "Routine service completed."
      }
    ],
    alerts: [],
    explanation: {
      summary: "Low risk profile supported by light duty cycles and low daily distance. Rear tyre tread is the only metric trending downward.",
      drivers: [
        { label: "Low daily distance (98 km)", weight: 0.35, direction: "decreases" },
        { label: "Rear tread at 60%", weight: 0.24, direction: "increases" },
        { label: "Healthy engine and battery", weight: 0.21, direction: "decreases" }
      ],
      confidence: 0.88,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Monitor rear tyre tread at next depot check",
      window: "Before 2026-10-15",
      priority: "planned",
      estimatedCost: 6800,
      estimatedDowntime: "Under 2 hours",
      rationale: "No immediate intervention needed. Tread should be re-measured within the next four weeks.",
      steps: ["Measure rear tread at the next weekly depot check", "Plan replacement if below 45%"]
    }
  },
  {
    id: "FL-1955",
    name: "Isuzu D-Max Utility",
    type: "Utility Pickup",
    plate: "HR 26 DK 1187",
    depot: "Gurugram Hub",
    driver: "Deepak Verma",
    healthScore: 68,
    riskLevel: "medium",
    riskProbability: 0.31,
    mileage: 112980,
    avgDailyKm: 154,
    lastService: "2026-06-30",
    nextMaintenance: "2026-08-26",
    nextMaintenanceIn: "In 2 days",
    inServiceSince: "2023-11-27",
    fuelEfficiency: 8.1,
    utilisation: 66,
    components: [
      comp("engine", "Engine", 79, "Within normal range"),
      comp("brakes", "Brakes", 64, "Front pads at 42% remaining life"),
      comp("tyres", "Tyres", 69, "Within normal range"),
      comp("battery", "Battery", 76, "Within normal range")
    ],
    history: [
      {
        id: "SR-88200",
        date: "2026-06-30",
        type: "Scheduled Service A",
        workshop: "Gurugram Hub Workshop",
        cost: 11500,
        odometer: 106400,
        status: "completed",
        notes: "Front pad wear noted for next visit."
      },
      {
        id: "SR-89640",
        date: "2026-08-26",
        type: "Brake Pad Replacement",
        workshop: "Gurugram Hub Workshop",
        cost: 9800,
        odometer: 112980,
        status: "scheduled",
        notes: "Booked as a preventive replacement."
      }
    ],
    alerts: [
      {
        id: "AL-4340",
        vehicleId: "FL-1955",
        vehicleName: "Isuzu D-Max Utility",
        title: "Front brake pads approaching threshold",
        description: "Front pads at 42% remaining life with replacement already booked.",
        severity: "info",
        category: "component",
        raisedAt: "2026-08-12T13:00:00Z"
      }
    ],
    explanation: {
      summary: "Risk is contained. Brake wear is the primary contributor and a preventive replacement is already booked within the next two days.",
      drivers: [
        { label: "Front pad remaining life 42%", weight: 0.43, direction: "increases" },
        { label: "Replacement booked in 2 days", weight: 0.26, direction: "decreases" },
        { label: "Stable engine telemetry", weight: 0.17, direction: "decreases" }
      ],
      confidence: 0.86,
      modelVersion: "riskscore-v4.2",
      evaluatedAt: "2026-08-24T05:00:00Z"
    },
    recommendation: {
      action: "Proceed with the booked brake pad replacement",
      window: "2026-08-26",
      priority: "planned",
      estimatedCost: 9800,
      estimatedDowntime: "Under 3 hours",
      rationale: "The existing booking addresses the only material risk driver. No route changes required in the interim.",
      steps: ["Confirm parts availability at Gurugram Hub", "Complete replacement on the booked slot"]
    }
  }
];
const fleetSummary = {
  totalVehicles: 248,
  healthyVehicles: 176,
  mediumRisk: 49,
  highRisk: 23,
  fleetHealthScore: 78.4,
  previousHealthScore: 75.1,
  activeToday: 214,
  inWorkshop: 12,
  deltas: {
    total: 6,
    healthy: 9,
    medium: -3,
    high: -2
  }
};
const healthTrend = [
  { month: "Feb", health: 71.2, highRisk: 34, mediumRisk: 62 },
  { month: "Mar", health: 72.6, highRisk: 32, mediumRisk: 60 },
  { month: "Apr", health: 71.9, highRisk: 35, mediumRisk: 57 },
  { month: "May", health: 73.8, highRisk: 30, mediumRisk: 55 },
  { month: "Jun", health: 75.1, highRisk: 27, mediumRisk: 53 },
  { month: "Jul", health: 76.9, highRisk: 25, mediumRisk: 51 },
  { month: "Aug", health: 78.4, highRisk: 23, mediumRisk: 49 }
];
const riskDistribution = [
  { name: "Healthy", value: 176, key: "low" },
  { name: "Medium risk", value: 49, key: "medium" },
  { name: "High risk", value: 23, key: "high" }
];
const componentHealthSummary = [
  { component: "Engine", avgScore: 81, atRisk: 18 },
  { component: "Brakes", avgScore: 73, atRisk: 31 },
  { component: "Tyres", avgScore: 76, atRisk: 26 },
  { component: "Battery", avgScore: 84, atRisk: 14 }
];
const vehicleTypeBreakdown = [
  { type: "Heavy Truck", count: 86, avgHealth: 71 },
  { type: "Rigid Truck", count: 64, avgHealth: 79 },
  { type: "Light Truck", count: 58, avgHealth: 82 },
  { type: "Utility Pickup", count: 26, avgHealth: 80 },
  { type: "Mini Truck", count: 14, avgHealth: 85 }
];
const priorityAlerts = vehicles.flatMap((v) => v.alerts).sort((a, b) => {
  const order = { critical: 0, warning: 1, info: 2 };
  if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
  return b.raisedAt.localeCompare(a.raisedAt);
});
function getVehicle(id) {
  return vehicles.find((v) => v.id === id);
}
const riskMeta = {
  low: { label: "Low", badge: "success" },
  medium: { label: "Medium", badge: "warning" },
  high: { label: "High", badge: "danger" }
};


function computeHealthScore(vehicle) {
  const engine = vehicle.components.find((c) => c.key === "engine")?.score ?? 0;
  const brakes = vehicle.components.find((c) => c.key === "brakes")?.score ?? 0;

  const mileageScore = Math.max(0, 100 - vehicle.mileage / 6000);
  const overdueScore = vehicle.nextMaintenanceIn?.toLowerCase().includes("overdue") ? 20 : 95;

  const weighted =
    mileageScore * 0.2 +
    engine * 0.3 +
    brakes * 0.25 +
    overdueScore * 0.25;

  return Math.round(weighted);
}

function healthTone(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}
function formatKm(value) {
  return `${value.toLocaleString("en-IN")} km`;
}
function formatCurrency(value) {
  return `\u20B9${value.toLocaleString("en-IN")}`;
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 36e5);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
export {
  componentHealthSummary,
  computeHealthScore,
  fleetSummary,
  formatCurrency,
  formatDate,
  formatKm,
  getVehicle,
  healthTone,
  healthTrend,
  priorityAlerts,
  relativeTime,
  riskDistribution,
  riskMeta,
  vehicleTypeBreakdown,
  vehicles
};
