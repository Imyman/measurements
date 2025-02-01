// Unit categories and their respective units
export const unitCategories = {
  length: {
    name: "Length",
    units: {
      meters: { label: "Meters (m)", baseMultiplier: 1 },
      kilometers: { label: "Kilometers (km)", baseMultiplier: 1000 },
      centimeters: { label: "Centimeters (cm)", baseMultiplier: 0.01 },
      millimeters: { label: "Millimeters (mm)", baseMultiplier: 0.001 },
      miles: { label: "Miles (mi)", baseMultiplier: 1609.344 },
      yards: { label: "Yards (yd)", baseMultiplier: 0.9144 },
      feet: { label: "Feet (ft)", baseMultiplier: 0.3048 },
      inches: { label: "Inches (in)", baseMultiplier: 0.0254 }
    }
  },
  mass: {
    name: "Mass",
    units: {
      kilograms: { label: "Kilograms (kg)", baseMultiplier: 1 },
      grams: { label: "Grams (g)", baseMultiplier: 0.001 },
      milligrams: { label: "Milligrams (mg)", baseMultiplier: 0.000001 },
      pounds: { label: "Pounds (lb)", baseMultiplier: 0.45359237 },
      ounces: { label: "Ounces (oz)", baseMultiplier: 0.028349523125 }
    }
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { label: "Celsius (°C)", baseMultiplier: 1 },
      fahrenheit: { label: "Fahrenheit (°F)", baseMultiplier: 1 },
      kelvin: { label: "Kelvin (K)", baseMultiplier: 1 }
    }
  },
  area: {
    name: "Area",
    units: {
      // Metric
      squareMeters: { 
        label: "Square Meters (m²)", 
        baseMultiplier: 1,
        multiInput: {
          type: "square",
          allowMixedUnits: true
        }
      },
      squareKilometers: { 
        label: "Square Kilometers (km²)", 
        baseMultiplier: 1000000,
        multiInput: {
          type: "square",
          allowMixedUnits: true
        }
      },
      squareCentimeters: { 
        label: "Square Centimeters (cm²)", 
        baseMultiplier: 0.0001,
        multiInput: {
          type: "square",
          allowMixedUnits: true
        }
      },
      // Imperial/US
      squareFeet: { 
        label: "Square Feet (ft²)", 
        baseMultiplier: 0.092903,
        multiInput: {
          type: "square",
          allowMixedUnits: true
        }
      },
      squareInches: { 
        label: "Square Inches (in²)", 
        baseMultiplier: 0.00064516,
        multiInput: {
          type: "square",
          allowMixedUnits: true
        }
      },
      squareYards: { 
        label: "Square Yards (yd²)", 
        baseMultiplier: 0.836127,
        multiInput: {
          type: "square",
          allowMixedUnits: true
        }
      },
      acres: { 
        label: "Acres", 
        baseMultiplier: 4046.86
      },
      hectares: { 
        label: "Hectares (ha)", 
        baseMultiplier: 10000
      }
    }
  },
  volume: {
    name: "Volume",
    units: {
      // Metric
      liters: { label: "Liters (L)", baseMultiplier: 1 },
      milliliters: { label: "Milliliters (mL)", baseMultiplier: 0.001 },
      cubicMeters: { 
        label: "Cubic Meters (m³)", 
        baseMultiplier: 1000,
        multiInput: {
          type: "cubic",
          allowMixedUnits: true
        }
      },
      // US Customary
      gallons: { label: "Gallons (gal)", baseMultiplier: 3.78541 },
      quarts: { label: "Quarts (qt)", baseMultiplier: 0.946353 },
      pints: { label: "Pints (pt)", baseMultiplier: 0.473176 },
      cups: { label: "Cups (cup)", baseMultiplier: 0.236588 },
      fluidOunces: { label: "Fluid Ounces (fl oz)", baseMultiplier: 0.0295735 },
      // Cubic measurements
      cubicFeet: { 
        label: "Cubic Feet (ft³)", 
        baseMultiplier: 28.3168,
        multiInput: {
          type: "cubic",
          allowMixedUnits: true
        }
      },
      cubicInches: { 
        label: "Cubic Inches (in³)", 
        baseMultiplier: 0.0163871,
        multiInput: {
          type: "cubic",
          allowMixedUnits: true
        }
      },
      cubicYards: { 
        label: "Cubic Yards (yd³)", 
        baseMultiplier: 764.555,
        multiInput: {
          type: "cubic",
          allowMixedUnits: true
        }
      }
    }
  }
  // Add more categories as needed
};

export function convert(value, fromUnit, toUnit, category) {
  if (category === "temperature") {
    return convertTemperature(value, fromUnit, toUnit);
  }

  const fromUnitDetails = unitCategories[category].units[fromUnit];
  const toUnitDetails = unitCategories[category].units[toUnit];
  
  let baseValue;
  if (fromUnitDetails.multiInput) {
    // Value is already in base units (square meters for area, cubic meters for volume)
    baseValue = value;
    
    // Convert cubic meters to liters for volume calculations
    if (category === "volume") {
      baseValue *= 1000;
    }
  } else {
    baseValue = value * fromUnitDetails.baseMultiplier;
  }

  return baseValue / toUnitDetails.baseMultiplier;
}

function convertTemperature(value, fromUnit, toUnit) {
  // First convert to Celsius
  let celsius;
  if (fromUnit === "fahrenheit") {
    celsius = (value - 32) * (5/9);
  } else if (fromUnit === "kelvin") {
    celsius = value - 273.15;
  } else {
    celsius = value;
  }

  // Then convert to target unit
  if (toUnit === "fahrenheit") {
    return (celsius * 9/5) + 32;
  } else if (toUnit === "kelvin") {
    return celsius + 273.15;
  }
  return celsius;
}

// Convert a single length value to meters (base unit)
export function convertToBaseLength(value, unit) {
  const multiplier = unitCategories.length.units[unit].baseMultiplier;
  return value * multiplier;
}

// Calculate area/volume from dimensions in different units
export function calculateFromDimensions(length, lengthUnit, width, widthUnit, height, heightUnit) {
  const lengthInMeters = convertToBaseLength(length, lengthUnit);
  const widthInMeters = convertToBaseLength(width, widthUnit);
  
  if (height === undefined) {
    // Area calculation
    return lengthInMeters * widthInMeters;
  }
  
  // Volume calculation
  const heightInMeters = convertToBaseLength(height, heightUnit);
  return lengthInMeters * widthInMeters * heightInMeters;
} 