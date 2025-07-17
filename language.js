// Language system for the salary calculator
const translations = {
  de: {
    title: "Netto Gehaltsrechner 2025",
    grossIncome: "Bruttoeinkommen (€):",
    period: "Zeitraum:",
    monthly: "Monatlich",
    yearly: "Jährlich",
    married: "Verheiratet",
    singleParent: "Alleinerziehend",
    churchTax: "Kirchensteuerpflichtig",
    privateInsurance: "Privat versichert",
    livesInSaxony: "Wohnhaft in Sachsen",
    numChildren: "Anzahl Kinder (0–10):",
    zusatzbeitrag: "Zusatzbeitrag (%):",
    calculate: "Berechnen",
    results: "Ergebnisse",
    monthlyResults: "Monatlich",
    yearlyResults: "Jährlich",
    brutto: "Brutto",
    netto: "Netto",
    lohnsteuer: "Lohnsteuer",
    soli: "Soli",
    kirche: "Kirchensteuer",
    kv: "Krankenversicherung",
    rv: "Rentenversicherung",
    alv: "Arbeitslosenversicherung",
    pv: "Pflegeversicherung",
    disclaimer: "Haftungsausschluss: Dieser Rechner dient nur zur groben Orientierung und ersetzt keine professionelle Steuerberatung. Alle Berechnungen erfolgen ohne Gewähr. Die tatsächlichen Steuer- und Sozialversicherungsabgaben können abweichen."
  },
  en: {
    title: "Net Salary Calculator 2025",
    grossIncome: "Gross Income (€):",
    period: "Period:",
    monthly: "Monthly",
    yearly: "Yearly",
    married: "Married",
    singleParent: "Single Parent",
    churchTax: "Church Tax Liable",
    privateInsurance: "Privately Insured",
    livesInSaxony: "Lives in Saxony",
    numChildren: "Number of Children (0–10):",
    zusatzbeitrag: "Additional Contribution (%):",
    calculate: "Calculate",
    results: "Results",
    monthlyResults: "Monthly",
    yearlyResults: "Yearly",
    brutto: "Gross",
    netto: "Net",
    lohnsteuer: "Income Tax",
    soli: "Solidarity Surcharge",
    kirche: "Church Tax",
    kv: "Health Insurance",
    rv: "Pension Insurance",
    alv: "Unemployment Insurance",
    pv: "Care Insurance",
    disclaimer: "Disclaimer: This calculator serves only as a rough guide and does not replace professional tax advice. All calculations are provided without warranty. Actual tax and social security contributions may differ."
  },
  es: {
    title: "Calculadora de Salario Neto 2025",
    grossIncome: "Ingreso Bruto (€):",
    period: "Período:",
    monthly: "Mensual",
    yearly: "Anual",
    married: "Casado/a",
    singleParent: "Padre/Madre Soltero/a",
    churchTax: "Sujeto a Impuesto Eclesiástico",
    privateInsurance: "Seguro Privado",
    livesInSaxony: "Reside en Sajonia",
    numChildren: "Número de Hijos (0–10):",
    zusatzbeitrag: "Contribución Adicional (%):",
    calculate: "Calcular",
    results: "Resultados",
    monthlyResults: "Mensual",
    yearlyResults: "Anual",
    brutto: "Bruto",
    netto: "Neto",
    lohnsteuer: "Impuesto sobre la Renta",
    soli: "Recargo de Solidaridad",
    kirche: "Impuesto Eclesiástico",
    kv: "Seguro de Salud",
    rv: "Seguro de Pensiones",
    alv: "Seguro de Desempleo",
    pv: "Seguro de Cuidados",
    disclaimer: "Descargo de responsabilidad: Esta calculadora sirve solo como guía aproximada y no reemplaza el asesoramiento fiscal profesional. Todos los cálculos se proporcionan sin garantía. Las contribuciones reales de impuestos y seguridad social pueden diferir."
  }
};

let currentLanguage = 'de';

function setLanguage(lang) {
  currentLanguage = lang;
  updatePageContent();
  localStorage.setItem('selectedLanguage', lang);
  
  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
}

function updatePageContent() {
  const t = translations[currentLanguage];
  
  // Update all elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (t[key]) {
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = t[key];
      } else {
        element.textContent = t[key];
      }
    }
  });
}

function initLanguage() {
  // Load saved language or default to German
  const savedLang = localStorage.getItem('selectedLanguage') || 'de';
  setLanguage(savedLang);
}

