
//---------------------------------------------------------------------------------------
// Calculate income tax (Lohnsteuer) based on taxable income
//---------------------------------------------------------------------------------------
/** 
 * @param {number} taxableIncome - The annual taxable income in euros.
 * @returns {number} - The rounded annual income tax in euros.
*/
export function calculateIncomeTax2025(taxableIncome) {
  const x = Math.floor(taxableIncome);

  if (x <= 12096) {
    return 0;
  } else if (x <= 17443) {
    const y = (x - 12096) / 10000;
    return Math.floor((1008.70 * y + 1400) * y);
  } else if (x <= 68480) {
    const z = (x - 17443) / 10000;
    return Math.floor((206.43 * z + 2397) * z + 938.24);
  } else if (x <= 277825) {
    return Math.floor(0.42 * x - 10911.92);
  } else {
    return Math.floor(0.45 * x - 19246.67);
  }
}


//---------------------------------------------------------------------------------------
// Constants for 2025 allowances and deductions / tax-free allowances for an individual
//---------------------------------------------------------------------------------------
const BASIC_ALLOWANCE = 12096; // Grundfreibetrag (per person)
const CHILD_ALLOWANCE_PER_CHILD = 9600; // per child (both parents)
const EMPLOYEE_EXPENSES_ALLOWANCE = 1230; // Werbungskostenpauschale
const SPECIAL_EXPENSES_ALLOWANCE = 36; // Sonderausgabenpauschbetrag for singles
const SPECIAL_EXPENSES_ALLOWANCE_MARRIED = 72;
const SINGLE_PARENT_ALLOWANCE_BASE = 4260;
const SINGLE_PARENT_ALLOWANCE_EXTRA = 240; // for each additional child


// Calculate total tax-free allowances for an individual
/** 
 * @param {Object} options
 * @param {boolean} options.isMarried - If the person is married
 * @param {number} options.numChildren - Number of children
 * @param {boolean} options.isSingleParent - If the person is a single parent
 * @returns {number} - Total allowance in euros
*/

export function calculateAllowances2025({
  isMarried = false,
  numChildren = 0,
  isSingleParent = false
} = {}) {
  let allowance = 0;

  // Grundfreibetrag
  allowance += isMarried ? BASIC_ALLOWANCE * 2 : BASIC_ALLOWANCE;

  // Werbungskostenpauschale (Employee flat rate)
  allowance += EMPLOYEE_EXPENSES_ALLOWANCE;

  // Sonderausgabenpauschbetrag (special personal expenses)
  allowance += isMarried ? SPECIAL_EXPENSES_ALLOWANCE_MARRIED : SPECIAL_EXPENSES_ALLOWANCE;

  // Kinderfreibetrag (Child allowance only relevant for final income tax)
  allowance += numChildren * CHILD_ALLOWANCE_PER_CHILD;

  // Alleinerziehendenentlastungsbetrag (Single parent allowance)
  if (isSingleParent && numChildren > 0) {
    allowance += SINGLE_PARENT_ALLOWANCE_BASE + (numChildren - 1) * SINGLE_PARENT_ALLOWANCE_EXTRA;
  }

  return allowance;
}


//---------------------------------------------------------------------------------------
// Calculate Solidaritätszuschlag (solidarity surcharge) 
//---------------------------------------------------------------------------------------
/**  
 * @param {number} incomeTax - Annual income tax (Lohnsteuer) in euros.
 * @param {boolean} isMarried - Whether the taxpayer is married.
 * @returns {number} - Solidaritätszuschlag in euros (rounded down).
 * */


// Solidaritätszuschlag = min [ 0.055 × ESt,  max ( 0.119 × (ESt – Freigrenze), 0 ) ]
//      where:
//      ESt = Annual income tax (Lohnsteuer)
//      Freigrenze = Exemption threshold (€19,950 for singles; €39,900 for couples)

export function calculateSolidaritySurcharge2025(incomeTax, isMarried = false) {
  // 1. Define the exemption threshold
  const exemptionThreshold = isMarried ? 39900 : 19950;

  // 2. Compute the upper phase-in limit using the legal 5.5% / 11.9% ratio
  const phaseInUpperLimit = exemptionThreshold * (1 + (0.055 / 0.119)); // ≈ 1.4622 × threshold

  // 3. No Soli below or equal to exemption
  if (incomeTax <= exemptionThreshold) return 0;

  // 4. Compute max 5.5% surcharge
  const maxSurcharge = Math.floor(incomeTax * 0.055);

  // 5. Phase-in zone: apply 11.9% of excess over threshold
  if (incomeTax <= phaseInUpperLimit) {
    const excess = incomeTax - exemptionThreshold;
    return Math.floor(excess * 0.119);
  }

  // 6. Full surcharge applies
  return maxSurcharge;
}

//---------------------------------------------------------------------------------------
// Calculate church tax (Kirchensteuer)
//---------------------------------------------------------------------------------------
/**
 * @param {Object} options
 * @param {number} incomeTax - The calculated annual income tax in euros.
 * @param {boolean} isChurchMember - Whether the employee is officially a member of a religious community.
 * @param {'BY' | 'BW' | 'OTHER'} region - Region code: 'BY' = Bavaria, 'BW' = Baden-Württemberg, 'OTHER' = all other states.
 * @returns {number} - Church tax amount in euros.
*/
export function calculateChurchTax2025({
  incomeTax,
  isChurchMember,
  region = 'OTHER'
}) {
  if (!isChurchMember || incomeTax <= 0) return 0;

  const churchTaxRate = (region === 'BY' || region === 'BW') ? 0.08 : 0.09;
  return Math.floor(incomeTax * churchTaxRate);
}



