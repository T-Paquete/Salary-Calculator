
import { calcAll } from './calculations.js';

const grossEl = document.getElementById('gross');
const langEl  = document.getElementById('lang');
const btn     = document.getElementById('calculate-btn');
const periodBtns = document.querySelectorAll('.period-btn');

let currentPeriod = 'monthly';

const outIds = ['incomeTax','soli','church','health','pension','unemployment','care'];

const texts = {
  de: { 
    title: 'Netto-Gehaltsrechner',
    gross: 'Dein Brutto beträgt',
    net: 'Dein Netto beträgt',  
    incomeTax: 'Lohnsteuer', 
    soli: 'Solidaritätszuschlag', 
    church: 'Kirchensteuer', 
    health: 'Krankenversicherung', 
    pension: 'Rentenversicherung', 
    unemployment: 'Arbeitslosenvers.', 
    care: 'Pflegeversicherung',
    monthly: 'Monatlich',
    yearly: 'Jährlich', 
    calculate: 'Berechnen',
    placeholder: 'Bruttogehalt €',
    deductions: 'Abzüge:',
    disclaimer: 'Dies ist ein vereinfachter Rechner nur zu Demonstrationszwecken. Echte deutsche Steuerberechnungen sind komplexer und können je nach individuellen Umständen variieren.'
  },
  en: { 
    title: 'Net Salary Calculator',
    gross: 'Your gross salary is',
    net: 'Your net salary is', 
    incomeTax: 'Income tax',  
    soli: 'Solidarity surcharge', 
    church: 'Church tax',      
    health: 'Health insurance', 
    pension: 'Pension insurance', 
    unemployment: 'Unemployment ins.', 
    care: 'Nursing care ins.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    calculate: 'Calculate',
    placeholder: 'Gross salary €',
    deductions: 'Deductions:',
    disclaimer: 'This is a simplified calculator for demonstration purposes only. Real German tax calculations are more complex and may vary based on individual circumstances.'
  },
  es: { 
    title: 'Calculadora de Salario Neto',
    gross: 'Tu salario bruto es',
    net: 'Tu sueldo neto es',  
    incomeTax: 'Impuesto sobre la renta', 
    soli: 'Suplemento de solidaridad', 
    church: 'Impuesto eclesiástico', 
    health: 'Seguro médico', 
    pension: 'Seguro de pensión', 
    unemployment: 'Seguro de desempleo', 
    care: 'Seguro de cuidados',
    monthly: 'Mensual',
    yearly: 'Anual',
    calculate: 'Calcular', 
    placeholder: 'Salario bruto €',
    deductions: 'Deducciones:',
    disclaimer: 'Esta es una calculadora simplificada solo para fines de demostración. Los cálculos reales de impuestos alemanes son más complejos y pueden variar según las circunstancias individuales.'
  }
};

function updateUI() {
  const t = texts[langEl.value];
  
  // Update title and main UI elements
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('disclaimer').textContent = t.disclaimer;
  
  // Update period buttons
  document.getElementById('monthly-btn').textContent = t.monthly;
  document.getElementById('yearly-btn').textContent = t.yearly;
  
  // Update period column titles
  document.getElementById('monthly-title').textContent = t.monthly;
  document.getElementById('yearly-title').textContent = t.yearly;
  
  // Update other UI elements
  btn.textContent = t.calculate;
  grossEl.placeholder = t.placeholder;
  document.getElementById('deductions-title').textContent = t.deductions;
}

function updatePeriodVisibility() {
  // Always show both monthly and yearly columns
  const monthlyCol = document.getElementById('period-monthly');
  const yearlyCol = document.getElementById('period-yearly');
  
  monthlyCol.style.display = 'block';
  yearlyCol.style.display = 'block';
}

function setPeriod(period) {
  currentPeriod = period;
  
  // Update active button
  periodBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });
  
  // Update period visibility
  updatePeriodVisibility();
  
  // Re-render if there's data
  if (grossEl.value) {
    render();
  }
}

function render() {
  const grossValue = grossEl.value;
  if (!grossValue) return;

  const t = texts[langEl.value];
  
  // Calculate all periods from the input
  const allData = calcAll(grossValue, currentPeriod);
  if (!allData) return;
  
  // Update gross and net for each period column
  const periods = [
    { data: allData.monthly, suffix: '-monthly' },
    { data: allData.yearly, suffix: '-yearly' }
  ];
  
  periods.forEach(({ data, suffix }) => {
    if (data) {
      // Update gross and net for this period
      const grossElement = document.getElementById('gross' + suffix);
      const netElement = document.getElementById('net' + suffix);
      
      if (grossElement) {
        grossElement.textContent = `${t.gross}: ${data.gross} €`;
      }
      if (netElement) {
        netElement.textContent = `${t.net}: ${data.net} €`;
      }
      
      // Update deductions for this period
      outIds.forEach(id => {
        const element = document.getElementById(id + suffix);
        if (element) {
          element.textContent = `${t[id]}: ${data[id]} €`;
        }
      });
    }
  });
}

// Event listeners
btn.addEventListener('click', render);
langEl.addEventListener('change', () => {
  updateUI();
  render();
});
grossEl.addEventListener('input', () => btn.disabled = !grossEl.value);

periodBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setPeriod(btn.dataset.period);
  });
});

// Initialize UI
updateUI();
updatePeriodVisibility();


// --- Configuration -----------------------------------------------------------
const RATES = {
  incomeTax: 0.14,      // 14 % of gross
  soli: 0.055,          // 5.5 % of income tax
  church: 0.08,         // 8 %  of income tax
  health: 0.073,        // 7.3 % of gross
  pension: 0.093,       // 9.3 % of gross
  unemployment: 0.012,  // 1.2 % of gross
  care: 0.01525         // 1.525 % of gross
};

// --- Helpers -----------------------------------------------------------------
/**
 * Round to two decimal places (banker‑style rounding).
 * @param {number} value
 * @returns {number}
 */
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// --- Core API ----------------------------------------------------------------
/**
 * Calculate net salary from a given gross salary.
 *
 * @param {number|string} grossInput
 * @returns {number}
 */
export function calculateNetSalary(grossInput) {
  const gross = parseFloat(grossInput);
  if (isNaN(gross) || gross < 0) return 0;

  // Step 1: income‑tax‑based deductions
  const incomeTax = gross * RATES.incomeTax;
  const soli      = incomeTax * RATES.soli;
  const church    = incomeTax * RATES.church;

  // Step 2: gross‑based social contributions
  const health        = gross * RATES.health;
  const pension       = gross * RATES.pension;
  const unemployment  = gross * RATES.unemployment;
  const care          = gross * RATES.care;

  const totalDeductions = incomeTax + soli + church +
                          health + pension + unemployment + care;

  return round2(gross - totalDeductions);
}

/**
 * Build a localized sentence that contains the net salary.
 *
 * @param {number|string} grossInput   Gross salary in EUR
 * @param {string}        lang         ISO‑like code: "de", "en", "es"
 * @returns {string}                   Sentence in the chosen language.
 */
export function netSentence(grossInput, lang = "de") {
  const net = calculateNetSalary(grossInput).toFixed(2);

  switch (lang) {
    case "en":
      return `Your net salary is ${net} €.`;
    case "es":
      return `Tu sueldo neto es ${net} €.`;
    case "de":
    default:
      return `Dein Netto beträgt ${net} €.`;
  }
}

// Optional default export (handy for consumers who prefer a single import)
export default { calculateNetSalary, netSentence };