// Export functions for use in other files
window.setLanguage = setLanguage;
window.initLanguage = initLanguage;
window.getCurrentLanguage = () => currentLanguage;

//---------------------------------------------------------------------------------------
// Help box
//---------------------------------------------------------------------------------------

const salaryInfoTexts = {
  gross: {
    de: "Bruttogehalt ist das Einkommen vor Steuern und Sozialabgaben.",
    en: "Gross income is the amount before taxes and social contributions.",
    es: "El ingreso bruto es la cantidad antes de impuestos y contribuciones sociales."
  },
  net: {
    de: "Nettogehalt ist das Einkommen nach Abzug aller Steuern und Sozialabgaben.",
    en: "Net income is the amount after taxes and social contributions are deducted.",
    es: "El ingreso neto es la cantidad después de deducir impuestos y contribuciones sociales."
  },
  incomeTax: {
    de: "Die Lohnsteuer richtet sich nach Steuerklasse und Einkommen. Bis 12.096 € im Jahr steuerfrei. Progressiver Anstieg bis zu 45%.",
    en: "Income tax depends on tax class and income. Up to €12,096 is tax-free. Progressively increases up to 45%.",
    es: "El impuesto sobre la renta depende de la clase fiscal y del ingreso. Hasta €12,096 está libre de impuestos. Aumenta progresivamente hasta el 45%."
  },
  solidarity: {
    de: "Der Solidaritätszuschlag beträgt 5,5 % der Lohnsteuer. Die meisten zahlen ihn nicht mehr (Freigrenze: 19.950 € Steuer).",
    en: "The solidarity surcharge is 5.5% of income tax. Most people no longer pay it (exempt up to €19,950 tax).",
    es: "El recargo de solidaridad es del 5.5% del impuesto sobre la renta. La mayoría ya no lo paga (exención hasta €19,950 de impuesto)."
  },
  churchTax: {
    de: "Die Kirchensteuer beträgt 8 % (BY/BW) bzw. 9 % (restliche Bundesländer) der Lohnsteuer. Nur für Kirchenmitglieder.",
    en: "Church tax is 8% (BY/BW) or 9% (rest of Germany) of income tax. Only applies to church members.",
    es: "El impuesto eclesiástico es del 8% (BY/BW) o del 9% (resto de Alemania) del impuesto sobre la renta. Solo para miembros de la iglesia."
  },
  healthInsurance: {
    de: "Gesetzliche Krankenversicherung: 7,3 % plus Zusatzbeitrag (durchschnittlich 1,25 %) vom Arbeitnehmer. Bis 66.150 € beitragspflichtig.",
    en: "Statutory health insurance: 7.3% plus Zusatzbeitrag (avg. 1.25%) paid by the employee. Capped at €66,150 income.",
    es: "Seguro médico obligatorio: 7.3% más un suplemento (prom. 1.25%) a cargo del empleado. Límite: €66,150 de ingresos."
  },
  pensionInsurance: {
    de: "Die Rentenversicherung beträgt 9,3 % des Bruttogehalts. Beiträge nur bis zu 96.600 € pro Jahr.",
    en: "Pension insurance is 9.3% of gross salary. Contributions apply only up to €96,600 per year.",
    es: "La contribución a la pensión es del 9.3% del salario bruto. Aplica hasta €96,600 por año."
  },
  unemploymentInsurance: {
    de: "Arbeitslosenversicherung: 1,3 % vom Bruttoeinkommen, gedeckelt bei 96.600 € im Jahr.",
    en: "Unemployment insurance: 1.3% of gross income, capped at €96,600 per year.",
    es: "Seguro de desempleo: 1.3% del ingreso bruto, con un tope de €96,600 al año."
  },
  careInsurance: {
    de: "Pflegeversicherung: 1,8 % (mit Kind), 2,4 % (kinderlos). Reduktionen bei mehreren Kindern. Sachsen zahlt mehr.",
    en: "Nursing care insurance: 1.8% (with child), 2.4% (childless). Reduced with multiple kids. Higher rate in Saxony.",
    es: "Seguro de cuidados: 1.8% (con hijos), 2.4% (sin hijos). Reducciones con hijos múltiples. Tasa mayor en Sajonia."
  }
};

// Make salaryInfoTexts available globally
window.salaryInfoTexts = salaryInfoTexts;