//---------------------------------------------------------------------------------------
// Social Security Contributions (Employee Side)
//---------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------
// Calculate Pension Insurance Contribution (gesetzliche Rentenversicherung)
//---------------------------------------------------------------------------------------

/**
 * @param {number} annualGrossIncome - Annual gross income in euros.
 * @returns {number} - Employee-side pension contribution in euros (rounded down).
 */
export function calculatePensionContribution2025(annualGrossIncome) {
  const PENSION_RATE_EMPLOYEE = 0.093; // 9.3% employee share
  const PENSION_CONTRIBUTION_CEILING = 96600; // annual ceiling in euros

  const contributionBase = Math.min(annualGrossIncome, PENSION_CONTRIBUTION_CEILING);
  return Math.floor(contributionBase * PENSION_RATE_EMPLOYEE);
}

//---------------------------------------------------------------------------------------
// Calculate Unemployment Insurance Contribution (Arbeitslosenversicherung)
//---------------------------------------------------------------------------------------

/**
 * @param {number} annualGrossIncome - Annual gross income in euros.
 * @returns {number} - Employee-side unemployment contribution in euros (rounded down).
 */
export function calculateUnemploymentContribution2025(annualGrossIncome) {
  const UNEMPLOYMENT_RATE_EMPLOYEE = 0.013; // 1.3% employee share
  const UNEMPLOYMENT_CONTRIBUTION_CEILING = 96600; // annual ceiling in euros

  const contributionBase = Math.min(annualGrossIncome, UNEMPLOYMENT_CONTRIBUTION_CEILING);
  return Math.floor(contributionBase * UNEMPLOYMENT_RATE_EMPLOYEE);
}


//---------------------------------------------------------------------------------------
// Calculate Health Insurance Contribution (gesetzliche Krankenversicherung)
//---------------------------------------------------------------------------------------

/**
 * @param {number} annualGrossIncome - Annual gross income in euros.
 * @param {Object} options
 * @param {number} [options.zusatzbeitrag=2.5] - Zusatzbeitrag in percent (e.g. 2.5 means 2.5%)
 * @param {boolean} [options.isPrivatelyInsured=false] - If true, no public health contribution is deducted
 * @returns {number} - Employee-side public health insurance contribution in euros (rounded down)
 */
export function calculateHealthInsuranceContribution2025(
  annualGrossIncome,
  { zusatzbeitrag = 2.5, isPrivatelyInsured = false } = {}
) {
  if (isPrivatelyInsured) return 0;

  const HEALTH_CONTRIBUTION_RATE_EMPLOYEE = 0.073; // 7.3%
  const HEALTH_CONTRIBUTION_CEILING = 66150; // annual cap
  const employeeZusatzRate = zusatzbeitrag / 200; // Half of Zusatzbeitrag, convert % to decimal

  const contributionBase = Math.min(annualGrossIncome, HEALTH_CONTRIBUTION_CEILING);
  const totalRate = HEALTH_CONTRIBUTION_RATE_EMPLOYEE + employeeZusatzRate;

  return Math.floor(contributionBase * totalRate);
}


//---------------------------------------------------------------------------------------
// Calculate Nursing Care Insurance Contribution (soziale Pflegeversicherung)
//---------------------------------------------------------------------------------------

/**
 * @param {number} annualGrossIncome - Annual gross income in euros.
 * @param {Object} options
 * @param {number} [options.numChildren=0] - Number of children under 25
 * @param {boolean} [options.isInSaxony=false] - True if employee works in Saxony
 * @returns {number} - Employee-side nursing care contribution in euros (rounded down)
 */
export function calculateNursingCareContribution2025(
  annualGrossIncome,
  { numChildren = 0, isInSaxony = false } = {}
) {
  const CONTRIBUTION_CEILING = 66150;
  const contributionBase = Math.min(annualGrossIncome, CONTRIBUTION_CEILING);

  const BASE_TOTAL_RATE = 0.036; // 3.6% total
  const BASE_EMPLOYEE_RATE = 0.018; // default with children
  const BASE_EMPLOYER_RATE_SAXONY = 0.013;

  // Determine base employee share depending on Saxony rule
  let employeeRate = isInSaxony ? (BASE_TOTAL_RATE - BASE_EMPLOYER_RATE_SAXONY) : BASE_EMPLOYEE_RATE;

  // Apply childless surcharge (0.6%)
  if (numChildren === 0) {
    employeeRate += 0.006;
  }

  // Apply reduction: each child after the first (up to 5) reduces rate by 0.25%
  const reductions = Math.max(0, Math.min(numChildren - 1, 4)); // max 4 reductions (for 2–5 kids)
  employeeRate -= reductions * 0.0025;

  // Minimum rate for employees is 0.8% regardless of location
  employeeRate = Math.max(employeeRate, 0.008);

  return Math.floor(contributionBase * employeeRate);
}

