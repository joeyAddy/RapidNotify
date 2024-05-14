// The type for a security unit
interface SecurityUnit {
  unitName: string;
  emergencyNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

// The type for an incident
interface Incident {
  type: string;
  securityType: string;
  securityUnits: SecurityUnit[];
}

// The list of incident types
const incidentTypes: string[] = [
  "theft",
  "accident",
  "Fire",
  "cyber crime",
  "health emergency",
  "kidnapping",
];

// Dummy security units for each incident type
const dummySecurityUnits: { [key: string]: SecurityUnit[] } = {
  theft: [
    {
      unitName: "Local Police Station",
      emergencyNumber: "911",
      location: { latitude: 10.463, longitude: 7.4571 },
    },
    {
      unitName: "Community Watch",
      emergencyNumber: "999",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
  ],
  accident: [
    {
      unitName: "Ambulance Service",
      emergencyNumber: "911",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
    {
      unitName: "Local Hospital",
      emergencyNumber: "999",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
  ],
  Fire: [
    {
      unitName: "Fire Department",
      emergencyNumber: "911",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
  ],
  "cyber crime": [
    {
      unitName: "Cybersecurity Agency",
      emergencyNumber: "911",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
  ],
  "health emergency": [
    {
      unitName: "Ambulance Service",
      emergencyNumber: "911",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
    {
      unitName: "Local Hospital",
      emergencyNumber: "999",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
  ],
  kidnapping: [
    {
      unitName: "Local Police Station",
      emergencyNumber: "911",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
    {
      unitName: "FBI",
      emergencyNumber: "999",
      location: { latitude: 10.529917205946509, longitude: 7.458925284872095 },
    },
  ],
};

// Create an array of incidents
const incidents: Incident[] = incidentTypes.map((type) => ({
  type,
  securityType: getSecurityType(type),
  securityUnits: dummySecurityUnits[type] || [],
}));

// Function to determine the relevant security authority based on incident type
function getSecurityType(incidentType: string): string {
  switch (incidentType) {
    case "theft":
      return "Police";
    case "accident":
    case "health emergency":
      return "Ambulance";
    case "Fire":
      return "Firefighters";
    case "cyber crime":
      return "Cybersecurity";
    case "kidnapping":
      return "Police";
    default:
      return "Unknown";
  }
}

export { Incident, SecurityUnit, incidentTypes, incidents };
