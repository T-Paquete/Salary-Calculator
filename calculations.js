export const RATES = {
  incomeTax: 0.14,
  soli:      0.055,
  church:    0.08,
  health:    0.073,
  pension:   0.093,
  unemployment: 0.012,
  care:      0.01525
};

const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;

// Convert input to monthly basis for calculations
function normalizeToMonthly(grossInput, period) {
  const gross = parseFloat(grossInput || 0);
  if (!gross) return 0;
  
  switch (period) {
    case 'yearly':
      return gross / 12;  // yearly to monthly
    case 'monthly':
    default:
      return gross;
  }
}

// Convert monthly result back to requested period
function convertFromMonthly(monthlyAmount, period) {
  switch (period) {
    case 'yearly':
      return monthlyAmount * 12;  // monthly to yearly
    case 'monthly':
    default:
      return monthlyAmount;
  }
}

// returns { monthly: {...}, yearly: {...} }
export function calcAll(grossInput, inputPeriod = 'monthly') {
  const monthlyGross = normalizeToMonthly(grossInput, inputPeriod);
  if (!monthlyGross) return null;

  // Calculate all deductions on monthly basis
  const monthlyIncomeTax = monthlyGross * RATES.incomeTax;
  const monthlySoli      = monthlyIncomeTax * RATES.soli;
  const monthlyChurch    = monthlyIncomeTax * RATES.church;
  const monthlyHealth    = monthlyGross * RATES.health;
  const monthlyPension   = monthlyGross * RATES.pension;
  const monthlyUnemployment = monthlyGross * RATES.unemployment;
  const monthlyCare      = monthlyGross * RATES.care;
  
  const monthlyNet = monthlyGross - (monthlyIncomeTax + monthlySoli + monthlyChurch + 
                                   monthlyHealth + monthlyPension + monthlyUnemployment + monthlyCare);

  // Return data for monthly and yearly periods
  return {
    monthly: {
      gross: round2(monthlyGross),
      net: round2(monthlyNet),
      incomeTax: round2(monthlyIncomeTax),
      soli: round2(monthlySoli),
      church: round2(monthlyChurch),
      health: round2(monthlyHealth),
      pension: round2(monthlyPension),
      unemployment: round2(monthlyUnemployment),
      care: round2(monthlyCare)
    },
    yearly: {
      gross: round2(convertFromMonthly(monthlyGross, 'yearly')),
      net: round2(convertFromMonthly(monthlyNet, 'yearly')),
      incomeTax: round2(convertFromMonthly(monthlyIncomeTax, 'yearly')),
      soli: round2(convertFromMonthly(monthlySoli, 'yearly')),
      church: round2(convertFromMonthly(monthlyChurch, 'yearly')),
      health: round2(convertFromMonthly(monthlyHealth, 'yearly')),
      pension: round2(convertFromMonthly(monthlyPension, 'yearly')),
      unemployment: round2(convertFromMonthly(monthlyUnemployment, 'yearly')),
      care: round2(convertFromMonthly(monthlyCare, 'yearly'))
    }
  };
}
