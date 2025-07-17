
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

// Render results in the DOM
function renderResults(results) {
  console.log('Rendering results:', results);
  const monthly = results.monthly;
  const yearly = results.yearly;

  // Helper to format euro values
  const euro = v => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  // Get current language translations
  const getCurrentTranslations = () => {
    const currentLanguage = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
    const translations = {
      de: {
        brutto: 'Brutto', netto: 'Netto', lohnsteuer: 'Lohnsteuer', soli: 'Soli', 
        kirche: 'Kirchensteuer', kv: 'Krankenversicherung', rv: 'Rentenversicherung', 
        alv: 'Arbeitslosenversicherung', pv: 'Pflegeversicherung'
      },
      en: {
        brutto: 'Gross', netto: 'Net', lohnsteuer: 'Income Tax', soli: 'Solidarity Surcharge', 
        kirche: 'Church Tax', kv: 'Health Insurance', rv: 'Pension Insurance', 
        alv: 'Unemployment Insurance', pv: 'Care Insurance'
      },
      es: {
        brutto: 'Bruto', netto: 'Neto', lohnsteuer: 'Impuesto sobre la Renta', soli: 'Recargo de Solidaridad', 
        kirche: 'Impuesto Eclesiástico', kv: 'Seguro de Salud', rv: 'Seguro de Pensiones', 
        alv: 'Seguro de Desempleo', pv: 'Seguro de Cuidados'
      }
    };
    return translations[currentLanguage] || translations.de;
  };

  const t = getCurrentTranslations();

  // List of result keys and their labels with info keys
  const keys = [
    { key: 'brutto', label: t.brutto, infoKey: 'gross' },
    { key: 'netto', label: t.netto, infoKey: 'net' },
    { key: 'lohnsteuer', label: t.lohnsteuer, infoKey: 'incomeTax' },
    { key: 'soli', label: t.soli, infoKey: 'solidarity' },
    { key: 'kirche', label: t.kirche, infoKey: 'churchTax' },
    { key: 'kv', label: t.kv, infoKey: 'healthInsurance' },
    { key: 'rv', label: t.rv, infoKey: 'pensionInsurance' },
    { key: 'alv', label: t.alv, infoKey: 'unemploymentInsurance' },
    { key: 'pv', label: t.pv, infoKey: 'careInsurance' }
  ];

  // Render monthly
  const monthlyBreakdown = document.getElementById('monthlyBreakdown');
  if (monthlyBreakdown) {
    monthlyBreakdown.innerHTML = keys.map(({ key, label, infoKey }) =>
      `<div><span>${label}: <span class="info-btn" data-key="${infoKey}">?</span></span> <span>${euro(monthly[key])}</span></div>`
    ).join('');
  } else {
    console.warn('monthlyBreakdown element not found');
  }

  // Render yearly
  const yearlyBreakdown = document.getElementById('yearlyBreakdown');
  if (yearlyBreakdown) {
    yearlyBreakdown.innerHTML = keys.map(({ key, label, infoKey }) =>
      `<div><span>${label}: <span class="info-btn" data-key="${infoKey}">?</span></span> <span>${euro(yearly[key])}</span></div>`
    ).join('');
  } else {
    console.warn('yearlyBreakdown element not found');
  }

  // Add event listeners for info buttons
  setupInfoButtons();
}

// Function to set up info button event listeners
function setupInfoButtons() {
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent any parent element click events
      const key = btn.getAttribute('data-key');
      const currentLanguage = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
      const salaryInfoTexts = window.salaryInfoTexts || {};
      const infoText = salaryInfoTexts[key]?.[currentLanguage] || 'Keine Information verfügbar.';
      alert(infoText);
    });
  });
}

// Make setupInfoButtons available globally
window.setupInfoButtons = setupInfoButtons;

window.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing...');
  
  // Test if calculation functions are available
  console.log('Testing calculation functions...');
  try {
    const testResult = calculateIncomeTax2025(30000);
    console.log('calculateIncomeTax2025 test result:', testResult);
  } catch (error) {
    console.error('Error testing calculation functions:', error);
  }
  
  // Initialize language system
  if (window.initLanguage) {
    window.initLanguage();
    console.log('Language system initialized');
  } else {
    console.error('initLanguage function not found');
  }
  
  // Add language selector event listeners
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      if (window.setLanguage) {
        window.setLanguage(lang);
        console.log('Language set to:', lang);
      }
    });
  });
  
  const form = document.getElementById('salary-form');
  if (!form) {
    console.error('Form with id "salary-form" not found!');
    return;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Form submitted');

    // Read values from form
    const grossIncomeInput = document.getElementById('grossIncome');
    if (!grossIncomeInput) {
      console.error('grossIncome input not found');
      return;
    }
    const grossIncome = parseFloat(grossIncomeInput.value) || 0;
    console.log('Gross income:', grossIncome);
    
    const incomePeriod = document.getElementById('incomePeriod').value;
    const isMarried = document.getElementById('isMarried').checked;
    const isSingleParent = document.getElementById('isSingleParent').checked;
    const numChildren = parseInt(document.getElementById('numChildren').value, 10) || 0;
    const isChurchMember = document.getElementById('isChurchTax').checked;
    const isPrivatelyInsured = document.getElementById('isPrivatelyInsured').checked;
    const isInSaxony = document.getElementById('isInSaxony').checked;
    const healthZusatzbeitrag = parseFloat(document.getElementById('zusatzbeitrag').value) || 2.5;

    console.log('Form values read successfully');
    
    // Determine church region (for demo, always 'OTHER', but could be a select in future)
    const churchRegion = 'OTHER';

    // Convert to yearly if needed
    const annualGrossIncome = incomePeriod === 'monthly' ? grossIncome * 12 : grossIncome;
    console.log('Annual gross income:', annualGrossIncome);

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
    console.log('Inputs:', inputs);

    // Call calculation function
    const results = calculateResults(inputs);
    console.log('Calculation results:', results);
    renderResults(results);
  });
});

function calculateResults(inputs) {
  console.log('calculateResults called with:', inputs);
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
  console.log('Allowances:', allowances, 'Taxable income:', taxableIncome);

  // Calculate deductions
  const lohnsteuer = calculateIncomeTax2025(taxableIncome);
  const soli = calculateSolidaritySurcharge2025(lohnsteuer, isMarried);
  const kirche = calculateChurchTax2025({ incomeTax: lohnsteuer, isChurchMember, region: churchRegion });
  const rv = calculatePensionContribution2025(annualGrossIncome);
  const alv = calculateUnemploymentContribution2025(annualGrossIncome);
  const kv = calculateHealthInsuranceContribution2025(annualGrossIncome, { zusatzbeitrag: healthZusatzbeitrag, isPrivatelyInsured });
  const pv = calculateNursingCareContribution2025(annualGrossIncome, { numChildren, isInSaxony });
  console.log('Deductions - Lohnsteuer:', lohnsteuer, 'Soli:', soli, 'Kirche:', kirche, 'RV:', rv, 'ALV:', alv, 'KV:', kv, 'PV:', pv);

  // Total deductions
  const totalDeductions = lohnsteuer + soli + kirche + rv + alv + kv + pv;
  const netto = annualGrossIncome - totalDeductions;
  console.log('Total deductions:', totalDeductions, 'Net income:', netto);

  // Return yearly and monthly breakdowns
  const result = {
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
  console.log('Final result object:', result);
  return result;
}
