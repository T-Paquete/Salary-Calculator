document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('salary-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Read values from form
    const grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
    const incomePeriod = document.getElementById('incomePeriod').value;
    const isMarried = document.getElementById('isMarried').checked;
    const isSingleParent = document.getElementById('isSingleParent').checked;
    const numChildren = parseInt(document.getElementById('numChildren').value, 10) || 0;
    const isChurchMember = document.getElementById('isChurchTax').checked;
    const isPrivatelyInsured = document.getElementById('isPrivatelyInsured').checked;
    const isInSaxony = document.getElementById('isInSaxony').checked;
    const healthZusatzbeitrag = parseFloat(document.getElementById('zusatzbeitrag').value) || 2.5;

    // Determine church region (for demo, always 'OTHER', but could be a select in future)
    const churchRegion = 'OTHER';

    // Convert to yearly if needed
    const annualGrossIncome = incomePeriod === 'monthly' ? grossIncome * 12 : grossIncome;

    // Build input object
    const inputs = {
      annualGrossIncome,
      isMarried,
      isSingleParent,
      numChildren,
      isChurchMember,
      churchRegion,
      isPrivatelyInsured,
      healthZusatzbeitrag,
      isInSaxony
    };

    // Call calculation function
    const results = calculateResults(inputs);
    renderResults(results);
// Render results in the DOM
function renderResults(results) {
  const monthly = results.monthly;
  const yearly = results.yearly;

  // Helper to format euro values
  const euro = v => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  // List of result keys and their labels
  const keys = [
    { key: 'brutto', label: 'Brutto' },
    { key: 'netto', label: 'Netto' },
    { key: 'lohnsteuer', label: 'Lohnsteuer' },
    { key: 'soli', label: 'Soli' },
    { key: 'kirche', label: 'Kirchensteuer' },
    { key: 'kv', label: 'Krankenversicherung' },
    { key: 'rv', label: 'Rentenversicherung' },
    { key: 'alv', label: 'Arbeitslosenversicherung' },
    { key: 'pv', label: 'Pflegeversicherung' }
  ];

  // Render monthly
  const monthlyBreakdown = document.getElementById('monthlyBreakdown');
  monthlyBreakdown.innerHTML = keys.map(({ key, label }) =>
    `<div><span>${label}:</span> <span>${euro(monthly[key])}</span></div>`
  ).join('');

  // Render yearly
  const yearlyBreakdown = document.getElementById('yearlyBreakdown');
  yearlyBreakdown.innerHTML = keys.map(({ key, label }) =>
    `<div><span>${label}:</span> <span>${euro(yearly[key])}</span></div>`
  ).join('');
}
  });
});


import {
  calculateAllowances2025,
  calculateIncomeTax2025,
  calculateSolidaritySurcharge2025,
  calculateChurchTax2025,
  calculatePensionContribution2025,
  calculateUnemploymentContribution2025,
  calculateHealthInsuranceContribution2025,
  calculateNursingCareContribution2025
} from './advancedCalculations.js';

function calculateResults(inputs) {
  const {
    annualGrossIncome,
    isMarried,
    isSingleParent,
    numChildren,
    isChurchMember,
    churchRegion,
    isPrivatelyInsured,
    healthZusatzbeitrag,
    isInSaxony
  } = inputs;

  // Calculate allowances and taxable income
  const allowances = calculateAllowances2025({ isMarried, numChildren, isSingleParent });
  const taxableIncome = Math.max(0, annualGrossIncome - allowances);

  // Calculate deductions
  const lohnsteuer = calculateIncomeTax2025(taxableIncome);
  const soli = calculateSolidaritySurcharge2025(lohnsteuer, isMarried);
  const kirche = calculateChurchTax2025({ incomeTax: lohnsteuer, isChurchMember, region: churchRegion });
  const rv = calculatePensionContribution2025(annualGrossIncome);
  const alv = calculateUnemploymentContribution2025(annualGrossIncome);
  const kv = calculateHealthInsuranceContribution2025(annualGrossIncome, { zusatzbeitrag: healthZusatzbeitrag, isPrivatelyInsured });
  const pv = calculateNursingCareContribution2025(annualGrossIncome, { numChildren, isInSaxony });

  // Total deductions
  const totalDeductions = lohnsteuer + soli + kirche + rv + alv + kv + pv;
  const netto = annualGrossIncome - totalDeductions;

  // Return yearly and monthly breakdowns
  return {
    yearly: {
      brutto: Math.round(annualGrossIncome),
      netto: Math.round(netto),
      lohnsteuer: Math.round(lohnsteuer),
      soli: Math.round(soli),
      kirche: Math.round(kirche),
      kv: Math.round(kv),
      rv: Math.round(rv),
      alv: Math.round(alv),
      pv: Math.round(pv)
    },
    monthly: {
      brutto: Math.round(annualGrossIncome / 12),
      netto: Math.round(netto / 12),
      lohnsteuer: Math.round(lohnsteuer / 12),
      soli: Math.round(soli / 12),
      kirche: Math.round(kirche / 12),
      kv: Math.round(kv / 12),
      rv: Math.round(rv / 12),
      alv: Math.round(alv / 12),
      pv: Math.round(pv / 12)
    }
  };
}
