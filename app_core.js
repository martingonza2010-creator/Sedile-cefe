// --- EMERGENCY ERROR HANDLER & UNHANDLED REJECTIONS ---
window.onerror = function (msg, url, line, col, error) {
    alert("⚠️  Error de Script (V3.6): " + msg + "\nLínea: " + line);
    console.error(error);
    return false;
};

window.addEventListener('unhandledrejection', function (event) {
    console.error('⚠️ Unhandled Promise Rejection:', event.reason);
    const reason = event.reason;
    const msg = reason ? (reason.message || reason) : 'Error desconocido en Promesa';
    const stack = reason ? (reason.stack || '') : '';
    alert("⚠️  Error de Promesa (V4.52):\n" + msg + "\n\n" + stack);
});

// --- 1. DATE UTILITIES & AUTO-MASK FOR SPANISH FORMAT ---
window.parseSpanishDate = function(val) {
    if (!val) return null;
    let parts;
    if (val.includes('/')) {
        parts = val.split('/');
        if (parts.length === 3) {
            const d = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);
            if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                const birth = new Date(y, m - 1, d);
                birth.setHours(0,0,0,0);
                return birth;
            }
        }
    } else if (val.includes('-')) {
        parts = val.split('-');
        if (parts.length === 3) {
            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const d = parseInt(parts[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                const birth = new Date(y, m - 1, d);
                birth.setHours(0,0,0,0);
                return birth;
            }
        }
    }
    return null;
};

window.formatDateInput = function(input) {
    let val = input.value;
    let cursor = input.selectionStart;
    
    // We only allow digits and slashes
    let cleanVal = val.replace(/[^0-9/]/g, '');
    
    // Split into parts by '/'
    let parts = cleanVal.split('/');
    
    // If there are more than 3 parts, merge the extra ones
    if (parts.length > 3) {
        parts = [parts[0], parts[1], parts.slice(2).join('')];
    }
    
    // Clean and limit each part
    if (parts[0] !== undefined) {
        let d = parts[0].replace(/\D/g, '').substring(0, 2);
        if (d.length === 2) {
            let dVal = parseInt(d, 10);
            if (dVal > 31) d = '31';
            else if (dVal === 0) d = '01';
        }
        parts[0] = d;
    }
    
    if (parts[1] !== undefined) {
        let m = parts[1].replace(/\D/g, '').substring(0, 2);
        if (m.length === 2) {
            let mVal = parseInt(m, 10);
            if (mVal > 12) m = '12';
            else if (mVal === 0) m = '01';
        }
        parts[1] = m;
    }
    
    if (parts[2] !== undefined) {
        let y = parts[2].replace(/\D/g, '').substring(0, 4);
        parts[2] = y;
    }
    
    // Auto-advance/insert slashes as they type forward!
    if (!input._lastVal) input._lastVal = "";
    let isDeleting = val.length < input._lastVal.length;
    
    if (!isDeleting) {
        if (parts[0] && parts[0].length === 2 && parts.length === 1) {
            parts.push('');
        }
        if (parts[1] && parts[1].length === 2 && parts.length === 2) {
            parts.push('');
        }
    }
    
    // Reconstruct newVal
    let newVal = parts.join('/');
    
    if (newVal.length > 10) {
        newVal = newVal.substring(0, 10);
    }
    
    input.value = newVal;
    input._lastVal = newVal;
    
    // Restore cursor position
    if (newVal.length > val.length && newVal.charAt(cursor) === '/') {
        cursor++;
    }
    input.setSelectionRange(cursor, cursor);
};

// --- SEDILE HRA V2.5 AUTH FIX - Build 20260128-1748 ---
// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://qibkmvtbgauobedtjapg.supabase.co';
const supabaseKey = 'sb_publishable_xCxGjcAngmfd0hJYv2uphg_yB-pF3Hp';
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// --- 2. DATABASE (Vademécum HRA & RTH) ---
const LOCAL_FORMULAS = [
    // --- FÓRMULAS EN POLVO ---
    { cat: "Fórmulas en Polvo", id: "nan_comfort", name: "NAN ExpertPro Comfort", type: "p", k: 511, p: 9.8, c: 59.1, f: 26.1, lipids_profile: { dha: 48, ara: 48, cholesterol: 35 }, minerals: { na: 190, k: 520, cl: 610, ca: 330, p: 180, mg: 50, mn: 0.09, se: 0.009, fe: 4.9, i: 0.065, cu: 0.40, zn: 4.8 } },
    { cat: "Fórmulas en Polvo", id: "nan_1", name: "NAN 1", type: "p", k: 519, p: 9.6, c: 57.3, f: 27.7, lipids_profile: { dha: 60, ara: 60, cholesterol: 22 }, minerals: { na: 240, k: 520, cl: 300, ca: 300, p: 180, mg: 56, mn: 0.09, se: 0.018, fe: 5.9, i: 0.105, cu: 0.45, zn: 3.3 } },
    { cat: "Fórmulas en Polvo", id: "nido_1", name: "Nido +1", type: "p", k: 469, p: 12.0, c: 56.2, f: 20.0, lipids_profile: { dha: 0, ara: 0, cholesterol: 25 }, minerals: { na: 160, k: 540, cl: 0, ca: 650, p: 250, mg: 50, mn: 0, se: 0.012, fe: 6.8, i: 0, cu: 0, zn: 4.5 } },
    { cat: "Fórmulas en Polvo", id: "alfamino", name: "Alfamino", type: "p", k: 496, p: 13.3, c: 55.41, f: 24.6, lipids_profile: { dha: 70, ara: 70, cholesterol: 1 }, minerals: { na: 210, k: 550, cl: 405, ca: 540, p: 360, mg: 50, mn: 0.0725, se: 0.0092, fe: 5.0, i: 0.0825, cu: 0.40, zn: 5.0 } },
    { cat: "Fórmulas en Polvo", id: "althera", name: "Althera", type: "p", k: 504, p: 11.0, c: 56.0, f: 26.0, lipids_profile: { dha: 135, ara: 135, cholesterol: 0 }, minerals: { na: 195, k: 580, cl: 400, ca: 530, p: 350, mg: 45, mn: 0, se: 0.025, fe: 6.1, i: 0.122, cu: 0.41, zn: 4.3 } },
    { cat: "Fórmulas en Polvo", id: "similac_total_comfort", name: "Similac Total Comfort", type: "p", k: 510, p: 11.7, c: 53.0, f: 27.5, lipids_profile: { dha: 53, ara: 105, cholesterol: 0 }, minerals: { na: 226, k: 737, cl: 406, ca: 534, p: 384, mg: 38.4, mn: 0.098, se: 0.0181, fe: 6.3, i: 0.0993, cu: 0.38, zn: 4.1 } },
    { cat: "Fórmulas en Polvo", id: "neocate", name: "Neocate", type: "p", k: 483, p: 14.0, c: 52.0, f: 25.0, lipids_profile: { dha: 69, ara: 69, cholesterol: 0 }, minerals: { na: 189, k: 525, cl: 386, ca: 561, p: 397, mg: 51, mn: 0.20, se: 0.015, fe: 7.3, i: 0.10, cu: 0.41, zn: 5.3 } },
    { cat: "Fórmulas en Polvo", id: "nutrilon_pepti_junior", name: "Nutrilon Pepti Junior", type: "p", k: 515, p: 14.0, c: 53.0, f: 27.0, lipids_profile: { dha: 52, ara: 0, cholesterol: 0 }, minerals: { na: 140, k: 507, cl: 310, ca: 390, p: 218, mg: 40, mn: 0.244, se: 0.014, fe: 6.0, i: 0.093, cu: 0.314, zn: 3.9 } },
    { cat: "Fórmulas en Polvo", id: "pediasure_polvo", name: "Pediasure (Polvo)", type: "p", k: 464, p: 13.9, c: 60.7, f: 18.1, lipids_profile: { dha: 21, ara: 0, cholesterol: 0 }, minerals: { na: 176, k: 606, cl: 469, ca: 463, p: 388, mg: 91.7, mn: 0.69, se: 0.0148, fe: 6.5, i: 0.0449, cu: 0.30, zn: 3.1 } },
    { cat: "Fórmulas en Polvo", id: "lactantes_consultorio", name: "Fórmula Lactantes (Consultorio)", type: "p", k: 495, p: 13.0, c: 57.7, f: 23.6, lipids_profile: { dha: 0, ara: 0, cholesterol: 0 }, minerals: { na: 200, k: 550, cl: 270, ca: 350, p: 185, mg: 50, mn: 0.10, se: 0.01, fe: 5.4, i: 0.09, cu: 0.30, zn: 3.1 } },
    { cat: "Fórmulas en Polvo", id: "monogen", name: "Monogen", type: "p", k: 441, p: 12.8, c: 68.6, f: 12.9, lipids_profile: { dha: 0.06, ara: 0, cholesterol: 0 }, minerals: { na: 210, k: 397, cl: 301, ca: 365, p: 220, mg: 44, mn: 0.031, se: 0.0172, fe: 6.63, i: 0.0885, cu: 0.36, zn: 4.56 } },
    { cat: "Fórmulas en Polvo", id: "prenan", name: "Prenan", type: "p", k: 507, p: 12.5, c: 54.5, f: 26.6, lipids_profile: { dha: 90, ara: 90, cholesterol: 0 }, minerals: { na: 250, k: 570, cl: 335, ca: 558, p: 320, mg: 59, mn: 0.085, se: 0.015, fe: 5.1, i: 0.11, cu: 0.39, zn: 5.7 } },
    { cat: "Fórmulas en Polvo", id: "nan_sin_lactosa", name: "NAN Sin Lactosa", type: "p", k: 506, p: 10.4, c: 58.5, f: 25.6, lipids_profile: { dha: 42, ara: 42, cholesterol: 30 }, minerals: { na: 160, k: 480, cl: 340, ca: 280, p: 160, mg: 43, mn: 0.07, se: 0.009, fe: 5.0, i: 0.062, cu: 0.34, zn: 2.8 } },
    { cat: "Fórmulas en Polvo", id: "fortificador_leche_materna", name: "Fortificador Leche Materna", type: "p", k: 435, p: 35.5, c: 32.4, f: 4.2, lipids_profile: { dha: 157, ara: 0, cholesterol: 0 }, minerals: { na: 918, k: 1210, cl: 803, ca: 1890, p: 1095, mg: 100, mn: 0.185, se: 0.085, fe: 45.0, i: 0.39, cu: 1.3, zn: 23.5 } },
    
    // --- FÓRMULAS LÍQUIDAS / ESPECIALES ---
    { cat: "Leches HRA", id: "alprem_liquido", name: "Alprem (100ml)", type: "l", k: 142.9, p: 5.1, c: 14.6, f: 7.1, lipids_profile: { dha: 26, ara: 26, cholesterol: 0 }, minerals: { na: 91.4, k: 212.9, cl: 135.4, ca: 207.1, p: 137.3, mg: 14.9, mn: 0.0223, se: 0.0086, fe: 3.29, i: 0.0501, cu: 0.1429, zn: 2.14 } },

    // --- RECETAS (LECHES HRA) ---
    { cat: "Leches HRA", id: "e1", name: "E1", type: "l", stdDil: 22, k: 94.2, p: 3.5, c: 12.6, f: 3.1, minerals: {} },
    {
        cat: "Leches HRA", id: "e2", name: "E2", type: "recipe", recipe: [
            { id: "comp_ensure", name: "Ensure", defPct: 22, k: 428.18, p: 15.9, c: 57.27, f: 14.09 },
            { id: "comp_proteinex", name: "Proteinex", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 }
        ], minerals: {}
    },
    {
        cat: "Leches HRA", id: "e3", name: "E3", type: "recipe", recipe: [
            { id: "comp_ensure", name: "Ensure", defPct: 22, k: 428.18, p: 15.9, c: 57.27, f: 14.09 },
            { id: "comp_proteinex", name: "Proteinex", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 },
            { id: "comp_nessucar", name: "Nessucar", defPct: 5, k: 380.0, p: 0.0, c: 96.0, f: 0.0 }
        ], minerals: {}
    },
    {
        cat: "Leches HRA", id: "e4", name: "E4 (Espesado)", type: "recipe", recipe: [
            { id: "comp_ensure", name: "Ensure", defPct: 22, k: 428.18, p: 15.9, c: 57.27, f: 14.09 },
            { id: "comp_proteinex", name: "Proteinex", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 },
            { id: "comp_nessucar", name: "Nessucar", defPct: 5, k: 380.0, p: 0.0, c: 96.0, f: 0.0 }
        ], minerals: {}
    },
    { cat: "Leches HRA", id: "g1", name: "G1", type: "l", stdDil: 20, k: 95.3, p: 4.3, c: 9.1, f: 3.5, minerals: {} },
    {
        cat: "Leches HRA", id: "g2", name: "G2", type: "recipe", recipe: [
            { id: "comp_vivalitegold", name: "Vivalite Gold", defPct: 20, k: 476.5, p: 21.5, c: 45.5, f: 17.5 },
            { id: "comp_proteinex", name: "Proteinex", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 }
        ], minerals: {}
    },
    {
        cat: "Leches HRA", id: "g3", name: "G3", type: "recipe", recipe: [
            { id: "comp_vivalitegold", name: "Vivalite Gold", defPct: 20, k: 476.5, p: 21.5, c: 45.5, f: 17.5 },
            { id: "comp_proteinex", name: "Proteinex", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 },
            { id: "comp_nessucar", name: "Nessucar", defPct: 5, k: 380.0, p: 0.0, c: 96.0, f: 0.0 }
        ], minerals: {}
    },
    {
        cat: "Leches HRA", id: "g4", name: "G4 (Espesado)", type: "recipe", recipe: [
            { id: "comp_vivalitegold", name: "Vivalite Gold", defPct: 20, k: 476.5, p: 21.5, c: 45.5, f: 17.5 },
            { id: "comp_proteinex", name: "Proteinex", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 },
            { id: "comp_nessucar", name: "Nessucar", defPct: 5, k: 380.0, p: 0.0, c: 96.0, f: 0.0 }
        ], minerals: {}
    },

    // --- FÓRMULAS RTH (ADULTO ENTERAL) ---
    { cat: "Fórmulas RTH", id: "osmolite", name: "Osmolite", type: "l", volBase: 1000, k: 100.0, p: 4.0, c: 13.6, f: 3.4, minerals: {} },
    { cat: "Fórmulas RTH", id: "glucerna_15", name: "Glucerna 1.5", type: "l", volBase: 1000, k: 150.0, p: 7.5, c: 12.76, f: 7.5, minerals: {} },
    { cat: "Fórmulas RTH", id: "diben_15", name: "Diben 1.5 Kcal", type: "l", volBase: 1000, k: 150.0, p: 7.5, c: 13.1, f: 7.0, minerals: {} },
    { cat: "Fórmulas RTH", id: "jevity_1", name: "Jevity 1.0 (1000ml)", type: "l", volBase: 1000, k: 106.0, p: 4.4, c: 15.1, f: 3.4, minerals: {} },
    { cat: "Fórmulas RTH", id: "fresubin_fibre", name: "Fresubin Original Fibre", type: "l", volBase: 500, k: 100.0, p: 3.8, c: 13.0, f: 3.4, minerals: {} },
    { cat: "Fórmulas RTH", id: "fresubin_intensive", name: "Fresubin Intensive", type: "l", volBase: 500, k: 122.0, p: 10.0, c: 12.9, f: 3.2, minerals: {} },
    { cat: "Fórmulas RTH", id: "fresubin_2kcal", name: "Fresubin 2 Kcal HP", type: "l", volBase: 500, k: 200.0, p: 10.0, c: 17.5, f: 10.0, minerals: {} },
    { cat: "Fórmulas RTH", id: "ensure_clinical_rth", name: "Ensure Clinical (RTH)", type: "l", volBase: 1000, k: 149.2, p: 8.0, c: 18.0, f: 4.8, minerals: {} },

    // --- BOTELLINES ---
    { cat: "Botellines", id: "ensure_clinical_bot", name: "Ensure Clinical", type: "l", isBotellin: true, volUnit: 220, k: 149.2, p: 8.0, c: 18.0, f: 4.8, minerals: {} },
    { cat: "Botellines", id: "glucerna_shake", name: "Glucerna Shake", type: "l", isBotellin: true, volUnit: 237, k: 93.0, p: 4.6, c: 11.0, f: 3.4, minerals: {} },
    { cat: "Botellines", id: "supportan_drink", name: "Supportan Drink", type: "l", isBotellin: true, volUnit: 200, k: 150.0, p: 10.0, c: 12.4, f: 6.7, minerals: {} },
    { cat: "Botellines", id: "ensure_compact", name: "Ensure Compact", type: "l", isBotellin: true, volUnit: 125, k: 240.0, p: 10.2, c: 28.7, f: 9.4, minerals: {} },
    { cat: "Botellines", id: "pediasure_drink", name: "Pediasure Drink", type: "l", isBotellin: true, volUnit: 200, k: 100.0, p: 3.0, c: 13.1, f: 3.9, minerals: {} }
];

// --- 3. GLOBAL STATE ---
const AppState = {
    user: null,
    patient: { id: null, nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0, ia_report: null },
    formulas: LOCAL_FORMULAS,
    
    favorites: [], // Init empty first
    userOverridesGoal: false,
    compareMode: false,
    adequacyMode: 'goal', // 'goal' or 'get'
    traslape: {
        active: false,
        sourceKcal: 0,
        sourceProt: 0,
        sourceVol: 0,
        pct: 100 // % Enteral
    },
    uun: 4, // Urea Nitrogen in Urine (default factor)
    formulaB: null,
    chart: null
};

// --- DATA STRUCTURES (V3.50/V3.61) ---
const MODULE_DATA = {
    nessucar: { kcal: 380, p: 0, c: 96, f: 0 },
    mct: { kcal: 855, p: 0, c: 0, f: 95 },
    enterex: { kcal: 383, p: 0, c: 95, f: 0 },
    banatrol: { kcal: 372, p: 0, c: 65.11, f: 0 },
    proteinex: { kcal: 357, p: 90, c: 0, f: 0 },
    fresubin: { kcal: 360, p: 87, c: 0, f: 0 }
};

const DRUG_INTERACTIONS = {
    "fenitoina": "⚠️ Separar de la nutrición enteral (NE) al menos 1-2 horas antes y después para evitar reducción en su absorción. Monitorizar niveles séricos.",
    "propofol": "⚠️ Aporta 1.1 kcal/ml de lípidos. Considerar este aporte calórico graso dentro del balance calórico total para evitar sobrealimentación.",
    "omeprazol": "⚠️ Administrar preferentemente en ayunas o 30-60 min antes de la NE para asegurar eficacia. No mezclar directamente con la fórmula.",
    "furosemida": "⚠️ Puede causar hipopotasemia e hipomagnesemia. Monitorizar electrolitos periódicamente si se usa con NE a largo plazo.",
    "levodopa": "⚠️ Las proteínas de la dieta pueden competir con su absorción. Ajustar tiempos de toma si el control motor fluctúa.",
    "warfarina": "⚠️ El contenido de Vitamina K de algunas fórmulas enterales puede interferir con el efecto anticoagulante. Mantener aporte constante.",
    "metformina": "⚠️ Puede causar déficit de B12 con uso prolongado. Considerar suplementación si existen signos clínicos.",
    "cloroquina": "⚠️ Puede causar hipoglicemia severa. Monitorizar glicemia capilar.",
    "ciprofloxacino": "⚠️ La absorción se reduce significativamente con productos lácteos o fórmulas enterales cálcicas. Suspender NE 2h antes/después."
};

// Safely load favorites
try {
    const stored = localStorage.getItem('sedile_favs');
    if (stored) AppState.favorites = JSON.parse(stored);
} catch (e) {
    console.error("Error loading favorites", e);
    AppState.favorites = [];
}

// --- 4. INITIALIZATION & AUTH ---
let macroGoalMode = 'gkg'; // Global macro mode initialized
let goalChartInstance = null; // Global chart instance

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 SEDILE HRA: DOMContentLoaded initialized");

    // --- AUTH REFACTOR V4.30 (Centralized) ---
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log("🔑 Auth Event:", event);
        if (session) {
            AppState.user = session.user;
            // Defer execution using setTimeout to break the call stack and avoid Supabase auth lock deadlock
            setTimeout(() => showApp(), 0);
        } else if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
            setTimeout(async () => {
                const { data } = await supabaseClient.auth.getSession();
                if (data.session) {
                    AppState.user = data.session.user;
                    showApp();
                } else {
                    showLogin();
                }
            }, 0);
        }
    });

    const btnLogin = document.getElementById('btnLoginGoogle');
    if (btnLogin) btnLogin.onclick = login;

    const btnLogoutHeader = document.getElementById('btnLogoutHeader');
    if (btnLogoutHeader) btnLogoutHeader.onclick = logout;

    const safelyInit = (fn, name) => {
        try { fn(); } catch (e) { console.error(`âŒ Init Error (${name}):`, e); }
    };

    safelyInit(initCompactLayout, "CompactLayout");
    safelyInit(initTabNavigation, "TabNavigation");
    safelyInit(initProtocolModal, "ProtocolModal");
    safelyInit(initHistoryModal, "HistoryModal");
    safelyInit(initPatientLogic, "PatientLogic");
    safelyInit(initSimulatorLogic, "SimulatorLogic");
    safelyInit(initInfusionLogic, "InfusionLogic");
    safelyInit(initHydrationLogic, "HydrationLogic");
    safelyInit(initCompareLogic, "CompareLogic");
    safelyInit(initChartSim, "ChartSim");
    safelyInit(initGoalMacroChart, "GoalMacroChart");
    safelyInit(initAssessmentLogic, "AssessmentLogic");
    safelyInit(initEvolutionLogic, "EvolutionLogic");
    safelyInit(initGlobalEvents, "GlobalEvents");
    safelyInit(initNutriIA, "NutriIA");
    safelyInit(initVoiceDictation, "VoiceDictation");
    safelyInit(initWardKanban, "WardKanban");
    safelyInit(initAdminPanel, "AdminPanel");
    safelyInit(updateFormulaSelect, "updateFormulaSelect");
    safelyInit(initFormulaSearch, "initFormulaSearch");
    safelyInit(applyCircularFavicon, "applyCircularFavicon");

    console.log("✅ Initialization complete. Formulas loaded:", AppState.formulas.length);

    // Force repopulating formulas after a delay
    setTimeout(() => {
        const sel = document.getElementById('formulaSelect');
        if (sel && sel.options.length <= 1) {
            console.warn("⚠️  Dropdown empty, retrying updateFormulaSelect...");
            safelyInit(updateFormulaSelect, "retryUpdateFormulaSelect");
        }
    }, 1560);
});

async function applyCircularFavicon() {
    const faviconUrl = 'logo.png';
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw circle clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw image centered
        ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);

        // Update favicon link
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = canvas.toDataURL("image/png");
    };
    img.src = faviconUrl;
}

async function checkUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        AppState.user = session.user;
        showApp();
    } else {
        showLogin();
    }
}

// Make login available globally
window.login = async function () {
    console.log("Intentando login...");

    if (window.location.protocol === 'file:') {
        alert("⚠️ Error: Estás abriendo el archivo localmente (file://). Debes usar Vercel.");
        return;
    }

    if (!supabaseClient) {
        alert("ðŸ”´ Error Crítico: Supabase no se cargó. Revisa tu conexión a internet.");
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
    } catch (err) {
        alert("Error Supabase: " + err.message);
    }
};

window.logout = async function () {
    // 1. Mostrar login e iniciar limpieza de forma inmediata para respuesta visual instantánea
    if (typeof showLogin === 'function') showLogin();
    
    sessionStorage.clear();
    localStorage.clear();
    
    // 2. Ejecutar cierre de sesión en Supabase (no bloqueante)
    try {
        supabaseClient.auth.signOut();
    } catch (e) {
        console.error(e);
    }
    
    // 3. Limpiar service workers y cachés en segundo plano sin bloquear la navegación
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
                registration.unregister();
            }
        });
    }
    
    if ('caches' in window) {
        caches.keys().then(keys => {
            Promise.all(keys.map(key => caches.delete(key)));
        });
    }

    // 4. Redirigir de inmediato al origen limpio (hall de inicio)
    window.location.replace(window.location.origin);
}

async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function showApp(isManualCheck = false) {
    try {
        if (!AppState.user) {
            showLogin();
            return;
        }

        const authScreen = document.getElementById('auth-screen');
        const blockedScreen = document.getElementById('access-blocked-screen');
        const pinLock = document.getElementById('pin-lock-screen');
        const mainApp = document.getElementById('main-app');

        const userEmail = AppState.user?.email || '';
        const userName = AppState.user?.user_metadata?.full_name || AppState.user?.email || 'Colega';
        const isAdmin = userEmail === 'martingonza2010@gmail.com';

        // 1. Mostrar/Ocultar el botón de Administrador en el Header
        const btnAdminPanel = document.getElementById('btnAdminPanel');
        if (btnAdminPanel) {
            btnAdminPanel.style.display = isAdmin ? 'inline-flex' : 'none';
        }

        const isUnlocked = sessionStorage.getItem('sedile_unlocked') === 'true';

        // SI YA ESTÁ DESBLOQUEADO: Mostrar la App principal inmediatamente para evitar pantallas en blanco
        if (isUnlocked) {
            if (authScreen) authScreen.style.display = 'none';
            if (blockedScreen) blockedScreen.style.display = 'none';
            if (pinLock) pinLock.style.display = 'none';
            if (mainApp) mainApp.style.display = 'block';

            if (AppState.user && AppState.user.user_metadata) {
                const name = AppState.user.user_metadata.full_name || AppState.user.email || 'Usuario';
                const displayEl = document.getElementById('userNameDisplay');
                if (displayEl) {
                    displayEl.innerHTML = `Nutricionista <b>${name}</b>`;
                }
            }

            // Si es administrador, ya terminamos, no requiere validación de Supabase adicional
            if (isAdmin) return;
        }

        // CONTROL DE ACCESO (ADMIN APPROVAL FLOW)
        const runAccessCheck = async () => {
            const btnCheckAuth = document.getElementById('btnCheckAuth');
            const feedbackEl = document.getElementById('blockedFeedbackMessage');

            if (isManualCheck) {
                // Mostrar estado visual de carga en el botón
                if (btnCheckAuth) {
                    btnCheckAuth.disabled = true;
                    btnCheckAuth.innerHTML = "⏳ Verificando autorización...";
                    btnCheckAuth.style.opacity = "0.7";
                    btnCheckAuth.style.cursor = "not-allowed";
                }

                // Ocultar feedback anterior
                if (feedbackEl) {
                    feedbackEl.style.display = 'none';
                }
            }

            const restoreButtonState = () => {
                if (btnCheckAuth) {
                    btnCheckAuth.disabled = false;
                    btnCheckAuth.innerHTML = "🔄 Comprobar Autorización";
                    btnCheckAuth.style.opacity = "1";
                    btnCheckAuth.style.cursor = "pointer";
                }
            };

            if (supabaseClient) {
                const { data: records, error: fetchError } = await supabaseClient
                    .from('acceso_usuarios')
                    .select('*')
                    .ilike('email', userEmail);

                if (fetchError) {
                    console.error("Error al consultar control de acceso:", fetchError);
                    // Si ya estaba desbloqueado, no interrumpimos la sesión del usuario por un error temporal de conexión
                    if (isUnlocked) return;

                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.background = '#fde8e8';
                        feedbackEl.style.color = '#e74c3c';
                        feedbackEl.style.borderColor = '#f8b4b4';
                        feedbackEl.innerHTML = `❌ Error de red o base de datos: ${fetchError.message || 'Fallo de conexión'}`;
                    }
                    restoreButtonState();
                    showAccessBlockedScreen(userName, userEmail);
                    return;
                }

                // Priorizar el registro habilitado si hay duplicados por discrepancias de mayúsculas/minúsculas
                const record = (records && records.length > 0)
                    ? (records.find(r => r.acceso_permitido === true) || records[0])
                    : null;

                if (!record) {
                    // Auto-registrar como PENDIENTE
                    const { error: insertError } = await supabaseClient
                        .from('acceso_usuarios')
                        .insert([
                            {
                                email: userEmail,
                                nombre: userName,
                                user_id: AppState.user.id,
                                acceso_permitido: false
                            }
                        ]);

                    if (insertError) {
                        console.error("Error al auto-registrar usuario:", insertError);
                    }

                    if (isUnlocked) {
                        // Si estaba desbloqueado pero se eliminó de la BD, revocamos acceso
                        sessionStorage.removeItem('sedile_unlocked');
                    }

                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.background = '#fef3c7';
                        feedbackEl.style.color = '#d97706';
                        feedbackEl.style.borderColor = '#fcd34d';
                        feedbackEl.innerHTML = `⏳ Solicitud de acceso enviada al Administrador. Por favor, espera su aprobación.`;
                    }
                    restoreButtonState();
                    showAccessBlockedScreen(userName, userEmail);
                    return;
                } else if (!record.acceso_permitido) {
                    if (isUnlocked) {
                        // Si estaba desbloqueado pero ahora fue denegado, revocamos el acceso de inmediato
                        sessionStorage.removeItem('sedile_unlocked');
                        window.location.reload();
                        return;
                    }

                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.background = '#fef3c7';
                        feedbackEl.style.color = '#d97706';
                        feedbackEl.style.borderColor = '#fcd34d';
                        feedbackEl.innerHTML = `⏳ Acceso en espera de aprobación. Comunícate con el Administrador para que te habilite.`;
                    }
                    restoreButtonState();
                    showAccessBlockedScreen(userName, userEmail);
                    return;
                } else {
                    // ¡Habilitado con éxito!
                    if (feedbackEl) {
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.background = '#d1fae5';
                        feedbackEl.style.color = '#065f46';
                        feedbackEl.style.borderColor = '#a7f3d0';
                        feedbackEl.innerHTML = `✅ ¡Acceso aprobado! Cargando pantalla de PIN...`;
                    }
                    restoreButtonState();
                    if (blockedScreen) blockedScreen.style.display = 'none';

                    // Si no está desbloqueado, ocultar las demás y mostrar la pantalla de PIN
                    if (!isUnlocked) {
                        if (authScreen) authScreen.style.display = 'none';
                        if (mainApp) mainApp.style.display = 'none';
                        showPINLockScreen();
                    }
                }
            } else {
                console.error("Supabase client is not loaded.");
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.style.background = '#fde8e8';
                    feedbackEl.style.color = '#e74c3c';
                    feedbackEl.style.borderColor = '#f8b4b4';
                    feedbackEl.innerHTML = `❌ Error Crítico: No se pudo cargar el cliente de base de datos de Supabase. Revisa tu conexión a internet o intenta recargar la página.`;
                }
                restoreButtonState();
                showAccessBlockedScreen(userName, userEmail);
            }
        };

        if (isAdmin) {
            // El administrador siempre tiene acceso directo y no es bloqueado en BD
            if (blockedScreen) blockedScreen.style.display = 'none';
            if (!isUnlocked) {
                if (authScreen) authScreen.style.display = 'none';
                if (mainApp) mainApp.style.display = 'none';
                showPINLockScreen();
            }
        } else {
            // Colegas regulares:
            if (isUnlocked) {
                // Si ya está desbloqueado, hacemos la validación en segundo plano sin interrumpir al usuario
                runAccessCheck().catch(err => console.error("Error en validación en segundo plano:", err));
            } else {
                // Si no está desbloqueado, hacemos la verificación de forma bloqueante (con await)
                // Manteniendo la pantalla actual visible mientras se consulta, para evitar pantallas en blanco.
                await runAccessCheck();
            }
        }

    } catch (err) {
        console.error("🔴 Error displaying App:", err);
        alert("🔴 Error displaying App: " + err.message + "\n" + err.stack);
    }
}

window.showApp = showApp;

async function showPINLockScreen() {
    try {
        const lockScreen = document.getElementById('pin-lock-screen');
        if (!lockScreen) {
            console.error("Error: pin-lock-screen element not found");
            return;
        }
        lockScreen.style.display = 'flex';

        const pinInput = document.getElementById('pinInput');
        const pinConfirmInput = document.getElementById('pinConfirmInput');
        const pinConfirmGroup = document.getElementById('pinConfirmGroup');
        const title = document.getElementById('pinWelcomeTitle');
        const desc = document.getElementById('pinWelcomeDesc');
        const errEl = document.getElementById('pinErrorMessage');

        if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
        }
        if (pinConfirmInput) pinConfirmInput.value = '';
        if (errEl) errEl.style.display = 'none';

        const name = AppState.user?.user_metadata?.full_name || AppState.user?.email || 'Usuario';
        const pinHash = AppState.user?.user_metadata?.pin_hash;

        if (title) {
            title.innerText = !pinHash ? "🔒 Configura tu PIN" : "🔒 Bloqueo de Seguridad";
        }
        if (desc) {
            desc.innerText = !pinHash 
                ? `¡Bienvenido, ${name}! Define tu código secreto de 4 a 6 dígitos para proteger tus datos.`
                : `Hola, ${name}. Ingresa tu código de acceso para continuar.`;
        }
        if (pinConfirmGroup) {
            pinConfirmGroup.style.display = !pinHash ? 'block' : 'none';
        }
    } catch (e) {
        console.error("Error in showPINLockScreen:", e);
        alert("Error en pantalla de PIN: " + e.message + "\n" + e.stack);
    }
}

window.submitPIN = async function() {
    const pinInput = document.getElementById('pinInput');
    const pinConfirmInput = document.getElementById('pinConfirmInput');
    const errEl = document.getElementById('pinErrorMessage');
    
    if (errEl) errEl.style.display = 'none';

    const pinVal = pinInput ? pinInput.value.trim() : '';
    if (!/^[0-9]{4,6}$/.test(pinVal)) {
        showPINError("⚠️ El PIN debe ser numérico y tener entre 4 y 6 dígitos.");
        return;
    }

    const pinHashExist = AppState.user?.user_metadata?.pin_hash;
    
    if (!pinHashExist) {
        // Flujo de Configuración Inicial
        const confirmVal = pinConfirmInput ? pinConfirmInput.value.trim() : '';
        if (pinVal !== confirmVal) {
            showPINError("⚠️ Los códigos no coinciden. Inténtalo de nuevo.");
            return;
        }

        try {
            const hashed = await hashPIN(pinVal);
            
            // Inmunizar estableciendo el estado de desbloqueado de antemano (evita colisiones con onAuthStateChange concurrente)
            sessionStorage.setItem('sedile_unlocked', 'true');

            // Guardar en la metadata de Supabase Auth
            const { data, error } = await supabaseClient.auth.updateUser({
                data: { pin_hash: hashed }
            });

            if (error) {
                sessionStorage.removeItem('sedile_unlocked');
                throw error;
            }

            AppState.user = data.user;
            
            const lockScreen = document.getElementById('pin-lock-screen');
            if (lockScreen) lockScreen.style.display = 'none';
            await showApp();
            showToast("✅ PIN secreto configurado con éxito.");
        } catch (err) {
            showPINError("🔴 Error al guardar en Supabase: " + err.message);
        }
    } else {
        // Flujo de Validación Recurrente
        const hashedInput = await hashPIN(pinVal);
        if (hashedInput === pinHashExist) {
            sessionStorage.setItem('sedile_unlocked', 'true');
            const lockScreen = document.getElementById('pin-lock-screen');
            if (lockScreen) lockScreen.style.display = 'none';
            await showApp();
            showToast("🔓 Acceso concedido.");
        } else {
            showPINError("❌ Código secreto incorrecto. Inténtalo de nuevo.");
            if (pinInput) {
                pinInput.value = '';
                pinInput.focus();
            }
        }
    }
};

function showPINError(msg) {
    const errEl = document.getElementById('pinErrorMessage');
    if (errEl) {
        errEl.innerText = msg;
        errEl.style.display = 'block';
    }
}

function showLogin() {
    document.getElementById('auth-screen').style.display = 'grid';
    document.getElementById('main-app').style.display = 'none';
    const pinLock = document.getElementById('pin-lock-screen');
    if (pinLock) pinLock.style.display = 'none';
    const blockedScreen = document.getElementById('access-blocked-screen');
    if (blockedScreen) blockedScreen.style.display = 'none';
}

function showAccessBlockedScreen(name, email) {
    const mainApp = document.getElementById('main-app');
    const pinLock = document.getElementById('pin-lock-screen');
    const authScreen = document.getElementById('auth-screen');
    const blockedScreen = document.getElementById('access-blocked-screen');
    
    if (mainApp) mainApp.style.display = 'none';
    if (pinLock) pinLock.style.display = 'none';
    if (authScreen) authScreen.style.display = 'none';
    
    if (blockedScreen) {
        blockedScreen.style.display = 'grid';
        
        const nameEl = document.getElementById('blockedUserName');
        const emailEl = document.getElementById('blockedUserEmail');
        if (nameEl) nameEl.innerText = name;
        if (emailEl) emailEl.innerText = email;
    }
}

// Escucha para enviar el PIN con la tecla Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const lockScreen = document.getElementById('pin-lock-screen');
        if (lockScreen && lockScreen.style.display === 'flex') {
            window.submitPIN();
        }
    }
});

// --- 5. COMPACT UI LOGIC ---

// --- 6. MODALS ---
function initProtocolModal() {
    const modal = document.getElementById('protocolModal');
    const btnOpenFab = document.getElementById('btnProtocolOpen');
    const btnOpenPurpose = document.getElementById('btnOpenPurpose');
    const btnClose = document.getElementById('btnProtocolClose');
    
    if (btnOpenFab && modal) btnOpenFab.onclick = () => modal.classList.add('active');
    
    if (btnOpenPurpose && modal) {
        btnOpenPurpose.onclick = (e) => {
            e.preventDefault();
            modal.classList.add('active');
        };
    }
    
    if (btnClose && modal) btnClose.onclick = () => modal.classList.remove('active');
}

// Global scope to ensure it's available early
window.switchProtocolTab = (idx) => {
    console.log("🔄 switchProtocolTab called with index:", idx);
    const btnRTH = document.getElementById('btnTabRTH');
    const btnDeliv = document.getElementById('btnTabDelivery');
    const tabInf = document.getElementById('tab-infusion');
    const tabDel = document.getElementById('tab-delivery');

    if (idx === 0) {
        if (btnRTH) btnRTH.classList.add('active');
        if (btnDeliv) btnDeliv.classList.remove('active');
        if (tabInf) tabInf.style.display = 'block';
        if (tabDel) tabDel.style.display = 'none';
    } else {
        if (btnRTH) btnRTH.classList.remove('active');
        if (btnDeliv) btnDeliv.classList.add('active');
        if (tabInf) tabInf.style.display = 'none';
        if (tabDel) tabDel.style.display = 'block';
    }
};

function initHistoryModal() {
    const modal = document.getElementById('historyModal');
    const btnOpen = document.getElementById('btnOpenHistory');
    const btnClose = document.getElementById('btnHistoryClose');
    if (btnOpen) btnOpen.onclick = () => {
        modal.classList.add('active');
        window.loadHistoryList(false);
    };
    if (btnClose) btnClose.onclick = () => modal.classList.remove('active');

    const tabActivos = document.getElementById('tabHistActivos');
    const tabPapelera = document.getElementById('tabHistPapelera');
    if (tabActivos) tabActivos.addEventListener('click', (e) => {
        e.preventDefault();
        window.loadHistoryList(false);
    });
    if (tabPapelera) tabPapelera.addEventListener('click', (e) => {
        e.preventDefault();
        window.loadHistoryList(true);
    });
}

function initAdminPanel() {
    const modal = document.getElementById('adminModal');
    const btnOpen = document.getElementById('btnAdminPanel');
    const btnClose = document.getElementById('btnAdminClose');
    
    if (btnOpen && modal) {
        btnOpen.onclick = () => {
            modal.classList.add('active');
            window.loadAdminUsersList();
        };
    }
    if (btnClose && modal) {
        btnClose.onclick = () => modal.classList.remove('active');
    }
}

window.loadAdminUsersList = async () => {
    const tableBody = document.getElementById('adminUsersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#64748b;">Cargando colegas...</td></tr>';
    
    try {
        const { data: users, error } = await supabaseClient
            .from('acceso_usuarios')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        tableBody.innerHTML = '';
        
        if (!users || users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#64748b; font-style:italic;">No hay colegas registrados aún.</td></tr>';
            return;
        }
        
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #f1f5f9';
            
            const isApproved = u.acceso_permitido;
            const statusBadge = isApproved 
                ? `<span style="background:#d1fae5; color:#0f5132; padding:3px 8px; border-radius:12px; font-weight:700; font-size:0.7rem; border:1px solid #badbcc; display:inline-block;">Habilitado</span>` 
                : `<span style="background:#fee2e2; color:#842029; padding:3px 8px; border-radius:12px; font-weight:700; font-size:0.7rem; border:1px solid #f5c2c7; display:inline-block;">Denegado</span>`;
                
            const actionButton = isApproved 
                ? `<button class="btn-micro" onclick="window.toggleUserAccess('${u.id}', false)" style="background:rgba(231,76,60,0.08); color:#e74c3c; border:1px solid rgba(231,76,60,0.15); padding:4px 8px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem;">Denegar</button>` 
                : `<button class="btn-micro" onclick="window.toggleUserAccess('${u.id}', true)" style="background:rgba(46,204,113,0.08); color:#2ecc71; border:1px solid rgba(46,204,113,0.15); padding:4px 8px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.75rem;">Habilitar</button>`;
                
            tr.innerHTML = `
                <td style="padding:10px 12px; font-weight:600; color:#1e293b;">
                    <div style="font-size:0.85rem;">${u.nombre || 'Colega'}</div>
                    <div style="font-size:0.7rem; color:#64748b; font-weight:400;">${u.email}</div>
                </td>
                <td style="padding:10px 12px; text-align:center;">${statusBadge}</td>
                <td style="padding:10px 12px; text-align:center;">${actionButton}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error al cargar lista de usuarios en admin:", err);
        tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:15px; color:#e74c3c; font-weight:600;">Error: ${err.message}</td></tr>`;
    }
};

window.toggleUserAccess = async (userId, newStatus) => {
    try {
        const { error } = await supabaseClient
            .from('acceso_usuarios')
            .update({ acceso_permitido: newStatus })
            .eq('id', userId);
            
        if (error) throw error;
        
        showToast(newStatus ? "✔️ Colega habilitado para ingresar" : "❌ Acceso denegado para el colega");
        window.loadAdminUsersList();
    } catch (err) {
        console.error("Error al cambiar acceso de usuario:", err);
        showToast("⚠️ Error: " + err.message);
    }
};

// --- 7. PATIENT & HISTORY LOGIC ---
function initPatientLogic() {
    const fields = ['nombre', 'edad', 'sexo', 'peso', 'estatura', 'actividad', 'pcefalico'];
    fields.forEach(f => {
        const el = document.getElementById(f);
        if (el) {
            el.oninput = calculateRequirements;
            if (f === 'nombre') {
                el.addEventListener('change', (e) => {
                    if (typeof window.updatePatientEvolutionChart === 'function') {
                        window.updatePatientEvolutionChart(e.target.value);
                    }
                });
            }
            if (f === 'peso') {
                el.addEventListener('input', () => {
                    if (typeof window.updateDryWeight === 'function') {
                        window.updateDryWeight();
                    }
                });
            }
        }
    });
}

function initCompactLayout() {

    const form = document.getElementById('form-paciente');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = `<span>â³</span> Guardando...`;

            try {
                const nombre = document.getElementById('nombre').value;
                const edad = parseInt(document.getElementById('edad').value) || 0;
                const peso = parseFloat(document.getElementById('peso').value) || 0;
                const estatura = parseFloat(document.getElementById('estatura').value) || 0;
                const sexo = document.getElementById('sexo').value;
                const actividad = parseFloat(document.getElementById('actividad').value) || 1.2;
                const diagnostico = document.getElementById('diagnostico')?.value || '';
                const cama = document.getElementById('cama')?.value || '';
                const tmt = parseFloat(document.getElementById('goalTotal')?.value) || 0;

                // FULL STATE PERSISTENCE V3.51
                const metadata = {
                    simulator: {
                        formula: document.getElementById('formulaSelect')?.value || "",
                        volume: document.getElementById('volume')?.value || "",
                        volume_times: document.getElementById('volumeTimes')?.value || "1",
                        dilution: document.getElementById('dilution')?.value || "",
                        goal_total: tmt,
                        macro_mode: macroGoalMode || 'gkg',
                        goal_prot: document.getElementById('goalProtKg')?.value || "",
                        goal_cho: document.getElementById('goalCHOKg')?.value || "",
                        goal_lip: document.getElementById('goalLipKg')?.value || "",
                        modules: {
                            nessucar: document.getElementById('modNessucar')?.value || "",
                            mct: document.getElementById('modMCT')?.value || "",
                            enterex: document.getElementById('modEnterex')?.value || "",
                            banatrol: document.getElementById('modBanatrol')?.value || "",
                            proteinex: document.getElementById('modProteinex')?.value || "",
                            fresubin: document.getElementById('modFresubin')?.value || ""
                        },
                        oral: {
                            kcal: document.getElementById('oralKcal')?.value || "",
                            prot: document.getElementById('oralProt')?.value || "",
                            cho: document.getElementById('oralCHO')?.value || "",
                            lip: document.getElementById('oralLip')?.value || "",
                            water: document.getElementById('oralWater')?.value || ""
                        },
                        iv: {
                            type: document.getElementById('ivType')?.value || "",
                            volume: document.getElementById('ivVolume')?.value || ""
                        }
                    },
                    assessment: {
                        cintura: document.getElementById('ccintura')?.value || "",
                        braquial: document.getElementById('cbraquial')?.value || "",
                        pantorrilla: document.getElementById('cpantorrilla')?.value || "",
                        atr: document.getElementById('altrodilla')?.value || "",
                        pliegues: {
                            pt: document.getElementById('ptricipital')?.value || "",
                            pb: document.getElementById('pbicipital')?.value || "",
                            ps: document.getElementById('piliaco')?.value || "",
                            pa: document.getElementById('pabdominal')?.value || ""
                        },
                        talla: {
                            mediaenv: document.getElementById('mediaenv')?.value || "",
                            envcomp: document.getElementById('envcomp')?.value || ""
                        },
                        edema: document.getElementById('edemaGrade')?.value || "",
                        exams: Array.from(document.querySelectorAll('#examsContainer .exam-row')).map(row => {
                            const inputs = row.querySelectorAll('input');
                            if(inputs && inputs.length >= 3) {
                                return { date: inputs[0].value, type: inputs[1].value, res: inputs[2].value };
                            }
                            return null;
                        }).filter(Boolean),
                        cribaje: {
                            nrs: document.getElementById('nrs2002')?.value || "",
                            vgs: document.getElementById('vgs')?.value || ""
                        },
                        gi: {
                            residuo: document.getElementById('residuo')?.value || "",
                            diarrea: document.getElementById('diarrea')?.value || "",
                            distension: document.getElementById('distension')?.value || ""
                        },
                        pes: document.getElementById('diagnosticoPES')?.value || ""
                    }
                };

                const data = {
                    nombre,
                    edad,
                    peso_kg: peso,
                    estatura_m: estatura,
                    sexo,
                    actividad,
                    diagnostico,
                    cama,
                    tmt,
                    ia_report: AppState.patient.ia_report || null,
                    metadata: metadata,
                    user_id: AppState.user.id
                };

                const { error } = await supabaseClient.from('pacientes').insert([data]);

                if (!error) {
                    showToast("âœ… Ficha completa guardada en historial");
                    window.loadHistoryList(false);

                    if (typeof updatePatientEvolutionChart === 'function') {
                        updatePatientEvolutionChart(nombre);
                    }

                    btn.innerHTML = `<span>âœ”</span> ¡Guardado!`;
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                    }, 2000);
                } else {
                    throw error;
                }
            } catch (err) {
                console.error("Save Error:", err);
                alert("Error al guardar (Verifica caché SQL): " + err.message);
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        };
    }
}

// --- NEW: Goal Evolution Logic (Decoupled) ---
function initGoalLogic() {
    // Redundant block merged into initAssessmentLogic
}

window.loadHistoryList = async (showPapelera = false) => {
    // Guard clause for uninitialized user session
    if (!AppState.user || !AppState.user.id) {
        console.warn("loadHistoryList: AppState.user is not loaded yet. Skipping load.");
        const list = document.getElementById('patientListContainer');
        if (list) {
            list.innerHTML = '<p style="text-align:center; opacity:0.6;">Cargando tus registros...</p>';
        }
        return;
    }

    // Update tabs robustly
    const tabActivos = document.getElementById('tabHistActivos');
    const tabPapelera = document.getElementById('tabHistPapelera');
    if (tabActivos) {
        if (showPapelera) tabActivos.classList.remove('active');
        else tabActivos.classList.add('active');
    }
    if (tabPapelera) {
        if (showPapelera) tabPapelera.classList.add('active');
        else tabPapelera.classList.remove('active');
    }

    const list = document.getElementById('patientListContainer');
    if (!list) return;

    list.innerHTML = '<p style="text-align:center;">Cargando historial...</p>';

    const { data: records, error } = await supabaseClient
        .from('pacientes')
        .select('*, metadata')
        .eq('user_id', AppState.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        let msg = error.message || "Error desconocido";
        if (msg.includes("estado_sala")) msg = "Columna estado_sala inexistente. ¡Corre el SQL!";
        list.innerHTML = `<p style="text-align:center; color:#e74c3c;"><b>Error al cargar:</b> ${msg}</p>`;
        return;
    }

    if (!records || records.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.6;">Ningún registro guardado aún.</p>';
        return;
    }

    // Filter out null names
    const validRecords = records.filter(r => r.nombre && r.nombre.trim() !== '');

    const now = new Date();
    const toHardDelete = [];
    const showRecords = [];

    validRecords.forEach(r => {
        const isTrash = r.estado_sala === 'eliminado';
        if (isTrash) {
            // Calculate remaining days
            const delDateStr = r.metadata?.deleted_at;
            let daysLeft = 30;
            if (delDateStr) {
                const diffTime = Math.abs(now - new Date(delDateStr));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                daysLeft = 30 - diffDays;
            } else {
                // Si no hay fecha de borrado en la metadata, asumimos que se acaba de borrar
                // Y parchamos la metadata para que empiece a contar desde hoy
                let meta = r.metadata || {};
                meta.deleted_at = new Date().toISOString();
                supabaseClient.from('pacientes').update({ metadata: meta }).eq('id', r.id).then(()=>{});
                daysLeft = 30;
            }

            if (daysLeft <= 0) {
                toHardDelete.push(r.id);
            } else if (showPapelera) {
                r._daysLeft = daysLeft;
                showRecords.push(r);
            }
        } else if (!showPapelera && r.estado_sala !== 'eliminado') {
            showRecords.push(r);
        }
    });

    // Auto-purge expired records quietly in background
    toHardDelete.forEach(async (id) => {
        console.log(`Auto-purging expired patient ${id}`);
        await supabaseClient.from('pacientes').delete().eq('id', id);
    });

    const chartContainerE = document.getElementById('chartContainer');
    if (chartContainerE && window.getComputedStyle(chartContainerE.parentElement).display === 'flex') {
        // Only hide it if it's somehow left in the old flex container, 
        // though it shouldn't be since we moved it.
    }

    if (showRecords.length === 0) {
        let debugText = ``;
        if (showPapelera) {
            const trashCount = validRecords.filter(r => r.estado_sala === 'eliminado').length;
            debugText = `<br><small style="font-size:0.7rem; color:#ccc;">Debug: Registros totales=${records.length}, Eliminados encontrados=${trashCount}</small>`;
        }
        list.innerHTML = `<p style="text-align:center; opacity:0.6;">${showPapelera ? 'La papelera está vacía.' : 'Ningún registro guardado aún.'}${debugText}</p>`;
        return;
    }

    // Grouping to only show the most recent record per patient in the list to avoid clutter
    const mapUniques = new Map();
    showRecords.forEach(r => {
        if (!mapUniques.has(r.nombre)) mapUniques.set(r.nombre, r);
    });
    const uniqueDisplay = Array.from(mapUniques.values());

    let html = '';

    uniqueDisplay.forEach(r => {

        const dateStr = new Date(r.created_at).toLocaleDateString('es-CL');
        if (showPapelera) {
            html += `
                <div style="background:#fff3ef; border:1px solid #ffcccb; border-radius:10px; padding:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:#c0392b; font-size:1.1rem; display:block; margin-bottom:3px;">${r.nombre}</strong>
                        <span style="font-size:0.8rem; color:#666;">Se eliminará en ${r._daysLeft} días</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem; background:#27ae60;" onclick="window.restorePatient('${r.id}')">\u{21A9}\u{FE0F} Restaurar</button>
                        <button class="btn-micro" style="padding: 6px; font-size: 0.9rem; background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid #e74c3c; border-radius: 8px;" onclick="event.stopPropagation(); window.hardDeletePatient('${r.id}')" title="Eliminar definitivamente">\u{1F5D1}\u{FE0F}</button>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="background:#f8f9fa; border:1px solid #eee; border-radius:10px; padding:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:var(--primary); font-size:1.1rem; display:block; margin-bottom:3px;">${r.nombre}</strong>
                        <span style="font-size:0.8rem; color:#666;">${dateStr} | ${r.edad} años | ${r.peso_kg} kg | ${Math.round(r.tmt || 0)} kcal</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="loadPatient('${r.id}')">\u{1F4C2} Cargar</button>
                        <button class="btn-micro" style="padding: 6px; font-size: 0.9rem; background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid #e74c3c; border-radius: 8px;" onclick="event.stopPropagation(); window.deletePatient('${r.id}')" title="Mover a papelera">\u{1F5D1}\u{FE0F}</button>
                    </div>
                </div>
            `;
        }
    });

    list.innerHTML = html;
};

// --- NEW V3.60: WARD KANBAN LOGIC ---
function initWardKanban() {
    const btnRefresh = document.getElementById('btnRefreshWard');
    if (btnRefresh) btnRefresh.onclick = loadWardKanban;

    const btnPrint = document.getElementById('btnPrintHandoff');
    if (btnPrint) btnPrint.onclick = generateShiftHandoff;

    const btnQuickClose = document.getElementById('btnQuickViewClose');
    if (btnQuickClose) btnQuickClose.onclick = () => document.getElementById('quickViewModal').classList.remove('active');
}

async function loadWardKanban() {
    // Guard clause for uninitialized user session
    if (!AppState.user || !AppState.user.id) {
        console.warn("loadWardKanban: AppState.user is not loaded yet. Skipping load.");
        const colActivos = document.getElementById('colActivos');
        const colCriticos = document.getElementById('colCriticos');
        if (colActivos) colActivos.innerHTML = '<p style="opacity:0.5; text-align:center;">Cargando...</p>';
        if (colCriticos) colCriticos.innerHTML = '<p style="opacity:0.5; text-align:center;">Cargando...</p>';
        return;
    }

    const colActivos = document.getElementById('colActivos');
    const colCriticos = document.getElementById('colCriticos');
    const cntActivos = document.getElementById('countActivos');
    const cntCriticos = document.getElementById('countCriticos');

    if (!colActivos || !colCriticos) return;

    colActivos.innerHTML = '<p style="opacity:0.5; text-align:center;">Cargando...</p>';
    colCriticos.innerHTML = '<p style="opacity:0.5; text-align:center;">Cargando...</p>';

    // Fetch patients that are not discharged OR where estado_sala is null
    const { data, error } = await supabaseClient
        .from('pacientes')
        .select('*')
        .eq('user_id', AppState.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading ward:", error);
        colActivos.innerHTML = '<p style="color:red;">Error al cargar</p>';
        return;
    }

    // Filter to latest entry per patient conceptually, 
    // but usually in a ward list you only have one active entry per patient.
    // For safety, we keep only the latest row per 'nombre' if they create duplicates without discharging.
    const activeMap = new Map();
    data.forEach(p => {
        // Enforce exclusion of discharged or deleted patients
        if (p.estado_sala === 'de_alta' || p.estado_sala === 'eliminado') return;

        if (!activeMap.has(p.nombre) || new Date(p.created_at) > new Date(activeMap.get(p.nombre).created_at)) {
            activeMap.set(p.nombre, p);
        }
    });

    const uniqueActivePatients = Array.from(activeMap.values());

    const actHTML = [];
    const critHTML = [];

    uniqueActivePatients.forEach(p => {
        const isCritico = p.estado_sala === 'critico' || p.requiere_atencion;

        // Automated Alert Logic
        let alertBadge = '';
        if (p.fecha_dispositivo) {
            const dateSNG = new Date(p.fecha_dispositivo);
            const today = new Date();
            const diffTime = Math.abs(today - dateSNG);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 30) {
                alertBadge += `<span style="background:#e74c3c; color:white; padding:2px 6px; border-radius:10px; font-size:0.6rem; margin-right:5px;">⚠️  Sonda > 30d</span>`;
            }
        }

        // Fast Check Weight drop (simulate if multiple histories exist but for now simple badge)
        if (p.requiere_atencion) {
            alertBadge += `<span style="background:#f39c12; color:white; padding:2px 6px; border-radius:10px; font-size:0.6rem;">⚠️  Revisar Peso</span>`;
        }

        const cardHTML = `
            <div class="ward-card" style="background:white; border-radius:10px; padding:12px; box-shadow:0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid ${isCritico ? '#e74c3c' : '#3498db'}; cursor:pointer;" onclick="loadPatient('${p.id}')">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <h4 style="margin:0; font-size:0.9rem; color:#333;">${p.nombre}</h4>
                    <span style="font-size:0.75rem; color:#888; font-weight:600; background:#eee; padding:2px 6px; border-radius:6px;">Cama ${p.cama || '--'}</span>
                </div>
                <div style="font-size:0.75rem; color:#666; margin:4px 0;">${p.diagnostico || 'Sin Dx'}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    <span style="font-size:0.75rem; font-weight:600; color:var(--primary);">${p.peso_kg} kg | ${p.tmt ? Math.round(p.tmt) + ' kcal' : '--'}</span>
                    <button onclick="event.stopPropagation(); window.openQuickView('${p.id}')" style="background:none; border:none; cursor:pointer; font-size:0.9rem;" title="Resumen de Bolsillo">
                        \u{1F50D}
                    </button>
                    <button onclick="event.stopPropagation(); window.togglePatientState('${p.id}', '${isCritico ? 'activo' : 'critico'}')" style="background:none; border:none; cursor:pointer; font-size:0.9rem;" title="Cambiar a ${isCritico ? 'En Curso' : 'Crítico'}">
                        ${isCritico ? '\u{21A9}\u{FE0F}' : '\u{1F6A8}'}
                    </button>
                    <button onclick="event.stopPropagation(); window.dischargePatient('${p.id}')" style="background:none; border:none; color:#27ae60; cursor:pointer;" title="Dar de Alta">
                        âœ”ï¸
                    </button>
                </div>
                <div style="margin-top:6px;">${alertBadge}</div>
            </div>
        `;

        if (isCritico) {
            critHTML.push(cardHTML);
        } else {
            actHTML.push(cardHTML);
        }
    });

    colActivos.innerHTML = actHTML.join('') || '<p style="opacity:0.5; font-size:0.8rem;">No hay pacientes</p>';
    colCriticos.innerHTML = critHTML.join('') || '<p style="opacity:0.5; font-size:0.8rem;">No hay pacientes críticos</p>';

    if (cntActivos) cntActivos.innerText = actHTML.length;
    if (cntCriticos) cntCriticos.innerText = critHTML.length;
}

window.togglePatientState = async (id, newState) => {
    const { error } = await supabaseClient.from('pacientes').update({ estado_sala: newState }).eq('id', id);
    if (error) {
        console.error("Error toggling patient state:", error);
        alert("Error al cambiar estado: " + error.message);
    } else {
        loadWardKanban();
    }
};

window.dischargePatient = async (id) => {
    if (!confirm("¿Dar de alta a este paciente de la sala? Seguirá en tu historial, pero no en este Kanban.")) return;
    const { error } = await supabaseClient.from('pacientes').update({ estado_sala: 'de_alta' }).eq('id', id);
    if (!error) loadWardKanban();
};

window.deletePatient = async (id) => {
    if (!AppState.user || !AppState.user.id) {
        alert("⚠️ Error: Sesión de usuario no válida.");
        return;
    }

    if (!confirm("¿Mover este paciente a la papelera?")) return;

    // Fetch the patient name to delete ALL their history snapshots
    const { data: p, error: fetchErr } = await supabaseClient.from('pacientes').select('nombre, metadata').eq('id', id).single();
    if (fetchErr || !p) {
        alert("Error de lectura al buscar paciente: " + (fetchErr?.message || "No encontrado"));
        return;
    }

    const { data: records } = await supabaseClient.from('pacientes').select('id, metadata').eq('nombre', p.nombre).eq('user_id', AppState.user.id);
    const nowISO = new Date().toISOString();
    let hasError = false;
    let errorMsg = null;

    if (records && records.length > 0) {
        for (let r of records) {
            let meta = r.metadata || {};
            meta.deleted_at = nowISO;
            const { error } = await supabaseClient.from('pacientes').update({
                estado_sala: 'eliminado',
                metadata: meta
            }).eq('id', r.id);
            if (error) { hasError = true; errorMsg = error.message; }
        }
    } else {
        const { error } = await supabaseClient.from('pacientes').update({
            estado_sala: 'eliminado'
        }).eq('nombre', p.nombre).eq('user_id', AppState.user.id);
        if (error) { hasError = true; errorMsg = error.message; }
    }

    if (hasError) {
        console.error("Error API:", errorMsg);
        alert("Falla de conexión o base de datos. " + errorMsg);
    } else {
        showToast("Paciente movido a la papelera");
        if (typeof window.loadHistoryList === 'function') window.loadHistoryList(false);
        if (typeof loadWardKanban === 'function') loadWardKanban();

        // Deseleccionar paciente de la calculadora activa si coincide el nombre
        const currentName = document.getElementById('nombre')?.value || "";
        if (currentName.trim() === p.nombre.trim()) {
            AppState.patient.id = null;
            document.getElementById('nombre').value = "";
            document.getElementById('currentPatientName').innerText = "Nuevo Paciente";
            const avatar = document.getElementById('currentPatientAvatar');
            if (avatar) avatar.innerText = "P";
            const bmi = document.getElementById('valBMI');
            if (bmi) bmi.innerText = "--";
        }
    }
};

window.hardDeletePatient = async (id, skipConfirm = false) => {
    if (!AppState.user || !AppState.user.id) {
        alert("⚠️ Error: Sesión de usuario no válida.");
        return;
    }

    if (!skipConfirm && !confirm("¿Eliminar PERMANENTEMENTE a este paciente de la base de dato⚠️")) return;

    // Fetch the patient name to delete all grouped rows
    const { data: p, error: fetchErr } = await supabaseClient.from('pacientes').select('nombre').eq('id', id).single();
    if (fetchErr || !p) {
        alert("Error buscando el registro para borrado permanente: " + (fetchErr?.message || ""));
        return;
    }

    const { error } = await supabaseClient.from('pacientes').delete().eq('nombre', p.nombre).eq('user_id', AppState.user.id);
    if (!error) {
        window.loadHistoryList(false); // Reload normal history instead of jumping to Trash
        if (typeof loadWardKanban === 'function') loadWardKanban();

        // Limpiar visor activo
        const currentName = document.getElementById('nombre')?.value || "";
        if (currentName.trim() === p.nombre.trim()) {
            AppState.patient.id = null;
            document.getElementById('nombre').value = "";
            document.getElementById('currentPatientName').innerText = "Nuevo Paciente";
            if (document.getElementById('currentPatientAvatar')) document.getElementById('currentPatientAvatar').innerText = "P";
            if (document.getElementById('valBMI')) document.getElementById('valBMI').innerText = "--";
        }
    } else {
        alert("Error de Supabase al Eliminar (probablemente te falta la Política RLS de DELETE): " + error.message);
    }
};

window.restorePatient = async (id) => {
    if (!AppState.user || !AppState.user.id) {
        alert("⚠️ Error: Sesión de usuario no válida.");
        return;
    }

    // Return to generic 'activo' state for all history rows tied to this name
    const { data: p, error: fetchErr } = await supabaseClient.from('pacientes').select('nombre').eq('id', id).single();
    if (fetchErr || !p) {
        alert("No se pudo restaurar (error de lectura): " + (fetchErr?.message || ""));
        return;
    }

    const { error } = await supabaseClient.from('pacientes').update({ estado_sala: 'activo' }).eq('nombre', p.nombre).eq('user_id', AppState.user.id);
    if (!error) {
        window.loadHistoryList(true);
        if (typeof loadWardKanban === 'function') loadWardKanban();
    } else {
        alert("Error restaurando paciente: " + error.message);
    }
};

window.openQuickView = async (id) => {
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    content.innerHTML = '<p style="text-align:center; opacity:0.5;">Cargando paciente...</p>';
    modal.classList.add('active');

    const { data: p, error } = await supabaseClient.from('pacientes').select('*').eq('id', id).single();

    if (error || !p) {
        content.innerHTML = '<p style="color:red;">Error al cargar datos.</p>';
        return;
    }

    // Try to extract prescribed formula name from metadata if possible, otherwise generic
    let formulaDesc = "Fórmula Enteral";
    let volDesc = "--";
    let velDesc = "--";

    if (p.metadata) {
        if (p.metadata.prescripcion) {
            formulaDesc = p.metadata.prescripcion.formula_id || formulaDesc;
            volDesc = p.metadata.prescripcion.volumen ? `${p.metadata.prescripcion.volumen} ml` : volDesc;
        }
    }

    const html = `
        <div style="text-align:center; margin-bottom:15px;">
            <div style="font-size:2.5rem; margin-bottom:5px;">ðŸ›Œ</div>
            <h3 style="color:var(--primary); margin:0;">${p.nombre}</h3>
            <span style="font-size:0.8rem; background:#f0f2f5; padding:2px 8px; border-radius:10px;">Cama ${p.cama || 'S/N'}</span>
        </div>
        
        <table style="width:100%; border-collapse:collapse; margin-bottom:15px;">
            <tr><td style="padding:6px; border-bottom:1px solid #eee; color:#666;">Edad/Género</td><td style="padding:6px; border-bottom:1px solid #eee; font-weight:600; text-align:right;">${p.edad}a / ${p.sexo === 'm' ? 'Masc' : 'Fem'}</td></tr>
            <tr><td style="padding:6px; border-bottom:1px solid #eee; color:#666;">Peso Actual</td><td style="padding:6px; border-bottom:1px solid #eee; font-weight:600; text-align:right;">${p.peso_kg} kg</td></tr>
            <tr><td style="padding:6px; border-bottom:1px solid #eee; color:#666;">Meta (TMT)</td><td style="padding:6px; border-bottom:1px solid #eee; font-weight:600; text-align:right; color:var(--primary);">${p.tmt ? Math.round(p.tmt) + ' kcal' : '--'}</td></tr>
        </table>

        <div style="background:#f8f9fa; padding:12px; border-radius:12px; margin-bottom:15px; border-left:4px solid #3498db;">
            <p style="margin:0 0 5px 0; font-size:0.75rem; color:#888; text-transform:uppercase;">Esquema Actual Registrado</p>
            <strong style="display:block; font-size:1.1rem; color:#333;">${formulaDesc}</strong>
            <span style="font-size:0.85rem; color:#555;">Volumen: ${volDesc}</span>
        </div>

        <div>
            <p style="margin:0 0 5px 0; font-size:0.75rem; color:#888; text-transform:uppercase;">Diagnóstico / Evolución</p>
            <div style="font-size:0.85rem; color:#444; background:#fdfdfd; padding:10px; border-radius:8px; border:1px solid #eee;">
                ${p.diagnostico || 'Sin diagnóstico ingresado.'}
            </div>
        </div>
    `;

    content.innerHTML = html;
};

async function generateShiftHandoff() {
    if (!AppState.user || !AppState.user.id) {
        alert("⚠️ Error: Sesión de usuario no válida.");
        return;
    }

    const { data: patients, error } = await supabaseClient
        .from('pacientes')
        .select('*')
        .eq('user_id', AppState.user.id)
        .neq('estado_sala', 'de_alta')
        .order('cama', { ascending: true, nullsFirst: false });

    if (error || !patients || patients.length === 0) {
        alert("No hay pacientes activos en la sala para generar el reporte.");
        return;
    }

    // Filter unique latest per patient handling deleted/discharged patients
    const activeMap = new Map();
    patients.forEach(p => {
        if (p.estado_sala === 'de_alta' || p.estado_sala === 'eliminado') return;

        if (!activeMap.has(p.nombre) || new Date(p.created_at) > new Date(activeMap.get(p.nombre).created_at)) {
            activeMap.set(p.nombre, p);
        }
    });

    const uniquePatients = Array.from(activeMap.values());
    uniquePatients.sort((a, b) => (a.cama || '').localeCompare(b.cama || ''));

    let rows = '';
    uniquePatients.forEach(p => {
        rows += `
            <tr>
                <td><b>${p.cama || '--'}</b></td>
                <td><b>${p.nombre}</b><br><span style="font-size:0.75rem; color:#555;">${p.edad}a | ${p.peso_kg}kg</span></td>
                <td>${p.diagnostico || '--'}</td>
                <td>${p.tmt ? Math.round(p.tmt) : '--'} kcal</td>
                <td>${p.estado_sala === 'critico' ? '⚠️ CRÍTICO' : 'En Curso'}</td>
            </tr>
        `;
    });

    const reportHTML = `
        <div style="text-align:center; margin-bottom:20px; font-family:'Poppins', sans-serif;">
            <h2 style="margin:0; color:#333;">ðŸ¥ Reporte Entrega de Turno: SEDILE HRA</h2>
            <p style="margin:5px 0 0 0; color:#666;">Generado el: ${new Date().toLocaleString('es-CL')}</p>
        </div>
        <table class="print-table">
            <thead>
                <tr>
                    <th style="width:10%;">Cama</th>
                    <th style="width:25%;">Paciente</th>
                    <th style="width:40%;">Diagnóstico / Evolución</th>
                    <th style="width:10%;">Meta</th>
                    <th style="width:15%;">Estado</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <div style="margin-top:30px; font-size:0.8rem; color:#888; text-align:center; font-family:'Poppins', sans-serif;">
            "La nutrición adecuada es vital para la recuperación."
        </div>
    `;

    const printArea = document.getElementById('printHandoffArea');
    if (printArea) {
        printArea.innerHTML = reportHTML;
        window.print();
    }
}

function renderEvolutionChart(history) {
    const canvas = document.getElementById('evolutionChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 25;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get weights from AppState / inputs
    const currentWeightInput = AppState.patient?.peso || parseFloat(document.getElementById('peso')?.value) || 0;
    const pesoAnteriorInput = parseFloat(document.getElementById('pesoAnterior')?.value) || 0;
    
    // Prepare combined history to plot: previous weight + history + current weight
    let plotData = [];
    
    // 1. Add Previous Weight as the starting point if valid and not already in history
    if (pesoAnteriorInput > 0) {
        plotData.push({ peso_kg: pesoAnteriorInput, isPrevious: true });
    }
    
    // 2. Add recorded history points, skipping duplicates of Previous Weight
    if (history && history.length > 0) {
        history.forEach(h => {
            if (h.peso_kg !== pesoAnteriorInput) {
                plotData.push(h);
            }
        });
    }
    
    // 3. Add Current Weight if it's set, not already in plotData, and different from Previous Weight
    const isCurrentInHistory = plotData.length > 0 && plotData[plotData.length - 1].peso_kg === currentWeightInput;
    if (currentWeightInput > 0 && !isCurrentInHistory && currentWeightInput !== pesoAnteriorInput) {
        plotData.push({ peso_kg: currentWeightInput, isCurrent: true });
    }

    // --- MANEJO DE LA TABLA DE PESO EN TIEMPO REAL ---
    const tableBody = document.getElementById('evolutionTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        if (plotData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="padding:15px; text-align:center; color:#94a3b8; font-style:italic;">
                        Sin registros de peso en el historial
                    </td>
                </tr>
            `;
        } else {
            // Mostrar los registros del más reciente al más antiguo (descendente)
            const tableData = [...plotData].reverse();
            tableData.forEach(h => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #f1f5f9';
                tr.style.transition = 'background 0.2s';
                
                // Efectos visuales de hover
                tr.onmouseenter = () => tr.style.background = '#f8fafc';
                tr.onmouseleave = () => tr.style.background = 'transparent';

                let dateStr = '';
                let statusBadge = '';

                if (h.isCurrent) {
                    dateStr = `<span style="color:#e74c3c; font-weight:700;">[Peso Actual (Temporal)]</span>`;
                    statusBadge = `<span style="background:#fff3cd; color:#856404; padding:2px 8px; border-radius:12px; font-weight:700; border:1px solid #ffeeba; font-size:0.65rem; display:inline-block;">Actual</span>`;
                    tr.style.background = 'rgba(243, 156, 18, 0.05)';
                    tr.onmouseleave = () => tr.style.background = 'rgba(243, 156, 18, 0.05)';
                } else if (h.isPrevious) {
                    dateStr = `<span style="color:#3498db; font-weight:700;">[Peso Anterior]</span>`;
                    statusBadge = `<span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:12px; font-weight:700; border:1px solid #bae6fd; font-size:0.65rem; display:inline-block;">Anterior</span>`;
                    tr.style.background = 'rgba(52, 152, 219, 0.05)';
                    tr.onmouseleave = () => tr.style.background = 'rgba(52, 152, 219, 0.05)';
                } else {
                    const dateObj = h.created_at ? new Date(h.created_at) : (h.metadata?.logged_at ? new Date(h.metadata.logged_at) : new Date());
                    dateStr = dateObj.toLocaleString('es-CL', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    statusBadge = `<span style="background:#d1fae5; color:#0f5132; padding:2px 8px; border-radius:12px; font-weight:700; border:1px solid #badbcc; font-size:0.65rem; display:inline-block;">Registrado</span>`;
                }

                tr.innerHTML = `
                    <td style="padding:10px; color:#475569; font-weight:600;">${dateStr}</td>
                    <td style="padding:10px; text-align:right; color:#1e293b; font-weight:800; font-size:0.8rem;">${h.peso_kg.toFixed(1)} kg</td>
                    <td style="padding:10px; text-align:center;">${statusBadge}</td>
                `;
                tableBody.appendChild(tr);
            });
        }
    }

    if (plotData.length === 0) {
        ctx.fillStyle = '#aaa';
        ctx.font = 'italic 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Sin registros de evolución', width / 2, height / 2);
        return;
    }

    // Reference Weights from AppState
    const pesoIdeal = AppState.patient?.peso_ideal || 0;
    const pesoAjustado = AppState.patient?.peso_ajustado || 0;

    // Normalize Data
    const weights = plotData.map(h => h.peso_kg);
    let allReferenceWeights = [pesoIdeal, pesoAjustado].filter(w => w > 0);

    const maxW = Math.max(...weights, ...allReferenceWeights) + 2;
    const minW = Math.max(0, Math.min(...weights, ...allReferenceWeights) - 2);
    const xStep = (plotData.length > 1) ? (width - 2 * padding) / (plotData.length - 1) : 0;

    const getY = (w) => {
        if (maxW === minW) return height / 2;
        return height - padding - ((w - minW) / (maxW - minW) * (height - 2 * padding));
    };

    // Draw Reference Lines FIRST
    if (pesoIdeal > 0) {
        const yIdeal = getY(pesoIdeal);
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.5)'; // Greenish for Ideal
        ctx.lineWidth = 1;
        ctx.moveTo(padding, yIdeal);
        ctx.lineTo(width - padding, yIdeal);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#27ae60';
        ctx.font = '8px Arial';
        ctx.fillText('Ideal', 5, yIdeal + 3);
    }

    if (pesoAjustado > 0) {
        const yAdj = getY(pesoAjustado);
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = 'rgba(243, 156, 18, 0.5)'; // Orange for Adjusted
        ctx.lineWidth = 1;
        ctx.moveTo(padding, yAdj);
        ctx.lineTo(width - padding, yAdj);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f39c12';
        ctx.font = '8px Arial';
        ctx.fillText('Ajust.', 5, yAdj + 3);
    }

    // Draw Axis
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw Evolution Line
    if (plotData.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#8e44ad'; // Purple theme matching card color
        ctx.lineWidth = 2.5;
        plotData.forEach((h, i) => {
            const x = padding + i * xStep;
            const y = getY(h.peso_kg);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    // Draw Points
    plotData.forEach((h, i) => {
        const x = (plotData.length > 1) ? padding + i * xStep : width / 2;
        const y = getY(h.peso_kg);
        
        // RED dot for current, Blue for previous, Purple/Orange for history
        if (h.isCurrent) {
            ctx.fillStyle = '#e74c3c';
        } else if (h.isPrevious) {
            ctx.fillStyle = '#3498db';
        } else {
            ctx.fillStyle = '#8e44ad'; 
        }
        
        ctx.beginPath();
        ctx.arc(x, y, (h.isCurrent || h.isPrevious) ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = h.isCurrent ? '#e74c3c' : (h.isPrevious ? '#3498db' : '#333');
        ctx.font = (h.isCurrent || h.isPrevious) ? 'bold 10px Arial' : 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(h.peso_kg, x, y - 8);
    });
}

// === CALCULADORA DE % PÉRDIDA DE PESO ===
window.calculateWeightLoss = () => {
    const ph = parseFloat(document.getElementById('lossPesoHabitual')?.value) || 0;
    const pn = parseFloat(document.getElementById('lossPesoActual')?.value) || 0;
    const interval = document.getElementById('lossInterval')?.value || '1m';
    
    const pctValEl = document.getElementById('lossPercentValue');
    const badgeEl = document.getElementById('lossClassificationBadge');
    
    if (!pctValEl || !badgeEl) return;
    
    if (ph <= 0 || pn <= 0) {
        pctValEl.innerText = '0.0%';
        badgeEl.style.display = 'none';
        return;
    }
    
    const pct = ((ph - pn) / ph) * 100;
    pctValEl.innerText = pct.toFixed(1) + '%';
    
    if (pct < 0) {
        badgeEl.innerText = 'Ganancia';
        badgeEl.style.display = 'inline-block';
        badgeEl.style.background = '#d1fae5';
        badgeEl.style.color = '#0f5132';
        badgeEl.style.border = '1px solid #badbcc';
        return;
    } else if (pct === 0) {
        badgeEl.innerText = 'Sin cambio';
        badgeEl.style.display = 'inline-block';
        badgeEl.style.background = '#f1f5f9';
        badgeEl.style.color = '#475569';
        badgeEl.style.border = '1px solid #cbd5e1';
        return;
    }
    
    // ASPEN Clinical Criteria for Weight Loss Severity
    let severity = 'Pérdida Leve';
    let bgColor = '#dbeafe';
    let textColor = '#1e40af';
    let borderColor = '#bfdbfe';
    
    if (interval === '1w') {
        if (pct > 2.0) {
            severity = 'Severa (>2%)';
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            borderColor = '#fecaca';
        } else if (pct >= 1.0) {
            severity = 'Moderada (1-2%)';
            bgColor = '#ffedd5';
            textColor = '#c2410c';
            borderColor = '#fed7aa';
        } else {
            severity = 'Leve (<1%)';
        }
    } else if (interval === '1m') {
        if (pct > 5.0) {
            severity = 'Severa (>5%)';
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            borderColor = '#fecaca';
        } else if (pct >= 1.0) {
            severity = 'Moderada (1-5%)';
            bgColor = '#ffedd5';
            textColor = '#c2410c';
            borderColor = '#fed7aa';
        } else {
            severity = 'Leve (<1%)';
        }
    } else if (interval === '3m') {
        if (pct > 7.5) {
            severity = 'Severa (>7.5%)';
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            borderColor = '#fecaca';
        } else if (pct >= 1.0) {
            severity = 'Moderada (1-7.5%)';
            bgColor = '#ffedd5';
            textColor = '#c2410c';
            borderColor = '#fed7aa';
        } else {
            severity = 'Leve (<1%)';
        }
    } else if (interval === '6m') {
        if (pct > 10.0) {
            severity = 'Severa (>10%)';
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            borderColor = '#fecaca';
        } else if (pct >= 1.0) {
            severity = 'Moderada (1-10%)';
            bgColor = '#ffedd5';
            textColor = '#c2410c';
            borderColor = '#fed7aa';
        } else {
            severity = 'Leve (<1%)';
        }
    }
    
    badgeEl.innerText = severity;
    badgeEl.style.display = 'inline-block';
    badgeEl.style.background = bgColor;
    badgeEl.style.color = textColor;
    badgeEl.style.border = '1px solid ' + borderColor;
}

function initEvolutionLogic() {
    const btnLog = document.getElementById('btnLogEvolution');
    if (btnLog) {
        btnLog.onclick = async () => {
            const p = AppState.patient;
            const nombre = document.getElementById('nombre')?.value;
            const peso = parseFloat(document.getElementById('peso')?.value) || 0;

            if (!nombre || peso <= 0) {
                showToast("⚠️ Ingresa nombre y peso para registrar");
                return;
            }

            btnLog.disabled = true;
            btnLog.innerText = "â³ Registrando...";

            try {
                const metadata = {
                    is_evolution_point: true,
                    peso_ideal: p.peso_ideal || 0,
                    peso_ajustado: p.peso_ajustado || 0,
                    logged_at: new Date().toISOString()
                };

                const data = {
                    nombre: nombre,
                    peso_kg: peso,
                    user_id: AppState.user.id,
                    metadata: metadata,
                    estado_sala: 'activo'
                };

                const { error } = await supabaseClient.from('pacientes').insert([data]);
                if (error) throw error;

                showToast("ðŸ“ˆ Punto de evolución registrado");
                updatePatientEvolutionChart(nombre);
            } catch (err) {
                console.error("Error logging evolution:", err);
                showToast("âŒ Error al registrar punto");
            } finally {
                btnLog.disabled = false;
                btnLog.innerText = "Actualizar Gráfico con Peso";
            }
        };
    }
}


window.loadPatient = async (id) => {
    const { data } = await supabaseClient.from('pacientes').select('*').eq('id', id).single();
    if (data) {
        AppState.patient.id = data.id;
        AppState.patient.ia_report = data.ia_report || null;

        document.getElementById('nombre').value = data.nombre;
        document.getElementById('edad').value = data.edad;
        document.getElementById('peso').value = data.peso_kg;
        document.getElementById('estatura').value = data.estatura_m;

        // Restore IA report if exists
        const resultBox = document.getElementById('iaResultContainer');
        const welcomeBox = document.getElementById('iaInitialState');
        if (data.ia_report && resultBox) {
            resultBox.style.display = 'block';
            resultBox.innerHTML = formatIAResponse(data.ia_report);
            if (welcomeBox) welcomeBox.style.display = 'none';
        } else if (resultBox) {
            resultBox.style.display = 'none';
            if (welcomeBox) welcomeBox.style.display = 'block';
        }

        // Trigger calc
        calculateRequirements();

        // Restore goals if exist
        if (data.metadata && data.metadata.simulator) {
            const sim = data.metadata.simulator;
            // Clear current simulator inputs first
            const simInputs = ['formulaSelect', 'volume', 'dilution', 'modNessucar', 'modMCT', 'modEnterex', 'modBanatrol', 'modProteinex', 'modFresubin', 'oralKcal', 'oralProt', 'oralCHO', 'oralLip', 'oralWater', 'ivVolume'];
            simInputs.forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
            if(document.getElementById('ivType')) document.getElementById('ivType').value = 'none';

            if (sim.macro_mode) {
                if (sim.macro_mode === 'pct') {
                    document.getElementById('btnModePct')?.click();
                } else {
                    document.getElementById('btnModeGkg')?.click();
                }
            }
            if (sim.goal_prot) document.getElementById('goalProtKg').value = sim.goal_prot;
            if (sim.goal_cho) document.getElementById('goalCHOKg').value = sim.goal_cho;
            if (sim.goal_lip) document.getElementById('goalLipKg').value = sim.goal_lip;
            
            // Restore simulator values
            if (sim.formula) {
                document.getElementById('formulaSelect').value = sim.formula;
                const formulaObj = AppState.formulas.find(f => f.id === sim.formula);
                renderFormulaInputs(formulaObj);
            }
            if (sim.volume) document.getElementById('volume').value = sim.volume;
            if (sim.volume_times) document.getElementById('volumeTimes').value = sim.volume_times;
            if (sim.dilution) document.getElementById('dilution').value = sim.dilution;
            
            if (sim.modules) {
                Object.keys(sim.modules).forEach(m => {
                    const el = document.getElementById('mod' + m.charAt(0).toUpperCase() + m.slice(1));
                    if (el) el.value = sim.modules[m];
                });
            }
            if (sim.oral) {
                document.getElementById('oralKcal').value = sim.oral.kcal || '';
                document.getElementById('oralProt').value = sim.oral.prot || '';
                document.getElementById('oralCHO').value = sim.oral.cho || '';
                document.getElementById('oralLip').value = sim.oral.lip || '';
                document.getElementById('oralWater').value = sim.oral.water || '';
            }
            if (sim.iv) {
                document.getElementById('ivType').value = sim.iv.type || 'none';
                document.getElementById('ivVolume').value = sim.iv.volume || '';
            }

            if (typeof updateMacroGoals === 'function') updateMacroGoals();
            runSimulation(); 
        } else {
            // If no simulator metadata, clear inputs anyway
            const simInputs = ['formulaSelect', 'volume', 'dilution', 'modNessucar', 'modMCT', 'modEnterex', 'modBanatrol', 'modProteinex', 'modFresubin', 'oralKcal', 'oralProt', 'oralCHO', 'oralLip', 'oralWater', 'ivVolume'];
            simInputs.forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
            if(document.getElementById('ivType')) document.getElementById('ivType').value = 'none';
            runSimulation();
        }

        document.getElementById('historyModal').classList.remove('active');

        // Update Chart for loaded patient (nuevo panel en cálculo)
        if (typeof updatePatientEvolutionChart === 'function') {
            updatePatientEvolutionChart(data.nombre);
        }
    }
};

window.updatePatientEvolutionChart = async (nombre) => {
    if (!nombre) return;
    if (!AppState.user || !AppState.user.id) {
        console.warn("updatePatientEvolutionChart: AppState.user not loaded.");
        return;
    }

    const chartSection = document.getElementById('chartContainer');
    if (!chartSection) return;

    // Decoupled: Only fetch records that are explicitly evolution points
    const { data: records, error } = await supabaseClient
        .from('pacientes')
        .select('*, metadata')
        .eq('user_id', AppState.user.id)
        .eq('nombre', nombre)
        .neq('estado_sala', 'eliminado')
        .order('created_at', { ascending: false });

    // Filter by flag in metadata
    const evolutionPoints = (records || []).filter(r => r.metadata?.is_evolution_point === true);

    if (!error && evolutionPoints.length > 0) {
        const history = evolutionPoints.slice(0, 10).reverse();
        AppState.currentEvolutionHistory = history; // Store for real-time updates
        const lbl = document.getElementById('lblChartPatientName');
        if (lbl) lbl.innerText = nombre;
        renderEvolutionChart(history);
    } else {
        AppState.currentEvolutionHistory = [];
        const lbl = document.getElementById('lblChartPatientName');
        if (lbl) lbl.innerText = nombre || '--';
        renderEvolutionChart([]);
    }
};

// NEW V3.90: Phase 10 Amputee Engine
window.calcAmputations = () => {
    let factor = 0;
    const checks = document.querySelectorAll('.amp-check');
    if (!checks) return 0;
    checks.forEach(c => {
        if (c.checked) factor += parseFloat(c.value);
    });
    const el = document.getElementById('ampTotalVal');
    if (el) el.innerText = factor.toFixed(1);
    return factor;
};

function calculateRequirements() {
    const p = AppState.patient;
    const nombreEl = document.getElementById('nombre');
    const edadEl = document.getElementById('edad');
    const pesoEl = document.getElementById('peso');
    const estaturaEl = document.getElementById('estatura');
    const actividadEl = document.getElementById('actividad');
    const estresEl = document.getElementById('estres');
    const sexoEl = document.getElementById('sexo');

    if (!nombreEl || !edadEl || !pesoEl || !estaturaEl || !actividadEl || !sexoEl) return;

    p.nombre = nombreEl.value;
    p.edad = parseFloat(edadEl.value) || 0;
    p.peso = parseFloat(pesoEl.value) || 0;
    
    // Normalize height/estatura: if entered in cm (e.g. > 3), convert to meters
    const rawEst = parseFloat(estaturaEl.value) || 0;
    p.estatura = rawEst > 3 ? rawEst / 100 : rawEst;
    
    p.actividad = parseFloat(actividadEl.value) || 1.0;
    p.estres = parseFloat(estresEl?.value) || 1.0;
    p.sexo = sexoEl.value; // Store in AppState
    const sexo = p.sexo;

    p.type = document.querySelector('input[name="patientType"]:checked')?.value || 'adult';

    // Freshly calculate BMI so Z-scores use the updated value immediately
    if (p.peso > 0 && p.estatura > 0) {
        p.bmi = p.peso / (p.estatura * p.estatura);
    }

    // Pediatric Z-Score Execution Engine
    renderPediatricZScores();

    // NEW V3.19/V3.90: Ideal Weight & IPT (Real-time) + Amputee Correction
    let rawPesoIdeal = 0;

    if (p.type === 'pediatric' || p.type === 'neonate') {
        const y = (p.evalParts || p.ageParts || {}).y || 0;
        let m = p.exactMonths || 0;
        const d = (p.evalParts || p.ageParts || {}).d || 0;
        const cm = p.estatura > 3 ? p.estatura : p.estatura * 100;

        const isUnderOne = (y === 0 && (m < 11 || (m === 11 && d <= 14)));
        let zWFH = null;
        if (cm > 0 && p.peso > 0) {
            zWFH = getZScore('wfh', cm, p.sexo, p.peso);
        }

        if (y > 5 || (y === 5 && m >= 1)) {
            // Niños mayores > 5 años y Adolescentes: Mediana del IMC/E
            const medianBMI = getLMSMedian('bmi', m, p.sexo);
            if (medianBMI && p.estatura > 0) {
                rawPesoIdeal = medianBMI * (p.estatura * p.estatura);
            }
        } else if (!isUnderOne || (isUnderOne && zWFH !== null && zWFH >= 1.0)) {
            // Excepción P/T: Preescolares (1-5) o lactantes con Sobrepeso/Obesidad (P/T >= 1)
            if (cm > 0) rawPesoIdeal = getLMSMedian('wfh', cm, p.sexo);
        } else {
            // Lactantes regulares (< 1 año)
            rawPesoIdeal = getLMSMedian('wfa', m, p.sexo);
        }

        if (rawPesoIdeal) {
            document.getElementById('valIdealWeight').innerText = rawPesoIdeal.toFixed(1) + ' kg*';
        } else {
            document.getElementById('valIdealWeight').innerText = '--';
        }

    } else if (p.estatura > 0 && p.edad > 0) {
        // Adult Logic
        const factorIdx = p.edad >= 65 ? 25.5 : 21.7;
        rawPesoIdeal = factorIdx * (p.estatura * p.estatura);
        document.getElementById('valIdealWeight').innerText = rawPesoIdeal.toFixed(1) + ' kg';
    }

    if (rawPesoIdeal > 0) {
        let pesoIdeal = rawPesoIdeal;
        p.peso_ideal = pesoIdeal;

        // --- AMPUTEE OSTERKAMP CORRECTION ---
        const ampFactor = window.calcAmputations ? window.calcAmputations() : 0;
        const ampContainer = document.getElementById('ampWeightAdjContainer');
        const ampValDisplay = document.getElementById('ampWeightAdj');

        if (ampFactor > 0) {
            pesoIdeal = rawPesoIdeal * ((100 - ampFactor) / 100);
            if (ampContainer) ampContainer.style.display = 'block';
            if (ampValDisplay) ampValDisplay.innerText = pesoIdeal.toFixed(1) + ' kg';
        } else {
            if (ampContainer) ampContainer.style.display = 'none';
        }

        if (p.peso > 0) {
            const ipt = (p.peso / pesoIdeal) * 100;
            const iptVal = ipt.toFixed(1);
            document.getElementById('valIPT').innerText = iptVal + '%';

            // NEW: Peso Ajustado para Obesos (IPT > 120%) -> Ahora permanente para Adultos
            const elPesoAjustado = document.getElementById('valPesoAjustado');
            if (elPesoAjustado) {
                if (p.type === 'adult') {
                    const adjW = pesoIdeal + 0.40 * (p.peso - pesoIdeal);
                    elPesoAjustado.innerText = adjW.toFixed(1) + ' kg';

                    if (ipt > 120) {
                        elPesoAjustado.style.color = '#c0392b'; // Warning rojo
                    } else {
                        elPesoAjustado.style.color = '#f39c12'; // Naranja normal
                    }
                    p.peso_ajustado = adjW;
                } else {
                    elPesoAjustado.innerText = "No aplica";
                    elPesoAjustado.style.color = '#888';
                }
            }

            // NEW: Superficie Corporal (Mosteller)
            const elSCT = document.getElementById('valSCT');
            if (elSCT && p.estatura > 0) {
                const sctVal = Math.sqrt((p.peso * (p.estatura * 100)) / 3600);
                elSCT.innerText = sctVal.toFixed(2) + ' mÂ²';
            }

            // IPT Classification Logic V3.22
            const iptClassEl = document.getElementById('valIPTClass');
            if (iptClassEl) {
                let status = "";
                const age = p.edad;

                if (age > 18) {
                    // Adults
                    if (ipt < 75) status = "Desnutrición Severa";
                    else if (ipt <= 84) status = "Desnutrición Moderada";
                    else if (ipt <= 89) status = "Desnutrición Leve";
                    else if (ipt <= 110) status = "Normal";
                    else status = "Sobrepeso/Obesidad";
                } else {
                    // Pediatrics / Adolescents (> 70% cutoff seems like Severe type III?)
                    // User criteria: 80-90 (Leve I), 70-79 (Mod II), <70 (Sev III)
                    if (ipt < 70) status = "Desnutrición Severa (G. III)";
                    else if (ipt <= 79) status = "Desnutrición Moderada (G. II)";
                    else if (ipt <= 90) status = "Desnutrición Leve (G. I)";
                    else if (ipt <= 110) status = "Normal";
                    else status = "Sobrepeso";
                }
                iptClassEl.innerText = status;
                iptClassEl.style.color = status.includes("Normal") ? "#27ae60" : "#c0392b";
            }
        }
    }

    if (p.peso > 0 && p.estatura > 0) {
        p.bmi = p.peso / (p.estatura * p.estatura);
        document.getElementById('valBMI').innerText = p.bmi.toFixed(1);
    }

    // Call waist evaluation for all patient types
    if (window.evaluateWaist) window.evaluateWaist();

    if (p.peso > 0 && p.edad > 0) {
        // --- Peso de Cálculo Metabólico ---
        let w = p.peso;
        const selCalculo = document.getElementById('pesoCalculoSelect')?.value;
        if (selCalculo === 'ideal' && p.peso_ideal > 0) {
            w = p.peso_ideal;
        } else if (selCalculo === 'ajustado' && p.peso_ajustado > 0) {
            w = p.peso_ajustado;
        } else if (selCalculo === 'dry') {
            const edemaKg = parseFloat(document.getElementById('edemaGrade')?.value) || 0;
            const ascitisKg = parseFloat(document.getElementById('ascitesGrade')?.value) || 0;
            w = Math.max(0, p.peso - (edemaKg + ascitisKg));
        }
        p.peso_calculo = w; // Store to use in macronutrient goals globally

        // --- TMB (OMS/WHO) AUTOMATIC ---
        let bmr = 0;
        let method = document.getElementById('tmbMethod').value;
        const cm = p.estatura * 100;

        // FAO/OMS
        if (method === 'oms') {
            if (sexo === 'm') {
                if (p.edad < 3) bmr = (60.9 * w) - 54;
                else if (p.edad < 10) bmr = (22.7 * w) + 495;
                else if (p.edad < 18) bmr = (17.5 * w) + 651;
                else if (p.edad < 30) bmr = (15.3 * w) + 679;
                else if (p.edad < 60) bmr = (11.6 * w) + 879;
                else bmr = (13.5 * w) + 487;
            } else {
                if (p.edad < 3) bmr = (61.0 * w) - 51;
                else if (p.edad < 10) bmr = (22.5 * w) + 499;
                else if (p.edad < 18) bmr = (12.2 * w) + 746;
                else if (p.edad < 30) bmr = (14.7 * w) + 496;
                else if (p.edad < 60) bmr = (8.7 * w) + 829;
                else bmr = (10.5 * w) + 596;
            }
        }
        // Harris-Benedict (Original 1919 Clásica)
        else if (method === 'hb') {
            if (sexo === 'm') {
                bmr = 66.47 + (13.75 * w) + (5.0 * cm) - (6.75 * p.edad);
            } else {
                bmr = 655.09 + (9.56 * w) + (1.84 * cm) - (4.67 * p.edad);
            }
        }
        // Schofield (1985) - Consistently synced with calcTMB_OMS
        else if (method === 'schofield') {
            if (sexo === 'm') {
                if (p.edad < 3) bmr = 59.512 * w - 30.4;
                else if (p.edad < 10) bmr = 22.706 * w + 504.3;
                else if (p.edad < 18) bmr = 17.686 * w + 658.2;
                else if (p.edad < 30) bmr = 15.057 * w + 692.2;
                else if (p.edad < 60) bmr = 11.472 * w + 873.1;
                else bmr = 11.711 * w + 587.7;
            } else {
                if (p.edad < 3) bmr = 58.317 * w - 31.1;
                else if (p.edad < 10) bmr = 20.315 * w + 485.9;
                else if (p.edad < 18) bmr = 13.384 * w + 692.6;
                else if (p.edad < 30) bmr = 14.818 * w + 486.6;
                else if (p.edad < 60) bmr = 8.126 * w + 845.6;
                else bmr = 9.082 * w + 658.5;
            }
        }
        // Valencia (América Latina)
        else if (method === 'valencia') {
            if (sexo === 'm') {
                if (p.edad < 30) bmr = (13.37 * w) + 747;
                else if (p.edad < 60) bmr = (11.02 * w) + 679;
                else bmr = (10.92 * w) + 510;
            } else {
                if (p.edad < 30) bmr = (11.02 * w) + 679;
                else if (p.edad < 60) bmr = (10.92 * w) + 510;
                else bmr = (10.98 * w) + 520;
            }
        }
        // Roza y Shizgal (Harris-Benedict Revisada 1984)
        else if (method === 'rozashizgal') {
            if (sexo === 'm') {
                bmr = 88.362 + (13.397 * w) + (4.799 * cm) - (5.677 * p.edad);
            } else {
                bmr = 447.593 + (9.247 * w) + (3.098 * cm) - (4.330 * p.edad);
            }
        }
        // Owen (1986)
        else if (method === 'owen') {
            if (sexo === 'm') {
                bmr = 879 + (10.2 * w);
            } else {
                bmr = 795 + (7.18 * w);
            }
        }

        // Mifflin-St Jeor
        else if (method === 'msj') {
            if (sexo === 'm') {
                bmr = (10 * w) + (6.25 * cm) - (5 * p.edad) + 5;
            } else {
                bmr = (10 * w) + (6.25 * cm) - (5 * p.edad) - 161;
            }
        }

        const isQuemado = document.getElementById('chkQuemado')?.checked && p.peso > 0;
        const scqPercent = parseFloat(document.getElementById('scqPercent')?.value) || 0;
        let finalTMT = bmr * p.actividad * p.estres;
        let eqName = "(TMB";
        if (p.actividad !== 1.0) eqName += " Ã— FA";
        if (p.estres !== 1.0) eqName += " Ã— FE";
        eqName += ")";

        if (isQuemado && scqPercent > 0) {
            if (p.type === 'pediatric' || p.type === 'neonate') {
                // Galveston
                const sct = Math.sqrt((p.peso * cm) / 3600);
                const scqM2 = sct * (scqPercent / 100);
                document.getElementById('scqM2').value = scqM2.toFixed(2);
                finalTMT = (1800 * sct) + (2200 * scqM2);
                eqName = "Galveston (Quemados)";
                bmr = finalTMT / (p.actividad * p.estres); // Back-calculate display mock
            } else {
                // Curreri
                finalTMT = (25 * p.peso) + (40 * scqPercent);
                eqName = "Curreri (Quemados)";
                bmr = finalTMT / (p.actividad * p.estres);
            }
        }

        const resTMB = document.getElementById('resTMB');
        if (resTMB) resTMB.innerHTML = `${Math.round(finalTMT)} kcal <span style="font-size:0.6rem;">${eqName}</span>`;
        p.tmt_calculated = finalTMT;

        // Ensure factorial is also calculated
        calcFactorialNoRecursion();

        // Update Official GET Based on Selection
        window.updateSelectedGET();

        calcHydration();
        runSimulation();
    }
    
    // Re-render chart to reflect current point instantly
    if (typeof renderEvolutionChart === 'function') {
        renderEvolutionChart(AppState.currentEvolutionHistory || []);
    }

    // Auto-sync % Weight Loss Calculator
    const lossActualInput = document.getElementById('lossPesoActual');
    const lossHabitualInput = document.getElementById('lossPesoHabitual');
    const pesoAnteriorVal = parseFloat(document.getElementById('pesoAnterior')?.value) || 0;
    
    if (lossActualInput && p.peso > 0) {
        lossActualInput.value = p.peso;
    }
    if (lossHabitualInput && pesoAnteriorVal > 0 && !lossHabitualInput.value) {
        lossHabitualInput.value = pesoAnteriorVal;
    }
    if (typeof window.calculateWeightLoss === 'function') {
        window.calculateWeightLoss();
    }
}

function calcFactorialNoRecursion() {
    const p = AppState.patient;
    const fKcal = parseFloat(document.getElementById('factorKcal')?.value) || 25;
    const pesoCalculo = p.peso_calculo || p.peso;
    if (pesoCalculo > 0) {
        const factTotal = pesoCalculo * fKcal;
        p.factorial_calculated = factTotal;
        const resF = document.getElementById('resFactorial');
        if (resF) resF.innerText = `${Math.round(factTotal)} kcal`;
    }
}

// === NEW V3.80: PEDIATRIC & NEONATAL ENGINE ===

window.togglePatientMode = () => {
    const mode = document.querySelector('input[name="patientType"]:checked').value;
    AppState.patient.type = mode;

    const colEdad = document.getElementById('colEdad');
    if (colEdad) colEdad.style.display = mode === 'adult' ? 'block' : 'none';
    
    const colCintura = document.getElementById('colCintura');
    if (colCintura) colCintura.style.display = mode === 'neonate' ? 'none' : 'block';
    
    const colPcefalico = document.getElementById('colPcefalico');
    if (colPcefalico) colPcefalico.style.display = (mode === 'pediatric' || mode === 'neonate') ? 'block' : 'none';
    
    const rowPediatric = document.getElementById('rowPediatric');
    if (rowPediatric) rowPediatric.style.display = (mode === 'pediatric' || mode === 'neonate') ? 'flex' : 'none';
    
    const rowNeonate = document.getElementById('rowNeonate');
    if (rowNeonate) rowNeonate.style.display = mode === 'neonate' ? 'flex' : 'none';

    const fortPanel = document.getElementById('fortifierNeonatePanel');
    if (fortPanel) fortPanel.style.display = mode === 'neonate' ? 'block' : 'none';

    const rowSpec = document.getElementById('rowSpecialPopulations');
    if (rowSpec) rowSpec.style.display = mode === 'pediatric' ? 'flex' : 'none';

    // Hide edema panel drop button for Neonates
    const btnEdemaDrop = document.getElementById('btnEdemaDrop');
    const edemaPanel = document.getElementById('edemaPanel');
    if (btnEdemaDrop) {
        btnEdemaDrop.style.display = mode === 'neonate' ? 'none' : 'inline';
    }
    if (mode === 'neonate') {
        if (edemaPanel) edemaPanel.style.display = 'none';
        const edemaGrade = document.getElementById('edemaGrade');
        const ascitesGrade = document.getElementById('ascitesGrade');
        if (edemaGrade) edemaGrade.value = '0';
        if (ascitesGrade) ascitesGrade.value = '0';
        window.updateDryWeight();
    }

    // Show/hide and reset frequency inputs for pediatric / neonate
    const timesWrapper = document.getElementById('volumeTimesWrapper');
    const totalWrapper = document.getElementById('volumeTotalDisplayWrapper');
    const timesOp = document.getElementById('volumeTimesOperator');
    const totalOp = document.getElementById('volumeTotalOperator');
    const dilutionWrap = document.getElementById('dilutionWrapper');
    if (timesWrapper && totalWrapper) {
        if (mode === 'pediatric' || mode === 'neonate') {
            timesWrapper.style.display = 'block';
            totalWrapper.style.display = 'block';
            if (timesOp) timesOp.style.display = 'flex';
            if (totalOp) totalOp.style.display = 'flex';
            if (dilutionWrap) {
                dilutionWrap.style.flex = '1 1 100%';
                dilutionWrap.style.maxWidth = '250px';
                dilutionWrap.style.marginTop = '10px';
            }
        } else {
            timesWrapper.style.display = 'none';
            totalWrapper.style.display = 'none';
            if (timesOp) timesOp.style.display = 'none';
            if (totalOp) totalOp.style.display = 'none';
            if (dilutionWrap) {
                dilutionWrap.style.flex = '1';
                dilutionWrap.style.maxWidth = '';
                dilutionWrap.style.marginTop = '0';
            }
            // Reset to 1 for adults to prevent calculation issues
            const timesInp = document.getElementById('volumeTimes');
            if (timesInp) timesInp.value = '1';
        }
    }
    window.updateVolumeTotal && window.updateVolumeTotal();

    document.getElementById('pediatricAssessmentResults').style.display = (mode === 'pediatric' || mode === 'neonate') ? 'block' : 'none';

    const iwRow = document.getElementById('valIdealWeight')?.parentElement?.parentElement;
    if (iwRow) iwRow.style.display = mode === 'adult' ? 'flex' : 'none';

    // Alternar visibilidad de tamizajes condicionales (STRONGkids vs NRS 2002)
    const strongKidsCard = document.getElementById('strongKidsCard');
    const nrs2002Card = document.getElementById('nrs2002Card');
    if (strongKidsCard) {
        strongKidsCard.style.display = (mode === 'pediatric' || mode === 'neonate') ? 'block' : 'none';
    }
    if (nrs2002Card) {
        nrs2002Card.style.display = mode === 'adult' ? 'block' : 'none';
        if (mode === 'adult' && typeof window.calculateNRS2002 === 'function') {
            window.calculateNRS2002();
        }
    }

    // Toggle growth curves and weight evolution visibility in Evaluación Completa
    const growthCurvesCard = document.getElementById('growthCurvesCard');
    const weightEvolutionCard = document.getElementById('weightEvolutionCard');
    if (growthCurvesCard) {
        growthCurvesCard.style.display = (mode === 'pediatric' || mode === 'neonate') ? 'block' : 'none';
    }
    if (weightEvolutionCard) {
        weightEvolutionCard.style.display = 'block';
    }

    calculateRequirements();
    if (typeof window.updateInfusionProposal === 'function') window.updateInfusionProposal();
    if (typeof window.updateCurveButtons === 'function') window.updateCurveButtons();
};

window.toggleQuemado = () => {
    const chk = document.getElementById('chkQuemado');
    const panel = document.getElementById('quemadoPanel');
    const estresEl = document.getElementById('estres');

    if (chk && panel) {
        const isPeds = AppState.patient.type === 'pediatric' || AppState.patient.type === 'neonate';
        const protInput = document.getElementById('goalProtKg');

        if (chk.checked) {
            panel.style.display = 'block';
            if (estresEl && parseFloat(estresEl.value) < 1.5) {
                estresEl.value = "1.5"; // Auto set stress to minimum burn multiplier
            }
            if (protInput && typeof macroGoalMode !== 'undefined' && macroGoalMode === 'gkg') {
                protInput.placeholder = isPeds ? "Ej. 2.5 - 3.0" : "Ej. 1.5 - 2.5";
            }
        } else {
            panel.style.display = 'none';
            if (protInput && typeof macroGoalMode !== 'undefined' && macroGoalMode === 'gkg') {
                protInput.placeholder = "Ej. 1.5";
            }
        }
    }
    calculateRequirements();
};

window.calculatePediatricAge = () => {
    const fn = document.getElementById('fechaNacimiento').value;
    const birth = parseSpanishDate(fn);
    if (!birth) {
        // If birth date is not entered or invalid, hide panels
        const panelPeds = document.getElementById('pedsPrematurityPanel');
        if (panelPeds) panelPeds.style.display = 'none';
        const panelNeo = document.getElementById('neonateCorrectedAgePanel');
        if (panelNeo) panelNeo.style.display = 'none';
        return;
    }

    const now = new Date();

    // Clear hours to ensure exact day differences
    now.setHours(0,0,0,0);

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const totalMonths = (years * 12) + months;
    let ageInYears = (totalMonths + (days / 30.4375)) / 12;
    document.getElementById('edad').value = ageInYears.toFixed(2);

    let ageStr = "";
    if (years > 0) ageStr += `${years} año${years > 1 ? 's' : ''}, `;
    if (months > 0 || years > 0) ageStr += `${months} mes${months !== 1 ? 'es' : ''}, `;
    ageStr += `${days} día${days !== 1 ? 's' : ''}`;

    const d = String(birth.getDate()).padStart(2, '0');
    const mm = String(birth.getMonth() + 1).padStart(2, '0');
    const y = birth.getFullYear();
    const formattedDate = `${d}/${mm}/${y}`;
    
    if (AppState.patient.type === 'neonate') {
        const semNac = parseInt(document.getElementById('egSemanas').value) || 0;
        const diasNac = parseInt(document.getElementById('egDias').value) || 0;
        const totalDaysChrono = Math.floor(Math.abs(now - birth) / (1000 * 60 * 60 * 24));
        const totalDays = (semNac * 7) + diasNac + totalDaysChrono;
        const semCorr = Math.floor(totalDays / 7);
        const diasCorr = totalDays % 7;
        ageStr += ` | <span style="color:#e74c3c; font-weight:700;">EG Corregida: ${semCorr} sem + ${diasCorr} d</span>`;
    }
    
    document.getElementById('lblExactAge').innerHTML = `<span style="font-weight:700; color:#2c3e50;">F. Nacimiento: ${formattedDate}</span> | ${ageStr}`;

    let evalMonths = totalMonths;
    let evalY = years;
    let evalM = months;
    if (days >= 16) {
        evalMonths += 1;
        evalM += 1;
        if (evalM >= 12) {
            evalY += 1;
            evalM -= 12;
        }
    }

    AppState.patient.exactMonths = evalMonths;
    AppState.patient.ageParts = { y: years, m: months, d: days };
    AppState.patient.evalParts = { y: evalY, m: evalM, d: days };

    // Calculate Corrected Age
    const isPeds = AppState.patient.type === 'pediatric';
    const isNeo = AppState.patient.type === 'neonate';
    
    // Chronological days calculation
    const totalDaysChrono = Math.floor(Math.abs(now - birth) / (1000 * 60 * 60 * 24));

    // Show/Hide prematurity panel in pediatric mode based on chronological age (< 2 years)
    const pedsPrematurityPanel = document.getElementById('pedsPrematurityPanel');
    if (pedsPrematurityPanel) {
        pedsPrematurityPanel.style.display = (isPeds && totalMonths < 24) ? 'block' : 'none';
    }

    if (isPeds && totalMonths < 24) {
        const semNacer = parseInt(document.getElementById('egSemanasPeds')?.value) || 0;
        const diasNacer = parseInt(document.getElementById('egDiasPeds')?.value) || 0;
        const displayEl = document.getElementById('lblCorrectedAgeDisplay');

        if (semNacer > 0 && semNacer < 37) {
            // Premature baby!
            const prematurityDays = (40 * 7) - (semNacer * 7 + diasNacer);
            const correctedDays = totalDaysChrono - prematurityDays;

            if (correctedDays < 0) {
                if (displayEl) {
                    displayEl.innerHTML = `⚠️ No ha alcanzado la Fecha Probable de Parto (FPP: ${Math.abs(correctedDays)} días restantes)`;
                }
                AppState.patient.exactMonthsCorr = 0;
                AppState.patient.agePartsCorr = { y: 0, m: 0, d: 0 };
                AppState.patient.evalPartsCorr = { y: 0, m: 0, d: 0 };
            } else {
                const corrY = Math.floor(correctedDays / 365.25);
                const remainingDays = correctedDays % 365.25;
                const corrM = Math.floor(remainingDays / 30.4375);
                const corrD = Math.round(remainingDays % 30.4375);

                let corrStr = "Edad Corregida: ";
                if (corrY > 0) corrStr += `${corrY} año${corrY > 1 ? 's' : ''}, `;
                if (corrM > 0 || corrY > 0) corrStr += `${corrM} mes${corrM !== 1 ? 'es' : ''}, `;
                corrStr += `${corrD} día${corrD !== 1 ? 's' : ''}`;

                if (displayEl) displayEl.innerText = corrStr;

                let evalMonthsCorr = (corrY * 12) + corrM;
                let corrEvalY = corrY;
                let corrEvalM = corrM;
                if (corrD >= 16) {
                    evalMonthsCorr += 1;
                    corrEvalM += 1;
                    if (corrEvalM >= 12) {
                        corrEvalY += 1;
                        corrEvalM -= 12;
                    }
                }

                AppState.patient.exactMonthsCorr = evalMonthsCorr;
                AppState.patient.agePartsCorr = { y: corrY, m: corrM, d: corrD };
                AppState.patient.evalPartsCorr = { y: corrEvalY, m: corrEvalM, d: corrD };
            }
        } else {
            if (displayEl) displayEl.innerText = "Edad Corregida: -- (No prematuro / No ingresado)";
            delete AppState.patient.exactMonthsCorr;
            delete AppState.patient.agePartsCorr;
            delete AppState.patient.evalPartsCorr;
        }
    } else {
        delete AppState.patient.exactMonthsCorr;
        delete AppState.patient.agePartsCorr;
        delete AppState.patient.evalPartsCorr;
    }

    // Neonatal Corrected Age calculations
    const neonateAgePanel = document.getElementById('neonateCorrectedAgePanel');
    if (neonateAgePanel) {
        neonateAgePanel.style.display = isNeo ? 'flex' : 'none';
    }

    if (isNeo) {
        const semNacer = parseInt(document.getElementById('egSemanas')?.value) || 0;
        const diasNacer = parseInt(document.getElementById('egDias')?.value) || 0;

        const lblChrono = document.getElementById('lblNeonateChronologicalAge');
        const lblCorrGest = document.getElementById('lblNeonateCorrectedGestation');
        const lblCorrPost = document.getElementById('lblNeonateCorrectedPostnatal');

        if (lblChrono) {
            lblChrono.innerText = `Edad Cronológica Postnatal: ${totalDaysChrono} días (${Math.floor(totalDaysChrono / 7)} sem, ${totalDaysChrono % 7} días)`;
        }

        if (semNacer > 0) {
            // Corrected Gestational Age: EG al nacer + chronological age
            const totalDaysGestNacer = (semNacer * 7) + diasNacer;
            const totalDaysGestCorr = totalDaysGestNacer + totalDaysChrono;
            const semGestCorr = Math.floor(totalDaysGestCorr / 7);
            const diasGestCorr = totalDaysGestCorr % 7;

            if (lblCorrGest) {
                lblCorrGest.innerText = `Edad Gestacional Corregida: ${semGestCorr} semanas + ${diasGestCorr} días`;
            }

            // Corrected Postnatal Age: chronological age - prematurity days
            const prematurityDays = (40 * 7) - totalDaysGestNacer;
            const correctedDaysPost = totalDaysChrono - prematurityDays;

            if (lblCorrPost) {
                if (correctedDaysPost < 0) {
                    lblCorrPost.innerText = `Edad Postnatal Corregida: -${Math.abs(correctedDaysPost)} días (Faltan ${Math.abs(correctedDaysPost)} días para término)`;
                } else {
                    const corrPostSem = Math.floor(correctedDaysPost / 7);
                    const corrPostDias = correctedDaysPost % 7;
                    lblCorrPost.innerText = `Edad Postnatal Corregida: ${corrPostSem} semanas + ${corrPostDias} días`;
                }
            }
        } else {
            if (lblCorrGest) lblCorrGest.innerText = `Edad Gestacional Corregida: -- (Falta EG al nacer)`;
            if (lblCorrPost) lblCorrPost.innerText = `Edad Postnatal Corregida: -- (Falta EG al nacer)`;
        }
    }

    calculateRequirements();
    if (typeof window.calculateNRS2002 === 'function') {
        window.calculateNRS2002();
    }
};

function getLMSMedian(indicator, keyVal, sexo) {
    const specCond = document.getElementById('specialCondition')?.value || 'none';
    const sexKey = sexo === 'm' ? 'boys' : 'girls';

    let table = null;
    let isInterpolated = false;

    if (specCond === 'down' && window.ZEMEL_DATA && window.ZEMEL_DATA[indicator]) {
        table = window.ZEMEL_DATA[indicator][sexKey];
        isInterpolated = true;
    } else if (specCond.startsWith('cp_') && window.BROOKS_DATA) {
        let cpGroup = 'gmfcs_1_2';
        if (specCond === 'cp_iii_iv') cpGroup = 'gmfcs_3_4';
        else if (specCond === 'cp_v') cpGroup = 'gmfcs_5';

        if (window.BROOKS_DATA[cpGroup] && window.BROOKS_DATA[cpGroup][indicator]) {
            table = window.BROOKS_DATA[cpGroup][indicator][sexKey];
            isInterpolated = true;
        }
    }

    if (!table && indicator === 'hc' && window.NEURO_HC_DATA && window.NEURO_HC_DATA.hc) {
        table = window.NEURO_HC_DATA.hc[sexKey];
        isInterpolated = true;
    }

    if (!table) {
        if (!window.MINSAL_DATA || !window.MINSAL_DATA[indicator]) return null;
        table = window.MINSAL_DATA[indicator][sexKey];
        isInterpolated = false;
    }

    if (!table || table.length === 0) return null;

    let L, M, S;

    if (isInterpolated) {
        let lower = table[0];
        let upper = table[table.length - 1];

        if (keyVal <= lower[0]) {
            [_, L, M, S] = lower;
        } else if (keyVal >= upper[0]) {
            [_, L, M, S] = upper;
        } else {
            for (let i = 0; i < table.length - 1; i++) {
                if (keyVal >= table[i][0] && keyVal <= table[i + 1][0]) {
                    lower = table[i];
                    upper = table[i + 1];
                    break;
                }
            }
            if (lower[0] === upper[0]) {
                [_, L, M, S] = lower;
            } else {
                const ratio = (keyVal - lower[0]) / (upper[0] - lower[0]);
                M = lower[2] + ratio * (upper[2] - lower[2]);
            }
        }
    } else {
        let closest = table[0];
        let minDiff = 9999;
        for (let r of table) {
            const diff = Math.abs(r.k - keyVal);
            if (diff < minDiff) {
                minDiff = diff;
                closest = r;
            }
        }
        M = closest.M;
    }

    return M;
}

function getZScore(indicator, keyVal, sexo, obs) {
    if (!obs) return null;
    const specCond = document.getElementById('specialCondition')?.value || 'none';
    const sexKey = sexo === 'm' ? 'boys' : 'girls';

    let table = null;
    let isInterpolated = false;

    if (specCond === 'down' && window.ZEMEL_DATA && window.ZEMEL_DATA[indicator]) {
        table = window.ZEMEL_DATA[indicator][sexKey];
        isInterpolated = true;
    } else if (specCond.startsWith('cp_') && window.BROOKS_DATA) {
        let cpGroup = 'gmfcs_1_2';
        if (specCond === 'cp_iii_iv') cpGroup = 'gmfcs_3_4';
        else if (specCond === 'cp_v') cpGroup = 'gmfcs_5';

        if (window.BROOKS_DATA[cpGroup] && window.BROOKS_DATA[cpGroup][indicator]) {
            table = window.BROOKS_DATA[cpGroup][indicator][sexKey];
            isInterpolated = true;
        }
    }

    // NEW V3.95: Special fallback for Head Circumference (HC) WHO Data
    if (!table && indicator === 'hc' && window.NEURO_HC_DATA && window.NEURO_HC_DATA.hc) {
        table = window.NEURO_HC_DATA.hc[sexKey];
        isInterpolated = true;
    }

    // Fallback a MINSAL si no hay tabla (Ej. pidiendo Talla en Brooks si no la configuramos)
    if (!table) {
        if (!window.MINSAL_DATA || !window.MINSAL_DATA[indicator]) return null;
        table = window.MINSAL_DATA[indicator][sexKey];
        isInterpolated = false; // MINSAL usa {k, L, M, S} estructurado por mes
    }

    if (!table || table.length === 0) return null;

    let L, M, S;

    if (isInterpolated) {
        // Interpolación Algebraica para bases de datos dispersas (Hitos)
        let lower = table[0];
        let upper = table[table.length - 1];

        if (keyVal <= lower[0]) {
            [_, L, M, S] = lower;
        } else if (keyVal >= upper[0]) {
            [_, L, M, S] = upper;
        } else {
            for (let i = 0; i < table.length - 1; i++) {
                if (keyVal >= table[i][0] && keyVal <= table[i + 1][0]) {
                    lower = table[i];
                    upper = table[i + 1];
                    break;
                }
            }
            if (lower[0] === upper[0]) {
                [_, L, M, S] = lower;
            } else {
                const ratio = (keyVal - lower[0]) / (upper[0] - lower[0]);
                L = lower[1] + ratio * (upper[1] - lower[1]);
                M = lower[2] + ratio * (upper[2] - lower[2]);
                S = lower[3] + ratio * (upper[3] - lower[3]);
            }
        }
    } else {
        // Búsqueda de hito más cercano para MINSAL (base densa)
        let closest = table[0];
        let minDiff = 9999;
        for (let r of table) {
            const diff = Math.abs(r.k - keyVal);
            if (diff < minDiff) {
                minDiff = diff;
                closest = r;
            }
        }
        L = closest.L;
        M = closest.M;
        S = closest.S;
    }

    if (L === 0) return Math.log(obs / M) / S;
    return (Math.pow(obs / M, L) - 1) / (L * S);
}

function renderPediatricZScores() {
    const p = AppState.patient;
    const grid = document.getElementById('zscoreGrid');
    if (!grid || !p) return;

    if (p.type !== 'pediatric' && p.type !== 'neonate') return;

    const useCorrected = document.getElementById('chkUseCorrectedAge')?.checked;
    let m = (useCorrected && p.exactMonthsCorr !== undefined && p.type === 'pediatric') ? p.exactMonthsCorr : (p.exactMonths || 0);
    if (m < 0) m = 0;

    const cm = p.estatura > 3 ? p.estatura : p.estatura * 100;

    let zWFA = getZScore('wfa', m, p.sexo, p.peso);
    let zHFA = getZScore('hfa', m, p.sexo, cm);
    let zBMI = getZScore('bmi', m, p.sexo, p.bmi);
    let zWFH = getZScore('wfh', cm, p.sexo, p.peso);

    let html = '';

    const specCond = document.getElementById('specialCondition')?.value || 'none';
    if (useCorrected && p.exactMonthsCorr !== undefined && p.type === 'pediatric') {
        html += `<div style="grid-column:1/-1; background:rgba(142,68,173,0.1); padding:6px; border-radius:6px; margin-bottom:6px; color:#8e44ad; font-size:0.65rem; text-align:center; font-weight:700; border:1px solid rgba(142,68,173,0.2);">👶 Evaluación: Utilizando Edad Corregida para cálculo de Z-Scores (Prematuro).</div>`;
    }

    if (specCond === 'down') {
        html += `<div style="grid-column:1/-1; background:rgba(211,84,0,0.1); padding:4px; border-radius:4px; margin-bottom:4px; color:#d35400; font-size:0.65rem; text-align:center;">ðŸ“Š <b>Zemel (S. Down):</b> Evaluando curvas LMS vía Interpolación Geométrica (Hitos).</div>`;
    } else if (specCond.startsWith('cp_')) {
        html += `<div style="grid-column:1/-1; background:rgba(142,68,173,0.1); padding:4px; border-radius:4px; margin-bottom:4px; color:#8e44ad; font-size:0.65rem; text-align:center;">ðŸ“Š <b>Brooks (Parálisis Cerebral):</b> Evaluando curvas GMFCS vía Interpolación Geométrica.</div>`;
    }

    const makeBadge = (title, z, textOverride = null, colorOverride = null) => {
        let color = colorOverride || '#27ae60';
        let diag = 'N';
        let displayVal = textOverride;

        if (textOverride === null) {
            if (z === null || isNaN(z)) return '';

            // Adjusting to match printed MINSAL tables rounding with a clinical tolerance of 0.06
            if (title.includes('IMC') && z >= 2.94) { color = '#8e44ad'; diag = '+3 DE'; }
            else if (z >= 1.94) { color = '#c0392b'; diag = '+2 DE'; } // MINSAL Obesidad is >= +2
            else if (z >= 0.94) { color = '#f39c12'; diag = '+1 DE'; } // MINSAL Sobrepeso is >= +1
            else if (z <= -1.94) { color = '#c0392b'; diag = '-2 DE'; }
            else if (z <= -0.94) { color = '#e67e22'; diag = '-1 DE'; }

            displayVal = `${z > 0 ? '+' : ''}${z.toFixed(2)}`;
        } else {
            diag = 'â˜…'; // Special star for string-based badges
        }

        return `<div style="background:#fff; border:1px solid ${color}; padding:5px; border-radius:6px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size:0.55rem; color:#666; font-weight:600; line-height:1.1;">${title}</div>
            <div style="font-size:0.85rem; font-weight:800; color:${color}; display:flex; justify-content:center; align-items:baseline; gap:4px; margin-top:2px;">
                ${displayVal}
                <span style="font-size:0.55rem; padding:2px 3px; background:${color}20; border-radius:4px; font-weight:700;">${diag}</span>
            </div>
        </div>`;
    };

    let ccBadge = window.evaluateWaist ? window.evaluateWaist(makeBadge) : '';

    if (p.type === 'neonate') {
        const semNac = parseInt(document.getElementById('egSemanas').value) || 0;
        const diasNac = parseInt(document.getElementById('egDias').value) || 0;
        
        let agePostnatalDays = 0;
        const fn = document.getElementById('fechaNacimiento').value;
        const birth = parseSpanishDate(fn);
        if (birth) {
            const now = new Date();
            now.setHours(0,0,0,0);
            agePostnatalDays = Math.floor(Math.abs(now - birth) / (1000 * 60 * 60 * 24));
        }
        
        const totalDays = (semNac * 7) + diasNac + agePostnatalDays;
        let sem = Math.floor(totalDays / 7);
        if (sem < 24) sem = 24;
        if (sem > 42) sem = 42;
        
        const wGrams = p.peso * 1000;
        const cm = p.estatura > 3 ? p.estatura : p.estatura * 100;

        let clasD = 'Sin Datos';
        let clasColor = '#95a5a6';
        let ipDiag = null;
        let isPeg = false;

        let clasTalla = 'Sin Datos';
        let clasTallaColor = '#95a5a6';
        let clasPC = 'Sin Datos';
        let clasPCColor = '#95a5a6';
        const pcInput = parseFloat(document.getElementById('pcefalico')?.value) || 0;

        if (sem >= 24 && sem <= 42 && window.PITTALUGA_DATA) {
            // Peso / EG
            if (p.peso > 0) {
                const wRefs = window.PITTALUGA_DATA.peso[sem];
                if (wRefs) {
                    if (wGrams < wRefs.p3) {
                        clasD = 'PEG Severo'; clasColor = '#c0392b'; isPeg = true;
                    } else if (wGrams >= wRefs.p3 && wGrams < wRefs.p10) {
                        clasD = 'PEG Leve'; clasColor = '#e67e22'; isPeg = true;
                    } else if (wGrams >= wRefs.p10 && wGrams <= wRefs.p90) {
                        clasD = 'AEG'; clasColor = '#27ae60';
                    } else {
                        clasD = 'GEG'; clasColor = '#2980b9';
                    }
                }
            } else {
                clasD = 'Falta Peso';
            }

            // Talla / EG
            if (cm > 0 && window.PITTALUGA_DATA.talla) {
                const tRefs = window.PITTALUGA_DATA.talla[sem];
                if (tRefs) {
                    if (cm < tRefs.p10) {
                        clasTalla = 'Talla Corta / EG'; clasTallaColor = '#c0392b';
                    } else if (cm >= tRefs.p10 && cm <= tRefs.p90) {
                        clasTalla = 'Talla Adecuada'; clasTallaColor = '#27ae60';
                    } else {
                        clasTalla = 'Talla Alta / EG'; clasTallaColor = '#2980b9';
                    }
                }
            } else {
                clasTalla = 'Falta Talla';
            }

            // PC / EG
            if (pcInput > 0 && window.PITTALUGA_DATA.pc) {
                const pcRefs = window.PITTALUGA_DATA.pc[sem];
                if (pcRefs) {
                    if (pcInput < pcRefs.p10) {
                        clasPC = 'PC Bajo (Sosp. Microcefalia)'; clasPCColor = '#c0392b';
                    } else if (pcInput >= pcRefs.p10 && pcInput <= pcRefs.p90) {
                        clasPC = 'PC Adecuado'; clasPCColor = '#27ae60';
                    } else {
                        clasPC = 'PC Alto (Sosp. Macrocefalia)'; clasPCColor = '#c0392b';
                    }
                }
            } else {
                clasPC = 'Falta PC';
            }

            // Simetría (Índice Ponderal)
            if (isPeg && p.peso > 0 && cm > 0) {
                const ipVal = (wGrams / Math.pow(cm, 3)) * 100;

                if (ipVal >= 2.2) {
                    ipDiag = `Simétrico (IP: ${ipVal.toFixed(2)})`;
                    clasColor = '#f39c12';
                } else if (ipVal >= 2.0) {
                    ipDiag = `Asimétrico Leve (IP: ${ipVal.toFixed(2)})`;
                    clasColor = '#d35400';
                } else {
                    ipDiag = `Asimétrico Severo (IP: ${ipVal.toFixed(2)}) ⚠️ Riesgo Hipoglicemia`;
                    clasColor = '#c0392b';
                }
            } else if (isPeg) {
                ipDiag = 'Falta Talla para IP';
            }
        } else if (sem > 0) {
            clasD = '< 24 sem';
            clasTalla = '< 24 sem';
            clasPC = '< 24 sem';
        }

        let printClas = clasD;
        if (ipDiag !== null) {
            printClas = `<div style="line-height:1.2;"><b>${clasD}</b><br><span style="font-size:0.6rem; color:#fff; background:rgba(0,0,0,0.2); padding:2px 4px; border-radius:4px;">${ipDiag}</span></div>`;
        }
        html += makeBadge('Peso / EG (Pittaluga)', null, printClas, clasColor);

        if (cm > 0) {
            html += makeBadge('Talla / EG (Pittaluga)', null, clasTalla, clasTallaColor);
        }
        if (pcInput > 0) {
            html += makeBadge('PC / EG (Pittaluga)', null, clasPC, clasPCColor);
        }

        if (sem > 0 && sem < 37) {
            const fn = document.getElementById('fechaNacimiento').value;
            const birthDate = parseSpanishDate(fn);
            if (birthDate) {
                const now = new Date();

                const diffTime = now.getTime() - birthDate.getTime();
                const chronDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

                const gestDays = (sem * 7) + dias;
                const missingDays = 280 - gestDays;

                let correctedDays = chronDays - missingDays;
                if (correctedDays < 0) correctedDays = 0;

                let corrString = '';
                if (correctedDays < 30) {
                    const cWeeks = Math.floor(correctedDays / 7);
                    const cDays = correctedDays % 7;
                    corrString = `${cWeeks} sem, ${cDays}d`;
                } else if (correctedDays < 349.8) {
                    const cMonths = Math.floor(correctedDays / 30.4375);
                    const cDays = Math.floor(correctedDays % 30.4375);
                    corrString = `${cMonths}m, ${cDays}d`;
                } else {
                    let d = correctedDays;
                    if (d >= 349.8 && d < 365.25) d = 365.25;

                    const cYears = Math.floor(d / 365.25);
                    const r = d % 365.25;
                    const cMonths = Math.floor(r / 30.4375);
                    const finalDays = Math.floor(r % 30.4375);

                    if (cMonths === 0) {
                        corrString = `${cYears} Año${finalDays > 0 ? `, ${finalDays}d` : ''}`;
                    } else {
                        corrString = `${cYears} Año, ${cMonths}m, ${finalDays}d`;
                    }
                }

                html += makeBadge('Edad Correg.', null, corrString, '#2980b9');
            } else {
                html += makeBadge('Edad Correg.', null, 'Falta Fecha', '#95a5a6');
            }
        } else if (sem >= 37) {
            html += makeBadge('Condición', null, 'Término', '#2980b9');
        }
    } else {
        const parts = (useCorrected && p.exactMonthsCorr !== undefined && p.type === 'pediatric') ? (p.agePartsCorr || { y: 0, m: 0, d: 0 }) : (p.ageParts || { y: 0, m: 0, d: 0 });
        const y = parts.y;
        const mt = parts.m;
        const d = parts.d;

        const isUnderOne = (y === 0 && (mt < 11 || (mt === 11 && d <= 14)));
        const isOneToFive = !isUnderOne && (y < 5 || (y === 5 && mt === 0 && d <= 29));

        let diagWeight = '';
        let diagWColor = '#888';

        let evaluatedBy = '';
        if (isUnderOne) {
            const zPT = (zWFH !== null && !isNaN(zWFH)) ? zWFH : null;
            if (zPT !== null && zPT >= 0.94) {
                evaluatedBy = ' [Evaluado por P/T]';
                if (zPT >= 1.94) { diagWeight = 'Obesidad'; diagWColor = '#c0392b'; }
                else { diagWeight = 'Sobrepeso'; diagWColor = '#f39c12'; }
            } else {
                evaluatedBy = ' [Evaluado por P/E]';
                if (zWFA <= -1.94) { diagWeight = 'Desnutrición'; diagWColor = '#c0392b'; }
                else if (zWFA <= -0.94) { diagWeight = 'Riesgo de Desnutrir'; diagWColor = '#e67e22'; }
                else { diagWeight = 'Normal o Eutrófico'; diagWColor = '#27ae60'; }
            }
        } else if (isOneToFive) {
            evaluatedBy = ' [Evaluado por P/T]';
            if (zWFH <= -1.94) { diagWeight = 'Desnutrición'; diagWColor = '#c0392b'; }
            else if (zWFH <= -0.94) { diagWeight = 'Riesgo de Desnutrir'; diagWColor = '#e67e22'; }
            else if (zWFH >= 1.94) { diagWeight = 'Obesidad'; diagWColor = '#c0392b'; }
            else if (zWFH >= 0.94) { diagWeight = 'Sobrepeso'; diagWColor = '#f39c12'; }
            else { diagWeight = 'Normal o Eutrófico'; diagWColor = '#27ae60'; }
        } else {
            evaluatedBy = ' [Evaluado por IMC/E]';
            if (zBMI <= -1.94) { diagWeight = 'Desnutrición'; diagWColor = '#c0392b'; }
            else if (zBMI <= -0.94) { diagWeight = 'Riesgo de Desnutrir'; diagWColor = '#e67e22'; }
            else if (zBMI >= 2.94) { diagWeight = 'Obesidad Severa'; diagWColor = '#8e44ad'; }
            else if (zBMI >= 1.94) { diagWeight = 'Obesidad'; diagWColor = '#c0392b'; }
            else if (zBMI >= 0.94) { diagWeight = 'Sobrepeso'; diagWColor = '#f39c12'; }
            else { diagWeight = 'Normal o Eutrófico'; diagWColor = '#27ae60'; }
        }

        let diagHeight = '';
        let diagHColor = '#888';
        if (zHFA !== null && !isNaN(zHFA)) {
            if (zHFA <= -2) { diagHeight = 'Talla Baja'; diagHColor = '#c0392b'; }
            else if (zHFA <= -1) { diagHeight = 'Talla Normal Baja'; diagHColor = '#f39c12'; }
            else if (zHFA >= +2) { diagHeight = 'Talla Alta'; diagHColor = '#3498db'; }
            else if (zHFA >= +1) { diagHeight = 'Talla Normal Alta'; diagHColor = '#2980b9'; }
            else { diagHeight = 'Normal'; diagHColor = '#27ae60'; }
        }

        html += makeBadge('P/E (Peso/Edad)', zWFA);
        html += makeBadge('T/E (Talla/Edad)', zHFA);
        if (m <= 60 && zWFH !== null && !isNaN(zWFH)) html += makeBadge('P/T (Peso/Talla)', zWFH);
        if (m > 60 && zBMI !== null && !isNaN(zBMI)) html += makeBadge('IMC/E', zBMI);
        html += ccBadge;

        if (diagWeight || diagHeight) {
            html += `<div style="grid-column: 1 / -1; display:flex; flex-direction:column; gap:6px; margin-top:8px;">`;
            if (diagWeight) {
                html += `<div style="background:${diagWColor}15; border-left:4px solid ${diagWColor}; padding:8px; border-radius:4px; font-weight:700; color:${diagWColor}; font-size:0.85rem; display:flex; flex-direction:column; gap:2px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span>âš–ï¸ Estado Nutricional (MINSAL)</span>
                                <span style="font-size:0.9rem;">${diagWeight}</span>
                            </div>
                            <div style="font-size:0.65rem; opacity:0.8; text-align:right;">${evaluatedBy}</div>
                         </div>`;
            }
            if (diagHeight) {
                html += `<div style="background:${diagHColor}15; border-left:4px solid ${diagHColor}; padding:8px; border-radius:4px; font-weight:700; color:${diagHColor}; font-size:0.85rem; display:flex; justify-content:space-between; align-items:center;">
                            <span>ðŸ“ Calificación Estatural</span>
                            <span style="font-size:0.9rem;">${diagHeight}</span>
                         </div>`;
            }

            // 3. Cintura Diagnosis
            const cInp = parseFloat(document.getElementById('ccintura')?.value) || 0;
            if (cInp > 0 && y >= 5 && y <= 19) {
                const table = window.WAIST_PERCENTILES?.[p.sexo];
                const refAge = (y >= 19) ? 19 : y;
                const ageData = table?.[refAge];
                if (ageData) {
                    let diagWaist = 'Normal (< p75)';
                    let waColor = '#27ae60';
                    if (cInp >= ageData.p90) { diagWaist = 'Obesidad Abdominal (â‰¥ p90)'; waColor = '#c0392b'; }
                    else if (cInp >= ageData.p75) { diagWaist = 'Riesgo Obesidad Adb. (â‰¥ p75)'; waColor = '#f39c12'; }

                    html += `<div style="background:${waColor}15; border-left:4px solid ${waColor}; padding:8px; border-radius:4px; font-weight:700; color:${waColor}; font-size:0.85rem; display:flex; justify-content:space-between; align-items:center;">
                                <span>â­• Perímetro Cintura</span>
                                <span style="font-size:0.9rem;">${diagWaist}</span>
                             </div>`;
                }
            }
            html += `</div>`;
        }
    }

    // NEW V3.95: Growth Velocity (g/kg/day) - Patel Formula
    const pesoAnterior = parseFloat(document.getElementById('pesoAnterior')?.value) || 0;
    const diasMedicion = parseFloat(document.getElementById('diasMedicion')?.value) || 0;
    
    // Explicit growth velocity calculator updating
    const valGrowthEl = document.getElementById('valGrowthVelocity');
    const resultBoxEl = document.getElementById('growthVelocityResult');
    
    let velGrowth = null;
    let vColor = '#7f8c8d';
    
    if (p.peso > 0 && pesoAnterior > 0 && diasMedicion > 0) {
        velGrowth = (1000 * Math.log(p.peso / pesoAnterior)) / diasMedicion;
        if (velGrowth < 0) vColor = '#c0392b';
        else if (velGrowth < 15) vColor = '#d35400';
        else if (velGrowth <= 20) vColor = '#16a085';
        else vColor = '#2980b9';
        
        html += makeBadge('Vel. Crecimiento', null, `${velGrowth.toFixed(1)} g/kg/d`, vColor);
    }
    
    if (valGrowthEl && resultBoxEl) {
        if (velGrowth !== null) {
            valGrowthEl.innerText = `${velGrowth.toFixed(1)} g/kg/d`;
            
            // Premium non-offensive eye-friendly pastel colors for the dashboard panel
            if (velGrowth < 0) {
                resultBoxEl.style.background = '#fcd0cf'; // Soft red/pink pastel
                resultBoxEl.style.borderColor = '#f5b7b1';
                valGrowthEl.style.color = '#c0392b';
            } else if (velGrowth < 15) {
                resultBoxEl.style.background = '#fef9e7'; // Soft yellow/orange
                resultBoxEl.style.borderColor = '#f9e79f';
                valGrowthEl.style.color = '#d35400';
            } else if (velGrowth <= 20) {
                resultBoxEl.style.background = '#e8f8f5'; // Soft green mint
                resultBoxEl.style.borderColor = '#a3e4d7';
                valGrowthEl.style.color = '#16a085';
            } else {
                resultBoxEl.style.background = '#ebf5fb'; // Soft blue
                resultBoxEl.style.borderColor = '#a9cce3';
                valGrowthEl.style.color = '#2980b9';
            }
        } else {
            valGrowthEl.innerText = '-- g/kg/d';
            resultBoxEl.style.background = 'rgba(255,255,255,0.75)';
            resultBoxEl.style.borderColor = '#a3e4d7';
            valGrowthEl.style.color = '#7f8c8d';
        }
    }

    // NEW V3.95: Neuro Classifier (Head Circumference)
    const pcInput = parseFloat(document.getElementById('pcefalico')?.value) || 0;
    if (pcInput > 0) {
        const zHC = getZScore('hc', m, p.sexo, pcInput);
        if (zHC !== null && !isNaN(zHC)) {
            let diag = '';
            let color = '#27ae60';
            if (zHC <= -2.0) { diag = '<br><span style="font-size:0.6rem">Sosp. Microcefalia</span>'; color = '#c0392b'; }
            
            else if (zHC >= +2.0) { diag = '<br><span style="font-size:0.6rem">Sosp. Macrocefalia</span>'; color = '#c0392b'; }
            html += makeBadge('Perím. Cefálico', null, `Z: ${zHC > 0 ? '+' : ''}${zHC.toFixed(2)}${diag}`, color);
        } else {
            html += makeBadge('Perím. Cefálico', null, `${pcInput} cm (Sin Ref)`, '#95a5a6');
        }
    }

    if (!html) html = '<div style="grid-column:span 2; text-align:center; font-size:0.8rem; color:#888;">Ingresa Fecha de Nacimiento, Peso y Talla</div>';
    grid.innerHTML = html;
}

window.calcFactorial = () => {
    calcFactorialNoRecursion();
    window.updateSelectedGET();
    runSimulation();
};

window.calcTMB_OMS = () => {
    calculateRequirements();
};

window.updateSelectedGET = () => {
    const p = AppState.patient;
    const isFactorial = document.getElementById('radioFactorial')?.checked;

    let officialGET = 0;
    if (isFactorial) {
        officialGET = p.factorial_calculated || 0;
    } else {
        officialGET = p.tmt_calculated || 0;
    }

    p.tmt = officialGET;
    document.getElementById('valGET').innerText = `${Math.round(officialGET)} kcal`;
    updateMacroGoals();
};

// --- 8. SIMULATOR LOGIC ---
// --- NEW V5.00: Neonatal & Pediatric Volume Frequency (Times) Helpers ---
window.getEffectiveSimulationVolume = () => {
    const rawVol = parseFloat(document.getElementById('volume')?.value) || 0;
    const mode = document.querySelector('input[name="patientType"]:checked')?.value || 'adult';
    let times = 1;
    if (mode === 'pediatric' || mode === 'neonate') {
        const tInp = document.getElementById('volumeTimes');
        times = tInp ? parseFloat(tInp.value) : 1;
        if (isNaN(times) || times < 1) times = 1;
        if (times > 8) {
            times = 8;
            if (tInp) tInp.value = 8;
        }
    }
    return rawVol * times;
};

window.updateVolumeTotal = () => {
    const totalVolume = window.getEffectiveSimulationVolume();
    const totalDisplay = document.getElementById('volumeTotalDisplay');
    if (totalDisplay) {
        totalDisplay.innerText = `${Math.round(totalVolume)} ml`;
    }
    return totalVolume;
};

function initSimulatorLogic() {
    const vol = document.getElementById('volume');
    const dil = document.getElementById('dilution');
    const btnSave = document.getElementById('btnSaveHistory');
    const timesInp = document.getElementById('volumeTimes');

    if (vol) {
        vol.oninput = () => {
            window.updateVolumeTotal();
            runSimulation();
        };
    }
    if (dil) dil.oninput = runSimulation;
    if (btnSave) btnSave.onclick = savePrescription;

    if (timesInp) {
        timesInp.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            if (val > 8) e.target.value = 8;
            window.updateVolumeTotal();
            runSimulation();
        });
        timesInp.addEventListener('blur', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val) || val < 1) e.target.value = 1;
            window.updateVolumeTotal();
            runSimulation();
        });
    }

    // Trigger update on any module/oral/iv input change
    document.querySelectorAll('.input-module, .input-oral, .input-iv, #ivType').forEach(inp => {
        inp.addEventListener('input', runSimulation);
    });

    // Escuchas para regímenes predefinidos y barra de consumo
    const oralDietType = document.getElementById('oralDietType');
    const oralIntakePercent = document.getElementById('oralIntakePercent');
    if (oralDietType) oralDietType.addEventListener('change', updateOralIntakePreset);
    if (oralIntakePercent) oralIntakePercent.addEventListener('input', updateOralIntakeSlider);

    // Si el usuario edita de forma manual los campos, revertir a "Personalizado" y 100% de barra
    document.querySelectorAll('.input-oral').forEach(inp => {
        inp.addEventListener('input', () => {
            const oralDietType = document.getElementById('oralDietType');
            const oralIntakePercent = document.getElementById('oralIntakePercent');
            const badge = document.getElementById('oralIntakePercentBadge');
            if (oralDietType && oralDietType.value !== 'custom') {
                oralDietType.value = 'custom';
            }
            if (oralIntakePercent) {
                oralIntakePercent.value = 100;
            }
            if (badge) {
                badge.innerText = '100%';
            }
        });
    });

    // Favorites Logic
    const btnFav = document.getElementById('btnToggleFav');
    if (btnFav) {
        btnFav.onclick = () => {
            const fSel = document.getElementById('formulaSelect');
            if (!fSel) return;
            const fId = fSel.value;
            if (!fId) return;

            if (AppState.favorites.includes(fId)) {
                AppState.favorites = AppState.favorites.filter(id => id !== fId);
            } else {
                AppState.favorites.push(fId);
            }
            localStorage.setItem('sedile_favs', JSON.stringify(AppState.favorites));
            updateFormulaSelect(); // Re-render to sort
            const fSelNew = document.getElementById('formulaSelect');
            if (fSelNew) fSelNew.value = fId; // Restore selection
            checkFavoriteStatus();
        };
    }
    
    // Inicializar estados de anamnesis y STRONGkids / NRS 2002
    if (typeof window.initAnamnesisToggles === 'function') {
        window.initAnamnesisToggles();
    }
    
    // NEW: Sincronizar visibilidad de tamizajes condicionales en la carga inicial
    if (typeof window.togglePatientMode === 'function') {
        window.togglePatientMode();
    }
}

function checkFavoriteStatus() {
    const fId = document.getElementById('formulaSelect').value;
    const btn = document.getElementById('btnToggleFav');
    if (!btn) return;

    if (AppState.favorites.includes(fId)) {
        btn.innerText = 'â­';
        btn.style.background = 'gold';
        btn.style.color = 'white';
        btn.style.borderColor = 'gold';
    } else {
        btn.innerText = 'â˜†';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary)';
        btn.style.borderColor = 'var(--primary)';
    }
}

function initFormulaSearch() {
    const search = document.getElementById('formulaSearch');
    if (search) {
        search.oninput = (e) => {
            updateFormulaSelect(e.target.value);
        };
    }
}

function updateFormulaSelect(filter = "") {
    // AGGRESSIVE FALLBACK V3.21: Use LOCAL_FORMULAS if AppState is empty
    if (!AppState.formulas || AppState.formulas.length === 0) {
        console.warn("⚠️ AppState.formulas empty, reloading from LOCAL_FORMULAS...");
        AppState.formulas = [...LOCAL_FORMULAS];
    } else {
        // Ensure all local ones are present (V3.26 Force sync)
        if (AppState.formulas.length < LOCAL_FORMULAS.length) {
            AppState.formulas = [...LOCAL_FORMULAS];
        }
    }

    const selects = [
        document.getElementById('formulaSelect'),
        document.getElementById('formulaSelectB'),
        document.getElementById('customF1'),
        document.getElementById('customF2')
    ];

    // Sort logic: Favorites first, then by Category
    const normalizedFilter = filter.toLowerCase().trim();

    const sortedFormulas = [...AppState.formulas]
        .filter(f => f && f.cat && !f.cat.includes("RTH"))
        .filter(f => !normalizedFilter || (f.name && f.name.toLowerCase().includes(normalizedFilter)) || (f.cat && f.cat.toLowerCase().includes(normalizedFilter)))
        .sort((a, b) => {
            const aFav = AppState.favorites.includes(a.id);
            const bFav = AppState.favorites.includes(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });

    const cats = [...new Set(sortedFormulas.map(i => i.cat).filter(Boolean))];

    selects.forEach(sel => {
        if (!sel) return;
        const currentVal = sel.value; // preserve value if possible (rare)
        sel.innerHTML = '<option value="">Seleccione Fórmula...</option>';

        cats.forEach(cat => {
            const group = document.createElement('optgroup');
            group.label = cat;
            sortedFormulas.filter(i => i.cat === cat).forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                const star = AppState.favorites.includes(item.id) ? 'â­ ' : '';
                opt.innerText = star + item.name;
                group.appendChild(opt);
            });
            sel.appendChild(group);
        });

        // Restore if value exists in new options
        if (currentVal) sel.value = currentVal;
    });

    // Event Listeners
    if (selects[0]) {
        selects[0].onchange = () => {
            const f = AppState.formulas.find(x => x.id === selects[0].value);
            renderFormulaInputs(f);
            runSimulation();
            checkFavoriteStatus();
        };
    }
    if (selects[1]) {
        selects[1].onchange = () => {
            AppState.formulaB = AppState.formulas.find(f => f.id === selects[1].value);
            runSimulation(); // Updates compare results
        };
    }
}

function renderMinerals() {
    const gridA = document.getElementById('mineralsGrid');
    const gridB = document.getElementById('mineralsGridB');
    if (!gridA) return;

    const isCustomMix = document.getElementById('customMixContainer') && document.getElementById('customMixContainer').style.display === 'block';
    if (isCustomMix) {
        gridA.innerHTML = "<div style='color:#7f8c8d; grid-column: 1 / -1; font-size:0.75rem; padding:10px;'>Minerales no disponibles en mezcla personalizada aún.</div>";
        if(gridB) gridB.style.display = 'none';
        return;
    }

    const isComparing = document.getElementById('compareRow').style.display === 'block' || document.getElementById('compareRow').style.display === 'flex';
    const fA = AppState.formulas.find(x => x.id === document.getElementById('formulaSelect').value);
    const fB = isComparing ? AppState.formulas.find(x => x.id === document.getElementById('formulaSelectB').value) : null;

    if (!fA) {
        gridA.innerHTML = "<div style='color:#7f8c8d; grid-column: 1 / -1; padding:10px;'>Seleccione una fórmula para ver minerales</div>";
        if(gridB) gridB.style.display = 'none';
        return;
    }

    const v1 = window.getEffectiveSimulationVolume();
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;
    const dilBInput = document.getElementById('dilutionB');
    const v2B = dilBInput && dilBInput.value !== "" ? parseFloat(dilBInput.value) : v2;

    const getFactor = (f) => {
        const vol = f.isBotellin ? (v1 * f.volUnit) : v1;
        if (vol <= 0) return 0;
        if (f.type === 'p') {
            const dil = v2 > 0 ? v2 : (f.stdDil || 15);
            return (vol * (dil / 100)) / 100;
        } else {
            return vol / 100;
        }
    };

    const factorA = getFactor(fA);
    const factorB = fB ? getFactor(fB) : 0;

    const items = [
        { id: "na", name: "Sodio", icon: "🧂" },
        { id: "k", name: "Potasio", icon: "🍌" },
        { id: "cl", name: "Cloro", icon: "🧪" },
        { id: "ca", name: "Calcio", icon: "🦴" },
        { id: "p", name: "Fósforo", icon: "🐟" },
        { id: "mg", name: "Magnesio", icon: "🥬" },
        { id: "fe", name: "Hierro", icon: "🩸" },
        { id: "zn", name: "Zinc", icon: "🛡️" },
        { id: "cu", name: "Cobre", icon: "⚡" },
        { id: "i", name: "Yodo", icon: "🌊" },
        { id: "mn", name: "Manganeso", icon: "🌰" },
        { id: "se", name: "Selenio", icon: "🌾" }
    ];

    if (!fA.minerals || Object.keys(fA.minerals).length === 0) {
        gridA.innerHTML = "<div style='color:#7f8c8d; grid-column: 1 / -1; padding:10px;'>Sin datos de minerales para " + fA.name + "</div>";
    } else {
        gridA.innerHTML = items.map(i => {
            const valA = fA.minerals[i.id];
            if (valA === undefined) return "";
            const finalA = (valA * factorA).toFixed(1).replace('.', ',');
            
            let displayVal = `${finalA} mg`;
            if (fB && fB.minerals && fB.minerals[i.id] !== undefined) {
                const finalB = (fB.minerals[i.id] * factorB).toFixed(1).replace('.', ',');
                displayVal = `${finalA} / ${finalB} mg`;
            }

            return `<div style="background:#fff; border:1px solid #eee; border-radius:4px; padding:4px; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:50px;">
                <span style="font-size:0.8rem;">${i.icon}</span>
                <span style="font-weight:800; color:#2c3e50; margin:1px 0; font-size:0.7rem; white-space:nowrap;">${displayVal}</span>
                <span style="font-size:0.55rem; color:#7f8c8d; text-transform:uppercase; font-weight:700;">${i.name}</span>
            </div>`;
        }).join('');
    }

    if (gridB) gridB.style.display = 'none';
}

window.toggleCustomMix = function() {
    const container = document.getElementById('customMixContainer');
    const mainSelectGrp = document.getElementById('formulaSelect').parentElement.parentElement;
    const dilWrapper = document.getElementById('dilutionWrapper');
    const minPanel = document.getElementById('mineralsPanel');
    const isVisible = container.style.display === 'block';
    
    if (isVisible) {
        container.style.display = 'none';
        mainSelectGrp.style.display = 'block';
        if(dilWrapper) dilWrapper.style.display = 'block';
        if(minPanel) minPanel.style.display = 'block';
    } else {
        container.style.display = 'block';
        mainSelectGrp.style.display = 'none';
        if(dilWrapper) dilWrapper.style.display = 'none';
        if(minPanel) minPanel.style.display = 'none';
    }
    window.runSimulation();
};

function renderFormulaInputs(formula) {
    renderMinerals(formula);
    const wrapper = document.getElementById('dilutionWrapper');
    const container = document.getElementById('recipeInputsContainer');
    const baseDilInput = document.getElementById('dilution');

    if (!formula) {
        if (wrapper) wrapper.style.display = 'block';
        if (container) container.style.display = 'none';
        return;
    }

    if (wrapper) wrapper.style.display = 'block';
    
    // Auto-fill standard dilution if present
    if (formula.stdDil && baseDilInput) {
        baseDilInput.value = formula.stdDil;
    }

    // NEW V4.50: Botellines Logic for Volume Label
    const lblVolume = document.getElementById('lblVolume');
    const inputVolume = document.getElementById('volume');
    if (lblVolume && inputVolume) {
        if (formula.isBotellin) {
            lblVolume.innerText = `Unidades (Botellín ${formula.volUnit}cc)`;
            inputVolume.placeholder = 'Ej: 1, 2...';
        } else {
            lblVolume.innerText = 'Volumen (ml)';
            inputVolume.placeholder = 'ml';
        }
    }
}

// --- CONSTANTE DE REGÍMENES CLÍNICOS PEDIÁTRICOS ---
const ORAL_PRESETS = {
    blando_sin_residuos: { kcal: 1874, prot: 74, cho: 309, lip: 38 },
    liviano: { kcal: 2055, prot: 84.5, cho: 292, lip: 46.6 },
    hiposodico: { kcal: 2063, prot: 82, cho: 297, lip: 45.7 },
    hypercalorico: { kcal: 2445, prot: 113.8, cho: 366, lip: 48.1 },
    hyperproteico: { kcal: 2448, prot: 132, cho: 348, lip: 46 },
    hipocalorico: { kcal: 1486, prot: 75.7, cho: 165, lip: 44 },
    hipoproteico: { kcal: 1925, prot: 25, cho: 314, lip: 46 },
    papilla_diabetico: { kcal: 1537, prot: 77.2, cho: 192, lip: 47.5 },
    papilla_liviana: { kcal: 1587, prot: 63.5, cho: 217, lip: 47.2 },
    hipoglucidico: { kcal: 1480, prot: 97.2, cho: 151, lip: 44.3 },
    isoglucidico_160: { kcal: 1530, prot: 97.4, cho: 165, lip: 41 },
    isoglucidico_200: { kcal: 1634, prot: 111.5, cho: 198, lip: 43 }
};

function updateOralIntakePreset() {
    const diet = document.getElementById('oralDietType').value;
    const percent = parseFloat(document.getElementById('oralIntakePercent').value) || 100;
    
    if (diet === 'custom') return;
    
    const preset = ORAL_PRESETS[diet];
    if (preset) {
        document.getElementById('oralKcal').value = Math.round(preset.kcal * (percent / 100));
        document.getElementById('oralProt').value = (preset.prot * (percent / 100)).toFixed(1);
        document.getElementById('oralCHO').value = (preset.cho * (percent / 100)).toFixed(1);
        document.getElementById('oralLip').value = (preset.lip * (percent / 100)).toFixed(1);
        
        runSimulation();
    }
}

function updateOralIntakeSlider() {
    const percent = document.getElementById('oralIntakePercent').value;
    const badge = document.getElementById('oralIntakePercentBadge');
    if (badge) badge.innerText = percent + '%';
    
    const diet = document.getElementById('oralDietType').value;
    if (diet !== 'custom') {
        updateOralIntakePreset();
    }
}

function runSimulation() {
    const isCustomMix = document.getElementById('customMixContainer') && document.getElementById('customMixContainer').style.display === 'block';

    const v1 = window.getEffectiveSimulationVolume();
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;
    const dilBInput = document.getElementById('dilutionB');
    const v2B = dilBInput && dilBInput.value !== "" ? parseFloat(dilBInput.value) : v2;

    let k = 0, p = 0, c = 0, l = 0;

    if (isCustomMix) {
        const f1Id = document.getElementById('customF1')?.value;
        const f2Id = document.getElementById('customF2')?.value;
        const pct1 = parseFloat(document.getElementById('customPct1')?.value) || 0;
        const pct2 = parseFloat(document.getElementById('customPct2')?.value) || 0;

        const f1 = AppState.formulas.find(f => f.id === f1Id);
        const f2 = AppState.formulas.find(f => f.id === f2Id);

        if (f1) {
            const grams1 = v1 * (pct1 / 100);
            k += f1.k * (grams1 / 100);
            p += f1.p * (grams1 / 100);
            c += f1.c * (grams1 / 100);
            l += f1.f * (grams1 / 100);
        }
        if (f2) {
            const grams2 = v1 * (pct2 / 100);
            k += f2.k * (grams2 / 100);
            p += f2.p * (grams2 / 100);
            c += f2.c * (grams2 / 100);
            l += f2.f * (grams2 / 100);
        }
    } else {
        const fId = document.getElementById('formulaSelect').value;
        const formula = AppState.formulas.find(f => f.id === fId);

        if (formula) {
            const vol = formula.isBotellin ? (v1 * formula.volUnit) : v1;
            if (formula.type === 'recipe') {
                formula.recipe.forEach(rec => {
                    const grams = vol * (rec.defPct / 100);
                    k += rec.k * (grams / 100);
                    p += rec.p * (grams / 100);
                    c += rec.c * (grams / 100);
                    l += rec.f * (grams / 100);
                });
            } else if (formula.type === 'p') {
                const dil = v2 > 0 ? v2 : (formula.stdDil || 0);
                const grams = vol * (dil / 100);
                k = formula.k * (grams / 100);
                p = formula.p * (grams / 100);
                c = formula.c * (grams / 100);
                l = formula.f * (grams / 100);
            } else {
                let scl = 1;
                if (formula.stdDil && v2 > 0) scl = v2 / formula.stdDil;
                k = formula.k * (vol / 100) * scl;
                p = formula.p * (vol / 100) * scl;
                c = formula.c * (vol / 100) * scl;
                l = formula.f * (vol / 100) * scl;
            }
        }
    }

    // NEW V3.64: Update Base Formula Subtotal Board BEFORE adding modules/oral
    const elSubK = document.getElementById('subKcalBase');
    const elSubP = document.getElementById('subProtBase');
    const elSubC = document.getElementById('subCHOBase');
    const elSubL = document.getElementById('subLipBase');
    if (elSubK) elSubK.innerText = Math.round(k);
    if (elSubP) elSubP.innerText = p.toFixed(1);
    if (elSubC) elSubC.innerText = c.toFixed(1);
    if (elSubL) elSubL.innerText = l.toFixed(1);

    // NEW V3.95: PreNAN FM85 Fortifier (Neonates only)
    if (AppState.patient.type === 'neonate') {
        const fortPct = parseFloat(document.getElementById('fortifierPercent')?.value) || 0;
        if (fortPct > 0) {
            let baseVolForFM85 = 0;
            baseVolForFM85 = v1;
            const fortGrams = baseVolForFM85 * (fortPct / 100);
            const fgInput = document.getElementById('fortifierGrams');
            if (fgInput) fgInput.value = fortGrams.toFixed(1);

            // FM85 Macros per 100g: 348 kcal, 20g Prot, 66.4g CHO
            k += (fortGrams * 348 / 100);
            p += (fortGrams * 20 / 100);
            c += (fortGrams * 66.4 / 100);
        } else {
            const fgInput = document.getElementById('fortifierGrams');
            if (fgInput) fgInput.value = '';
        }
    }

    // Factor in Modules V3.50/V3.61
    let modK = 0, modP = 0, modC = 0, modL = 0;
    const mNess = parseFloat(document.getElementById('modNessucar').value) || 0;
    modK += (mNess * MODULE_DATA.nessucar.kcal / 100);
    modC += (mNess * MODULE_DATA.nessucar.c / 100);

    const mMCT = parseFloat(document.getElementById('modMCT').value) || 0;
    modK += (mMCT * MODULE_DATA.mct.kcal / 100);
    modL += (mMCT * MODULE_DATA.mct.f / 100);

    const mEnt = parseFloat(document.getElementById('modEnterex').value) || 0;
    modK += (mEnt * MODULE_DATA.enterex.kcal / 100);
    modC += (mEnt * MODULE_DATA.enterex.c / 100);

    const mBan = parseFloat(document.getElementById('modBanatrol').value) || 0;
    modK += (mBan * MODULE_DATA.banatrol.kcal / 100);
    modC += (mBan * MODULE_DATA.banatrol.c / 100);

    const mProt = parseFloat(document.getElementById('modProteinex').value) || 0;
    modK += (mProt * MODULE_DATA.proteinex.kcal / 100);
    modP += (mProt * MODULE_DATA.proteinex.p / 100);

    const mFres = parseFloat(document.getElementById('modFresubin').value) || 0;
    modK += (mFres * MODULE_DATA.fresubin.kcal / 100);
    modP += (mFres * MODULE_DATA.fresubin.p / 100);

    // NEW V3.60: Factor in Oral Intake
    const oralK = parseFloat(document.getElementById('oralKcal').value) || 0;
    const oralP = parseFloat(document.getElementById('oralProt').value) || 0;
    const oralC = parseFloat(document.getElementById('oralCHO').value) || 0;
    const oralL = parseFloat(document.getElementById('oralLip').value) || 0;

    // NEW V3.60: Factor in IV Fluids (Sueroterapia)
    const ivType = document.getElementById('ivType').value;
    const ivVol = parseFloat(document.getElementById('ivVolume').value) || 0;
    let ivK = 0, ivC = 0;

    if (ivType === 'sg5') {
        ivC = ivVol * 0.05;     // 5g per 100ml
        ivK = ivC * 3.4;        // 3.4 kcal per g of IV dextrose
    } else if (ivType === 'sg10') {
        ivC = ivVol * 0.10;     // 10g per 100ml
        ivK = ivC * 3.4;
    }

    k += (modK + oralK + ivK);
    p += (modP + oralP);
    c += (modC + oralC + ivC);
    l += (modL + oralL);

    // --- NEW V4.40: Factor in Route Overlap (Traslape) ---
    if (AppState.traslape && AppState.traslape.active) {
        k += (AppState.traslape.sourceKcal || 0);
        p += (AppState.traslape.sourceProt || 0);
        c += (AppState.traslape.sourceCHO || 0);
        l += (AppState.traslape.sourceLip || 0);
    }

    // Animation: Count Up Numbers
    animateValue("valKcal", Math.round(k));
    animateValue("valProt", p.toFixed(1));
    animateValue("valCHO", c.toFixed(1));
    animateValue("valLip", l.toFixed(1));
    animateValue("simCurrent", Math.round(k));

    const adeqMode = AppState.adequacyMode || 'goal';
    const theoreticalGET = AppState.patient?.tmt || AppState.patient?.tmt_calculated || parseFloat(document.getElementById('valGET')?.innerText) || 2000;
    const goal = (adeqMode === 'get') ? theoreticalGET : (parseFloat(document.getElementById('goalTotal').value) || theoreticalGET);
    document.getElementById('simBar').style.width = Math.min((k / goal) * 100, 100) + '%';

    // Animation: Stacked Bar (New)
    const totalMacross = p + c + l;
    const barProtEl = document.getElementById('barProt');
    const barCHOEl = document.getElementById('barCHO');
    const barLipEl = document.getElementById('barLip');
    if (barProtEl && barCHOEl && barLipEl) {
        if (totalMacross > 0) {
            const pPct = (p / totalMacross) * 100;
            const cPct = (c / totalMacross) * 100;
            const lPct = (l / totalMacross) * 100;

            barProtEl.style.width = pPct + "%";
            barCHOEl.style.width = cPct + "%";
            barLipEl.style.width = lPct + "%";
        } else {
            barProtEl.style.width = "0%";
            barCHOEl.style.width = "0%";
            barLipEl.style.width = "0%";
        }
    }

    // Compare Mode Updates
    if (AppState.compareMode) {
        updateCompareResults(k, p, c, l);
    }

    // NEW V3.62: Update Adequacy Card
    const adeqCard = document.getElementById('adequacyCard');
    const adeqKcal = document.getElementById('adeqKcal');
    const adeqProt = document.getElementById('adeqProt');
    const adeqCHO = document.getElementById('adeqCHO');
    const adeqLip = document.getElementById('adeqLip');

    // Read goals (grams) from dataset values
    const elP = document.getElementById('goalProt');
    const elC = document.getElementById('goalCHO');
    const elL = document.getElementById('goalLip');

    const goalP = elP ? (parseFloat(elP.dataset.val) || 0) : 0;
    const goalC = elC ? (parseFloat(elC.dataset.val) || 0) : 0;
    const goalL = elL ? (parseFloat(elL.dataset.val) || 0) : 0;

    // Use selected adequacyMode (META vs GET)
    const officialKcalGoal = goal;

    if (adeqCard) {
        // Redefined V4.27: Card is permanent. Values calculated if goals exist.
        adeqCard.style.display = 'block';

        // Kcal Adequacy
        if (officialKcalGoal > 0) {
            const pctK = Math.round((k / officialKcalGoal) * 100);
            adeqKcal.innerText = pctK + "%";
            adeqKcal.style.color = (pctK < 90 || pctK > 110) ? '#e74c3c' : '#27ae60';
        } else { adeqKcal.innerText = "--"; adeqKcal.style.color = '#888'; }

        // Prot Adequacy
        if (goalP > 0) {
            const pctP = Math.round((p / goalP) * 100);
            adeqProt.innerText = pctP + "%";
            adeqProt.style.color = (pctP < 90 || pctP > 110) ? '#e74c3c' : '#27ae60';
        } else { adeqProt.innerText = "--"; adeqProt.style.color = '#888'; }

        // CHO Adequacy
        if (goalC > 0) {
            const pctC = Math.round((c / goalC) * 100);
            adeqCHO.innerText = pctC + "%";
            adeqCHO.style.color = (pctC < 90 || pctC > 110) ? '#e74c3c' : '#27ae60';
        } else { adeqCHO.innerText = "--"; adeqCHO.style.color = '#888'; }

        // Lip Adequacy
        if (goalL > 0) {
            const pctL = Math.round((l / goalL) * 100);
            adeqLip.innerText = pctL + "%";
            adeqLip.style.color = (pctL < 90 || pctL > 110) ? '#e74c3c' : '#27ae60';
        } else { adeqLip.innerText = "--"; adeqLip.style.color = '#888'; }

    }

    // Trigger Infusion Calc update if volume changes
    calcInfusion();
    calcHydration();

    // Update Chart
    if (AppState.chart) {
        // Convert to calories for distribution chart (4 kcal/g Prot/CHO, 9 kcal/g Fat)
        const pCal = p * 4;
        const cCal = c * 4;
        const lCal = l * 9;

        AppState.chart.data.datasets[0].data = [pCal, cCal, lCal];
        AppState.chart.update();
    }

    // NEW V3.95: Escáner Proteico (Neonate g/kg/d)
    const proTracker = document.getElementById('proteinTrackerResult');
    if (proTracker) {
        if (AppState.patient.peso > 0 && AppState.patient.type === 'neonate') {
            const pt = p / AppState.patient.peso; // Prot divided by Total Weight in kg
            let ptColor = '#27ae60';
            let ptL = 'Ideal';
            // Neonatal protein brackets
            if (pt < 2.5) { ptColor = '#c0392b'; ptL = '⚠️ Peligro: Déficit Grave'; }
            else if (pt < 3.2) { ptColor = '#f39c12'; ptL = 'Subóptimo'; }
            else if (pt >= 3.2 && pt <= 4.2) { ptColor = '#27ae60'; ptL = 'Rango Crítico (UCIN)'; }
            else if (pt > 4.5) { ptColor = '#c0392b'; ptL = '⚠️ Sobrecarga Renal'; }
            else { ptColor = '#2980b9'; ptL = 'Límite Superior'; }

            proTracker.innerHTML = `
                <div style="margin-top:10px; margin-bottom:10px; background:${ptColor}10; border:2px dashed ${ptColor}; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:700; color:${ptColor}; font-size:1rem;">
                        ðŸ©¸ Proteína Diaria: <span style="font-size:1.2rem; font-weight:800;">${pt.toFixed(2)}</span> <span style="font-size:0.8rem;">g/kg/d</span>
                    </div>
                    <div style="background:${ptColor}; color:#fff; font-size:0.7rem; padding:4px 8px; border-radius:6px; font-weight:800;">
                        ${ptL}
                    </div>
                </div>`;
            proTracker.style.display = 'block';
        } else {
            proTracker.style.display = 'none';
        }
    }
    // --- NEW V4.42: Protein Justification (NPC:N Ratio) ---
    const updateProteinJustification = (actualKcal, actualProt) => {
        const goalRatioVal = document.getElementById('ratioGoalVal');
        const goalRatioDiag = document.getElementById('ratioGoalDiag');
        const actualRatioVal = document.getElementById('ratioActualVal');
        const actualRatioDiag = document.getElementById('ratioActualDiag');

        if (!actualRatioVal || !goalRatioVal) return;

        const pA = AppState.patient || {};
        const isPed = (pA.type === 'pediatric' || pA.type === 'neonate' || (pA.ageParts && pA.ageParts.y < 18));

        const getNPCDiagnosis = (ratio, isPed) => {
            if (isPed) {
                if (ratio < 90) return '⚠️ ¡Demasiada Proteína! (Riesgo Renal)';
                if (ratio <= 150) return 'âœ… ¡Perfecto para Crecimiento Rápido!';
                if (ratio <= 200) return 'ðŸ’¡ Mantenimiento (Sube prote si quieres anabolismo)';
                return '⚠️ ¡Faltan Proteínas urgentemente! (Riesgo Nutricional)';
            } else {
                if (ratio < 100) return 'âœ… Fórmula apta para Estrés Severo (UCI)';
                if (ratio <= 130) return 'âœ… Fórmula apta para Estrés Moderado';
                if (ratio <= 180) return 'âœ… Mantenimiento (Normal)';
                return '⚠️ ¡Falta Proteína! (Exceso de Energía / Lipogénesis)';
            }
        };

        // --- 1. Evaluate GOAL ---
        const goalTotal = parseFloat(document.getElementById('goalTotal')?.value) || 0;
        const goalP = parseFloat(document.getElementById('goalProt')?.dataset.val) || 0;

        if (goalTotal > 0 && goalP > 0) {
            const goalN = goalP / 6.25;
            const goalNPC = goalTotal - (goalP * 4);
            const goalRatio = goalNPC / goalN;
            goalRatioVal.innerText = `${Math.round(goalRatio)}:1`;
            goalRatioDiag.innerText = getNPCDiagnosis(goalRatio, isPed);
        } else {
            goalRatioVal.innerText = '-- : 1';
            goalRatioDiag.innerText = 'Faltan metas';
        }

        // --- 2. Evaluate ACTUAL ---
        if (actualKcal > 0 && actualProt > 0) {
            const actN = actualProt / 6.25;
            const actNPC = actualKcal - (actualProt * 4);
            const actRatio = actNPC / actN;
            actualRatioVal.innerText = `${Math.round(actRatio)}:1`;
            actualRatioDiag.innerText = getNPCDiagnosis(actRatio, isPed);

            if (actRatio < 90) actualRatioVal.style.color = '#e74c3c';
            else if (actRatio <= 150) actualRatioVal.style.color = '#27ae60';
            else if (actRatio <= 200) actualRatioVal.style.color = '#3498db';
            else actualRatioVal.style.color = '#f39c12';

        } else {
            actualRatioVal.innerText = '-- : 1';
            actualRatioDiag.innerText = 'Sin simulación';
        }
    };

    updateProteinJustification(k, p);
    renderMinerals();

    // --- FINAL V4.25: Global update for Adequacy Strategy ---
    if (typeof window.updatePrescriptionStrategy === 'function') window.updatePrescriptionStrategy(k);
}

// --- 10. INFUSION CALCULATOR LOGIC (NEW) ---
function initInfusionLogic() {
    // Populate RTH Selector
    const rthSel = document.getElementById('infusionRTHSelect');
    if (rthSel) {
        let html = '<option value="">-- No usar fórmula RTH --</option>';
        LOCAL_FORMULAS.filter(f => f.cat.includes("RTH")).forEach(f => {
            html += `<option value="${f.id}">${f.name}</option>`;
        });
        rthSel.innerHTML = html;
    }

    // --- NEW V4.20: Population-aware Infusion Proposals ---
    window.updateInfusionProposal = () => {
        const p = AppState.patient || {};
        const label = document.getElementById('infusionSuggestionLabel');
        if (!label) return;
        const isPeds = p.type === 'pediatric' || p.type === 'neonate';
        const limit = isPeds ? 250 : 80;
        label.innerText = `Sug: ${limit}`;
        label.dataset.suggestion = limit;
        label.style.borderColor = isPeds ? '#9b59b6' : '#3498db';
        label.style.color = isPeds ? '#9b59b6' : '#3498db';
    };

    window.applyInfusionSuggestion = () => {
        const label = document.getElementById('infusionSuggestionLabel');
        const input = document.getElementById('infusionRate');
        if (label && input) {
            input.value = label.dataset.suggestion || 80;
            window.calcInfusion();
        }
    };

    // Bind inputs to global scope since we referenced it inline
    window.calcInfusion = function () {
        // We listen to the main prescribed volume! 
        const totalVolPrescrito = window.getEffectiveSimulationVolume();
        const rate = parseFloat(document.getElementById('infusionRate').value) || 0;
        const sachetStartStr = document.getElementById('infusionStart')?.value;
        const selectedRthId = document.getElementById('infusionRTHSelect')?.value;

        const resBox = document.getElementById('infusionResultBox');
        const logBox = document.getElementById('valLogisticsBox');
        const valEnd = document.getElementById('valEndTime');
        const valDur = document.getElementById('valDuration');

        if (totalVolPrescrito <= 0 && rate <= 0) {
            resBox.style.display = 'none';
            if (logBox) logBox.style.display = 'none';
            return;
        }

        const p = AppState.patient || {};
        const isPeds = p.type === 'pediatric' || p.type === 'neonate';
        const limit = isPeds ? 250 : 80;

        // --- 1. Sachet Terminate Calculation ---
        let sachetEndStrDisplay = '--:--';
        let sachetDurDisplay = '';
        let sachetEndDate = null;
        let rthObj = null;

        if (selectedRthId) {
            rthObj = LOCAL_FORMULAS.find(f => f.id === selectedRthId);
        }

        if (rate > 0 && sachetStartStr) {
            resBox.style.display = 'flex';

            let volToPass = totalVolPrescrito;
            if (rthObj) volToPass = rthObj.volBase || 1000;

            const durationHrs = volToPass / rate;
            const [startH, startM] = sachetStartStr.split(':').map(Number);
            const now = new Date();
            now.setHours(startH, startM, 0, 0);

            const endTimestamp = now.getTime() + (durationHrs * 3600 * 1000);
            sachetEndDate = new Date(endTimestamp);

            const endH = sachetEndDate.getHours().toString().padStart(2, '0');
            const endM = sachetEndDate.getMinutes().toString().padStart(2, '0');

            const dayDiff = sachetEndDate.getDate() - now.getDate();
            const dayLabel = dayDiff > 0 ? " (+1 día)" : "";

            sachetEndStrDisplay = `${endH}:${endM}${dayLabel}`;
            const hrs = Math.floor(durationHrs);
            const mins = Math.round((durationHrs - hrs) * 60);
            sachetDurDisplay = `(${hrs}h ${mins}m)`;
        } else if (rthObj && totalVolPrescrito > 0) {
            resBox.style.display = 'flex';
        } else {
            resBox.style.display = 'none';
        }

        valEnd.innerText = sachetEndStrDisplay;
        valDur.innerText = sachetDurDisplay;

        // --- 2. SEDILE CEFE Logistics Recommendation ---
        const calcTotalVol = totalVolPrescrito > 0 ? totalVolPrescrito : (rate * 24);

        if (calcTotalVol > 0 && rate > 0) {
            const bottleVol = rthObj?.volBase || 1000;
            const envasesNedded = Math.ceil(calcTotalVol / bottleVol);

            let currentSachetWarningStr = '';
            if (sachetEndDate) {
                const hourEnds = sachetEndDate.getHours();
                if (hourEnds >= 18 || hourEnds < 8) {
                    currentSachetWarningStr = `<div style="margin-top:6px; color:#c0392b;">⚠️ <b>Riesgo Quiebre Nocturno:</b> El RTH actual acaba a las ${sachetEndDate.getHours().toString().padStart(2, '0')}:${sachetEndDate.getMinutes().toString().padStart(2, '0')}. Analiza garantizar el stock de reemplazo hoy a las 18:00.</div>`;
                }
            }

            let cycleStr = '';
            let planesText = `<span style="opacity:0.8; font-style:italic;">(Ingresa una 'Hora de Instalación' y una 'Velocidad' para calcular la logística SEDILE de 24 hrs)</span>`;

            if (sachetStartStr && rate > 0) {
                const [cH, cM] = sachetStartStr.split(':').map(Number);
                const cycleDurHrs = totalVolPrescrito / rate;

                if (!isNaN(cycleDurHrs) && isFinite(cycleDurHrs)) {
                    const cNow = new Date();
                    cNow.setHours(cH, cM, 0, 0);
                    const cEndDate = new Date(cNow.getTime() + (cycleDurHrs * 3600 * 1000));
                    cycleStr = ` | Fin Ciclo 24H: <b style="color:var(--primary);">${cEndDate.getHours().toString().padStart(2, '0')}:${cEndDate.getMinutes().toString().padStart(2, '0')}</b>`;
                }

                // SECRETO LOGISTICO SEDILE: Calcular splits 14h / 18h
                let count14 = 0;
                let count18 = 0;

                const cycleStartDecimal = cH + (cM / 60);
                const bottleDuration = bottleVol / rate;

                for (let i = 0; i < envasesNedded; i++) {
                    const connectTime = (cycleStartDecimal + (i * bottleDuration)) % 24;
                    // SEDILE Safe Window (margen orgánico prep.): 
                    // Si se instala tarde (15:00 a 18:59) -> cabe para pedir a las 14:00 (hoy)
                    // Si se instala en cualquier otro horario -> pedir a las 18:00
                    if (connectTime >= 15 && connectTime < 19) {
                        count14++;
                    } else {
                        count18++;
                    }
                }

                planesText = `
                    <div style="margin-top:5px; background:rgba(255,255,255,0.7); padding:4px 8px; border-radius:5px; border-left:3px solid #27ae60;">
                        <b style="color:#27ae60; font-size:0.75rem;">ðŸ“‹ Plan de Repartos SEDILE (${envasesNedded} en total):</b><br>
                        â€¢ En el reparto de las 14:00 hrs: Pedir <b>${count14}</b> producto(s).<br>
                        â€¢ En el reparto de las 18:00 hrs: Pedir <b>${count18}</b> producto(s).
                    </div>
                `;
            }

            const fallbackName = rthObj ? rthObj.name : "Fórmula (" + bottleVol + "ml)";
            logBox.style.display = 'block';
            logBox.innerHTML = `
                <div style="font-size:0.8rem; margin-bottom:4px; color:#555;">ðŸ“Š Pauta 24hrs: <b>${calcTotalVol} ml</b> ${cycleStr}</div>
                <div style="border-top:1px dashed #f1c40f; margin:5px 0;"></div>
                ðŸ“¦ Necesitas <b>${envasesNedded} producto(s) RTH diarios</b> de ${fallbackName}.<br>
                ${planesText}
                ${currentSachetWarningStr}
                ${rate > limit ? `<div style="margin-top:6px; color:#e74c3c; font-weight:700; background:rgba(231,76,60,0.1); padding:5px; border-radius:4px; border:1px solid rgba(231,76,60,0.3);">⚠️ Alerta Velocidad: Estás superando el límite clínico sugerido (${limit} ml/hr) para esta población.</div>` : ''}
            `;
        } else {
            logBox.style.display = 'none';
        }
    };

    // Add volume listener so it triggers the calculator dynamically
    const volInput = document.getElementById('volume');
    if (volInput) {
        volInput.addEventListener('input', () => { if (typeof window.calcInfusion === 'function') window.calcInfusion(); });
    }
}

// --- 11. HYDRATION LOGIC (NEW) ---
function initHydrationLogic() {
    // Listener for factor input
    const factorInput = document.getElementById('hydFactor');
    if (factorInput) factorInput.oninput = calcHydration;
}

function toggleHydMethod() {
    const isMlKg = document.querySelector('input[name="hydMethod"][value="mlkg"]').checked;
    document.getElementById('hydFactorRow').style.display = isMlKg ? 'block' : 'none';
    calcHydration();
}

function resetPatientForm() {
    if (!confirm("¿Deseas limpiar todos los campos para un nuevo paciente?")) return;

    // Reset Global State
    AppState.patient = { id: null, nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0, ia_report: null };
    AppState.userOverridesGoal = false;

    // 1. Dashboard Inputs
    const dashIds = ['nombre', 'edad', 'sexo', 'peso', 'estatura', 'diagnostico', 'cama', 'actividad', 'goalTotal', 'goalKcalBox'];
    dashIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = (id === 'actividad') ? '1.2' : (id === 'sexo' ? 'm' : '');
    });

    // 2. Simulator Inputs
    const simIds = [
        'formulaSearch', 'formulaSelect', 'volume', 'dilution',
        'modNessucar', 'modMCT', 'modEnterex', 'modBanatrol', 'modProteinex', 'modFresubin',
        'oralKcal', 'oralProt', 'oralCHO', 'oralLip', 'oralWater',
        'ivType', 'ivVolume', 'goalTotal'
    ];
    simIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const ivTypeEl = document.getElementById('ivType');
    if (ivTypeEl) ivTypeEl.value = 'none';

    // 3. Assessment Inputs
    const assessIds = [
        'ccintura', 'cbraquial', 'cpantorrilla', 'altrodilla',
        'ptricipital', 'pbicipital', 'piliaco', 'pabdominal',
        'mediaenv', 'envcomp', 'edemaGrade', 'diagPES', 'diagnosticoPES',
        'residuo', 'diarrea', 'distension', 'accesoTipo', 'accesoFecha',
        'goalProtKg', 'goalCHOKg', 'goalLipKg'
    ];
    assessIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = (id === 'edemaGrade') ? '0' : '';
    });

    // 4. Clear Dynamic UI
    const containers = ['examsContainer', 'iaResultContainer', 'clinicalNoteContainer', 'rossContainer', 'frisanchoContainer'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = id.includes('Container') ? '' : el.innerHTML;
            el.style.display = 'none';
        }
    });

    // 5. Nutri IA State
    const iaInitial = document.getElementById('iaInitialState');
    if (iaInitial) iaInitial.style.display = 'block';

    // 6. Reset Badges
    const badges = ['valBMI', 'resTMB', 'valIdealWeight', 'valIPT', 'valIPTClass', 'simGoal', 'simCurrent', 'valKcal', 'valProt', 'valCHO', 'valLip'];
    badges.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = (id.includes('val') || id.includes('res')) ? '--' : '0';
    });

    // Update Display
    const patientBadge = document.getElementById('currentPatientName');
    if (patientBadge) patientBadge.innerText = 'Nuevo Paciente';

    updateFormulaSelect();
    runSimulation();
    showToast("âœ¨ Formulario reseteado para nuevo paciente");
}

function calcHydration() {
    const p = AppState.patient;
    const vol = window.getEffectiveSimulationVolume();
    const dil = (parseFloat(document.getElementById('dilution')?.value) || 100) / 100;
    let realVol = vol * dil; // Effective volume from formula

    // NEW V3.60: Add Oral Water and IV Volume to Real Volume
    const oralWater = parseFloat(document.getElementById('oralWater')?.value) || 0;
    const ivVol = parseFloat(document.getElementById('ivVolume')?.value) || 0;

    realVol += oralWater + ivVol;

    if (p.peso <= 0) return;

    let req = 0;
    const isMlKgRadio = document.querySelector('input[name="hydMethod"][value="mlkg"]');
    const isMlKg = isMlKgRadio ? isMlKgRadio.checked : true;

    if (isMlKg) {
        const factor = parseFloat(document.getElementById('hydFactor')?.value) || 0;
        req = p.peso * factor;
    } else {
        if (p.peso <= 10) req = p.peso * 100;
        else if (p.peso <= 20) req = 1000 + (p.peso - 10) * 50;
        else req = 1500 + (p.peso - 20) * 20;
    }

    // 1. Requerimiento Base
    document.getElementById('hydReq').innerText = Math.round(req);

    // 2. Clinical Metrics V3.12
    const currentKcal = parseFloat(document.getElementById('valKcal')?.innerText) || 0;

    // Ingreso Actual
    const elTotal = document.getElementById('valHydTotal');
    if (elTotal) elTotal.innerText = `${Math.round(realVol)} ml`;

    // Relación ml/kcal
    const elRatio = document.getElementById('valHydRatio');
    if (elRatio && currentKcal > 0) {
        elRatio.innerText = (realVol / currentKcal).toFixed(2);
    }

    // Balance Estimado
    const elBalance = document.getElementById('valHydBalance');
    const balance = Math.round(realVol - req);
    if (elBalance) {
        elBalance.innerText = `${balance > 0 ? '+' : ''}${balance} ml`;
        elBalance.style.color = balance < -50 ? '#e67e22' : (balance > 50 ? '#3498db' : '#27ae60');
    }

    // 3. Water Bar
    const bar = document.getElementById('hydBar');
    const pct = Math.min((realVol / req) * 100, 100);
    bar.style.width = pct + "%";
    bar.style.background = (pct < 80) ? "#e67e22" : (pct > 105) ? "#3498db" : "#27ae60";
}

// --- 12. COMPARE LOGIC (NEW) ---
function initCompareLogic() {
    const btnComp = document.getElementById('btnToggleCompare');
    const rowComp = document.getElementById('compareRow');
    const selB = document.getElementById('formulaSelectB');

    // Clone options from main select to secondary
    setTimeout(() => {
        selB.innerHTML = document.getElementById('formulaSelect').innerHTML;
    }, 1000); // Wait for main init

    btnComp.onclick = () => {
        AppState.compareMode = !AppState.compareMode;
        rowComp.style.display = AppState.compareMode ? 'block' : 'none';
        btnComp.classList.toggle('active');
        runSimulation();
    };

    selB.onchange = () => {
        runSimulation();
    };
}

// Duplicate function at line 928 removed in V3.30

// Simple CountUp Animation
function animateValue(id, end) {
    const obj = document.getElementById(id);
    if (!obj) return;

    const start = parseFloat(obj.innerText) || 0;
    const endVal = parseFloat(end) || 0;

    if (start === endVal) return;

    // If change is drastic or first load, maybe faster?
    const duration = 600;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); // EaseOutQuart

        const current = start + (endVal - start) * ease;

        if (Number.isInteger(endVal)) {
            obj.innerText = Math.round(current);
        } else {
            obj.innerText = current.toFixed(1);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            obj.innerText = end;
        }
    }
    requestAnimationFrame(update);
}

async function savePrescription() {
    if (!AppState.user || !AppState.user.id) {
        alert("⚠️ Error: Sesión de usuario no válida.");
        return;
    }

    const btn = document.getElementById('btnSaveHistory');
    const { error } = await supabaseClient.from('prescripciones').insert([{
        paciente_nombre: document.getElementById('nombre').value || 'Anónimo',
        detalle: `Kcal: ${document.getElementById('valKcal').innerText}, Prot: ${document.getElementById('valProt').innerText}`,
        user_id: AppState.user.id
    }]);
    btn.innerText = error ? "Error" : "¡Prescripción Guardada!";
    setTimeout(() => btn.innerText = "Prescribir y Guardar Cloud", 2000);
}

// --- 9. PWA LOGIC ---
let deferredPrompt;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registrado', reg))
            .catch(err => console.log('SW error', err));
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const container = document.getElementById('pwaInstallContainer');
    if (container) container.style.display = 'block';
});

document.getElementById('btnInstallApp').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response:', outcome);
    deferredPrompt = null;
    document.getElementById('pwaInstallContainer').style.display = 'none';
});
// --- 13. SMART SEARCH LOGIC (NEW) ---
function initSearchLogic() {
    attachSearch('formulaSearch', 'formulaSelect');
    attachSearch('compareSearch', 'formulaSelectB');
}

function attachSearch(inputId, selectId) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const select = document.getElementById(selectId);
        if (!select) return;

        if (term === '') {
            updateFormulaSelect(); // Restore all options if search is cleared
            return;
        }

        const allOptions = AppState.formulas;
        const filtered = allOptions.filter(f => f.name.toLowerCase().includes(term));

        select.innerHTML = '';
        if (filtered.length === 0) {
            select.innerHTML = '<option>Sin resultados</option>';
            return;
        }

        const cats = {};
        filtered.forEach(f => {
            if (!cats[f.cat]) cats[f.cat] = [];
            cats[f.cat].push(f);
        });

        for (const [catName, formulas] of Object.entries(cats)) {
            const grp = document.createElement('optgroup');
            grp.label = catName;
            formulas.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.id;
                const star = AppState.favorites.includes(f.id) ? 'â­ ' : '';
                opt.innerText = star + f.name;
                grp.appendChild(opt);
            });
            select.appendChild(grp);
        }
    });
}

// --- 13.1 Update Formula Select (V3.62) ---
// Removing inline version of this hook, we already have updateFormulaSelect and updateFormulaSelect2

// --- 14. CHART LOGIC (NEW) ---
function initChartSim() {
    const ctx = document.getElementById('macroChart')?.getContext('2d');
    if (!ctx) return;

    if (typeof Chart === 'undefined') {
        console.warn("ðŸ“Š Chart.js not loaded yet or blocked. Skipping chart init.");
        return;
    }
    AppState.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Prot', 'Carb', 'Líp'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#e74c3c', // Red (Proteins)
                    '#3498db', // Blue (CHO)
                    '#f1c40f'  // Yellow (Lipids)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%', // slightly thicker to fit text
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            let total = context.chart._metasets[context.datasetIndex].total;
                            let percentage = Math.round((value / total) * 100) + '%';
                            return label + ': ' + percentage;
                        }
                    }
                },
                // Require chartjs-plugin-datalabels
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold', size: 10 },
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(0) + "%";
                        return value > 0 ? percentage : '';
                    }
                }
            }
        }
    });
}

function updateCompareResults(k1, p1, c1, l1) {
    const box = document.getElementById('compareResult');
    const macroBox = document.getElementById('compareMacros');
    if (!box || !AppState.compareMode) return;

    const fIdB = document.getElementById('formulaSelectB').value;
    const formulaB = AppState.formulas.find(f => f.id === fIdB);

    if (!formulaB) {
        if (box) box.innerHTML = '';
        if (macroBox) macroBox.innerHTML = '';
        // Hide formula B specific macro board if it exists
        const boardB = document.getElementById('macroBoardB');
        if (boardB) boardB.style.display = 'none';
        return;
    }

    const v1 = window.getEffectiveSimulationVolume();
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;
    const dilBInput = document.getElementById('dilutionB');
    const v2B = dilBInput && dilBInput.value !== "" ? parseFloat(dilBInput.value) : v2;

    let k2 = 0, p2 = 0, c2 = 0, l2 = 0;

    const volB = formulaB.isBotellin ? (v1 * formulaB.volUnit) : v1;
    if (formulaB.type === 'recipe') {
        formulaB.recipe.forEach(rec => {
            const grams = volB * (rec.defPct / 100);
            k2 += rec.k * (grams / 100);
            p2 += rec.p * (grams / 100);
            c2 += rec.c * (grams / 100);
            l2 += rec.f * (grams / 100);
        });
    } else if (formulaB.type === 'p') {
        const dil = v2B > 0 ? v2B : (formulaB.stdDil || 0);
        const grams = volB * (dil / 100);
        k2 = formulaB.k * (grams / 100);
        p2 = formulaB.p * (grams / 100);
        c2 = formulaB.c * (grams / 100);
        l2 = formulaB.f * (grams / 100);
    } else {
        let scl = 1;
        if (formulaB.stdDil && v2B > 0) scl = v2B / formulaB.stdDil;
        k2 = formulaB.k * (volB / 100) * scl;
        p2 = formulaB.p * (volB / 100) * scl;
        c2 = formulaB.c * (volB / 100) * scl;
        l2 = formulaB.f * (volB / 100) * scl;
    }

    // Update Formula B Macro Board (shown below the comparison bar)
    const boardB = document.getElementById('macroBoardB');
    if (boardB) {
        boardB.style.display = 'grid';
        const labelB = document.getElementById('lblFormulaB');
        if (labelB) labelB.innerText = `Fórmula B: ${formulaB.name}`;

        // Factor in Modules V3.50
        let modK = 0, modP = 0, modC = 0, modL = 0;

        const mNess = parseFloat(document.getElementById('modNessucar').value) || 0;
        modK += (mNess * MODULE_DATA.nessucar.kcal / 100);
        modC += (mNess * MODULE_DATA.nessucar.c / 100);

        const mMCT = parseFloat(document.getElementById('modMCT').value) || 0;
        modK += (mMCT * MODULE_DATA.mct.kcal / 100);
        modL += (mMCT * MODULE_DATA.mct.f / 100);

        const mEnt = parseFloat(document.getElementById('modEnterex').value) || 0;
        modK += (mEnt * MODULE_DATA.enterex.kcal / 100);
        modC += (mEnt * MODULE_DATA.enterex.c / 100);

        const mBan = parseFloat(document.getElementById('modBanatrol').value) || 0;
        modK += (mBan * MODULE_DATA.banatrol.kcal / 100);
        modC += (mBan * MODULE_DATA.banatrol.c / 100);

        const mProt = parseFloat(document.getElementById('modProteinex').value) || 0;
        modK += (mProt * MODULE_DATA.proteinex.kcal / 100);
        modP += (mProt * MODULE_DATA.proteinex.p / 100);

        const mFres = parseFloat(document.getElementById('modFresubin').value) || 0;
        modK += (mFres * MODULE_DATA.fresubin.kcal / 100);
        modP += (mFres * MODULE_DATA.fresubin.p / 100);

        // Primary formula A already has modules added in runSimulation
        // But if we want to update the text labels again here:
        document.getElementById('valKcal').innerText = Math.round(k1);
        document.getElementById('valProt').innerText = p1.toFixed(1);
        document.getElementById('valCHO').innerText = c1.toFixed(1);
        document.getElementById('valLip').innerText = l1.toFixed(1);

        // FORMULA B Board Update
        // Calculate B macros + same modules (since modules are added to the 'preparación')
        k2 += modK; p2 += modP; c2 += modC; l2 += modL;

        document.getElementById('valKcalB').innerText = Math.round(k2);
        document.getElementById('valProtB').innerText = p2.toFixed(1);
        document.getElementById('valCHOB').innerText = c2.toFixed(1);
        document.getElementById('valLipB').innerText = l2.toFixed(1);
    }

    // --- differences ---
    renderMinerals();
    const diffK = Math.round(k2 - k1);
    const getBadge = (val, unit) => {
        const isPos = parseFloat(val) >= 0;
        const sign = isPos ? '+' : '';
        return `<span class="diff-badge ${isPos ? 'diff-pos' : 'diff-neg'}">${sign}${val}${unit}</span>`;
    };

    // User wants ONLY the "Vs:" part here
    box.innerHTML = `<div><b>Vs:</b> ${getBadge(diffK, ' kcal')}</div>`;

    // Update Secondary Stack Bar
    const stackSec = document.getElementById('stackCompare');
    if (stackSec) {
        stackSec.style.display = 'flex';
        setTimeout(() => { stackSec.style.opacity = '0.6'; stackSec.style.transform = 'translateY(18px)'; }, 50);

        // Distribution
        // c2 and l2 are already calculated correctly above, no need to redefine them with the broken logic.
        // We will just use the existing c2 and l2 variables.

        const calP = p2 * 4;
        const calC = c2 * 4;
        const calL = l2 * 9;
        const totalCal = calP + calC + calL || 1;

        document.getElementById('barProtB').style.width = (calP / totalCal * 100) + "%";
        document.getElementById('barCHOB').style.width = (calC / totalCal * 100) + "%";
        document.getElementById('barLipB').style.width = (calL / totalCal * 100) + "%";
    }
}

function initAssessmentLogic() {
    // Elements for Strategic Feedback (Scoped or accessed via DOM to avoid ReferenceErrors)
    const resEvoBadge = document.getElementById('evolutionResult');
    const lastGoalLabel = document.getElementById('valLastGoalDate');

    // Name Sync
    const nameInput = document.getElementById('nombre');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const val = e.target.value;
            const patientBadge = document.getElementById('currentPatientName');
            if (patientBadge) patientBadge.innerText = val || 'Nuevo Paciente';
        });
    }

    // --- NEW V4.40: Route Overlap (Traslape) Control ---
    // Initialize AppState.traslape if not exists
    if (!AppState.traslape) AppState.traslape = { active: false, mode: 'np-ne', sourceKcal: 0, sourceProt: 0, sourceCHO: 0, sourceLip: 0 };

    window.setTraslapeMode = (mode) => {
        AppState.traslape.mode = mode;
        const label = document.getElementById('traslapeLabel');
        const btnNPNE = document.getElementById('btnModeNPNE');
        const btnNEVO = document.getElementById('btnModeNEVO');

        if (label) {
            label.innerText = mode === 'np-ne' ? 'Aporte de Vía de Salida (NP):' : 'Aporte de Vía de Salida (NE):';
        }

        if (btnNPNE && btnNEVO) {
            if (mode === 'np-ne') {
                btnNPNE.style.background = '#e67e22'; btnNPNE.style.color = 'white';
                btnNEVO.style.background = 'transparent'; btnNEVO.style.color = '#666';
            } else {
                btnNEVO.style.background = '#e67e22'; btnNEVO.style.color = 'white';
                btnNPNE.style.background = 'transparent'; btnNPNE.style.color = '#666';
            }
        }
        window.updateTraslapeConfig();
    };

    window.updateTraslapeConfig = () => {
        const inputPct = parseFloat(document.getElementById('trasPercentage')?.value) || 0;
        const mainPctEl = document.getElementById('traslapeMainPct');
        const breakdownPanel = document.getElementById('traslapeMacroBreakdown');
        const breakdownOut = document.getElementById('trasBreakdownOut');
        const breakdownMain = document.getElementById('trasBreakdownMain');

        let pct = inputPct;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;

        if (mainPctEl) mainPctEl.innerText = (100 - pct) + '%';

        // Use active macro goal dataset values (the baseline requirement)
        const goalTotal = parseFloat(document.getElementById('goalTotal')?.value) || 0;
        const goalP = parseFloat(document.getElementById('goalProt')?.dataset.val) || 0;

        // CALCULATE BREAKDOWN
        const kcalOut = goalTotal * (pct / 100);
        const protOut = goalP * (pct / 100);
        const kcalMain = goalTotal * ((100 - pct) / 100);
        const protMain = goalP * ((100 - pct) / 100);

        if (breakdownPanel) breakdownPanel.style.display = (pct > 0) ? 'block' : 'none';
        if (breakdownOut) breakdownOut.innerText = `${Math.round(kcalOut)} Kcal | ${protOut.toFixed(1)}g P`;
        if (breakdownMain) breakdownMain.innerText = `${Math.round(kcalMain)} Kcal | ${protMain.toFixed(1)}g P`;

        // Update AppState for Simulation
        AppState.traslape.sourceKcal = kcalOut;
        AppState.traslape.sourceProt = protOut;
        AppState.traslape.pct = pct;
        AppState.traslape.active = (pct > 0);

        window.runSimulation();
    };

    // --- NEW V4.60: Advanced NPT Calculator Logic ---
    window.updateNPTCalculator = () => {
        const vol = parseFloat(document.getElementById('nptVol')?.value) || 0;
        const dex = parseFloat(document.getElementById('nptDex')?.value) || 0;
        const aa = parseFloat(document.getElementById('nptAA')?.value) || 0;
        const lip = parseFloat(document.getElementById('nptLip')?.value) || 0;
        const na = parseFloat(document.getElementById('nptNa')?.value) || 0;
        const k = parseFloat(document.getElementById('nptK')?.value) || 0;
        const weight = AppState.patient?.peso_calculo || AppState.patient?.peso || 0;

        if (document.getElementById('nptWeight')) {
            document.getElementById('nptWeight').value = weight;
        }

        // 1. Kcal No Proteicas (KcalNP)
        const kcalDex = dex * 3.4;
        const kcalLip = lip * 2.0; // 20% lipids = 2 kcal/ml
        const kcalNP = kcalDex + kcalLip;

        // 2. GIR (Carga Glucosa) - mg/kg/min
        let gir = 0;
        if (weight > 0) {
            gir = (dex * 1000) / (weight * 1440);
        }

        // 3. Nitrogen (g)
        const nitro = aa / 6.25;

        // 4. Osmolarity (approx mOsm/L)
        let osm = 0;
        if (vol > 0) {
            const dexL = (dex / vol) * 1000;
            const aaL = (aa / vol) * 1000;
            const naL = (na / vol) * 1000;
            const kL = (k / vol) * 1000;
            osm = (dexL * 5) + (aaL * 10) + (naL * 2) + (kL * 2);
        }

        // Update UI Results
        if (document.getElementById('nptOsm')) document.getElementById('nptOsm').innerText = Math.round(osm);
        if (document.getElementById('nptGIR')) document.getElementById('nptGIR').innerText = gir.toFixed(1);
        if (document.getElementById('nptKcalNP')) document.getElementById('nptKcalNP').innerText = Math.round(kcalNP);
        if (document.getElementById('nptKcalGN')) {
            const ratio = nitro > 0 ? (kcalNP / nitro) : 0;
            document.getElementById('nptKcalGN').innerText = Math.round(ratio);
        }

        // Osmolarity Status (Central vs Peripheral)
        const statusEl = document.getElementById('nptStatus');
        if (statusEl) {
            if (osm > 800) {
                statusEl.innerText = "Central";
                statusEl.style.background = "#e74c3c";
            } else {
                statusEl.innerText = "Periférica";
                statusEl.style.background = "#27ae60";
            }
        }
    };

    // --- NEW V4.24: Adequacy Mode Control ---
    window.setAdequacyMode = (mode) => {
        AppState.adequacyMode = mode;

        // Update UI buttons
        const btnGoal = document.getElementById('btnAdeqGoal');
        const btnGET = document.getElementById('btnAdeqGET');

        if (btnGoal && btnGET) {
            if (mode === 'goal') {
                btnGoal.style.background = '#6c5ce7';
                btnGoal.style.color = 'white';
                btnGET.style.background = 'transparent';
                btnGET.style.color = '#666';
            } else {
                btnGET.style.background = '#3498db';
                btnGET.style.color = 'white';
                btnGoal.style.background = 'transparent';
                btnGoal.style.color = '#666';
            }
        }

        window.updatePrescriptionStrategy();
        updateMacroGoals();
        runSimulation();
    };

    // --- NEW V4.23: Real-time Strategic Feedback (Intake vs Requirement) ---
    window.updatePrescriptionStrategy = (currentKcalOverride) => {
        const p = AppState.patient || {};
        const mode = AppState.adequacyMode || 'goal';

        // Use provided kcal (from simulation) or scrape from UI
        let currentKcal = currentKcalOverride;
        if (currentKcal === undefined) {
            currentKcal = parseFloat(document.getElementById('valKcal')?.innerText) || 0;
        }

        // The denominator is determined by the selected clinical mode
        const goalTotal = parseFloat(document.getElementById('goalTotal')?.value) || 0;
        const theoreticalGET = p.tmt_calculated || 0;

        const targetDenominator = (mode === 'goal') ? (goalTotal || theoreticalGET) : theoreticalGET;
        const labelBase = (mode === 'goal') ? 'Meta' : 'GET';

        const badge = document.getElementById('strategyBadge');
        const fdbkText = document.getElementById('strategyText');
        const fdbkIcon = document.getElementById('strategyIcon');
        const fdbkCard = document.getElementById('strategyFeedback');

        if (!badge) return;

        // Reset state if no data
        if (targetDenominator <= 0 || currentKcal < 0) {
            badge.innerText = '--% ADECUACIÃ“N';
            badge.style.color = '#888';
            badge.style.background = '#eee';
            badge.style.borderColor = '#ddd';
            if (fdbkText) fdbkText.innerText = `Ingresa volumen para medir adecuación vs ${labelBase}.`;
            return;
        }

        const adequacy = (currentKcal / targetDenominator) * 100;
        badge.innerText = `${labelBase}: ${adequacy.toFixed(0)}%`;
        badge.style.display = 'inline-block';

        let label = '';
        let color = '';
        let icon = '';
        let bgColor = '';

        if (adequacy < 40) {
            label = 'Inicio / Refeeding';
            color = '#e67e22';
            icon = '⚠️';
            bgColor = 'rgba(230, 126, 34, 0.05)';
        } else if (adequacy < 85) {
            label = 'Progresión';
            color = '#3498db';
            icon = 'ðŸ“ˆ';
            bgColor = 'rgba(52, 152, 219, 0.05)';
        } else if (adequacy <= 115) {
            label = 'Meta Alcanzada';
            color = '#27ae60';
            icon = 'âœ…';
            bgColor = 'rgba(39, 174, 96, 0.05)';
        } else {
            label = 'Sobrealimentación / Superávit';
            color = '#e74c3c';
            icon = 'ðŸ”¥';
            bgColor = 'rgba(231, 76, 60, 0.05)';
        }

        if (fdbkText) fdbkText.innerText = `Estado (${labelBase}): ${label} (${Math.round(currentKcal)} kcal de ${Math.round(targetDenominator)} kcal)`;
        if (fdbkText) fdbkText.style.color = color;
        if (fdbkIcon) fdbkIcon.innerText = icon;
        if (fdbkCard) {
            fdbkCard.style.borderColor = color + '44';
            fdbkCard.style.background = bgColor;
        }
        badge.style.color = color;
        badge.style.borderColor = color + '66';
        badge.style.background = bgColor;
    };

    const inpGoalKcal = document.getElementById('goalKcalBox');
    const inpGoalTotal = document.getElementById('goalTotal');

    if (inpGoalKcal) {
        inpGoalKcal.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            const weight = parseFloat(document.getElementById('peso')?.value) || 0;
            const total = Math.round(val * weight);
            const resEvo = document.getElementById('evolutionResult');
            if (resEvo) resEvo.innerText = `= ${total} kcal/día`;

            if (inpGoalTotal && document.getElementById('getSelector')?.value === 'factorial') {
                inpGoalTotal.value = total;
                window.updatePrescriptionStrategy();
                runSimulation();
                updateMacroGoals();
            }
        });
    }

    if (inpGoalTotal) {
        inpGoalTotal.addEventListener('input', () => {
            window.updatePrescriptionStrategy();
            runSimulation();
            updateMacroGoals();
        });
    }

    if (inpGoalTotal) {
        inpGoalTotal.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;

            // Update Simulator and AppsState
            AppState.userOverridesGoal = true;
            const simGoal = document.getElementById('simGoal');
            if (simGoal) simGoal.innerText = Math.round(val);
            runSimulation();

            // Store and show date
            const today = new Date().toLocaleDateString('es-CL');
            localStorage.setItem('sedile_last_goal_date', today);
            const lastGoalLbl = document.getElementById('valLastGoalDate');
            if (lastGoalLbl) lastGoalLbl.innerText = `Ultima meta: ${today}`;
        });
    }

    // NEW V3.62: Macro Goals Triggers
    const macroGoalsIds = ['goalProt', 'goalCHO', 'goalLip'];
    macroGoalsIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', runSimulation);
    });

    // NEW V3.16: CHUMLEA Estimation (Pediatrics/Adults)
    const chumleaInputs = ['altrodilla', 'edad', 'sexo'];
    chumleaInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcChumleaWeight);
    });

    const chumleaWatcher = document.querySelectorAll('.input-watch-chumlea');
    chumleaWatcher.forEach(inp => inp.oninput = calcChumleaWeight);

    // NEW V3.41: Advanced Anthropometry (Frisancho/NHANES)
    ['cbraquial', 'ptricipital', 'edad', 'sexo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateAnthropometry);
    });
}

function calcChumleaWeight() {
    const atr = parseFloat(document.getElementById('altrodilla')?.value) || 0;
    const age = parseFloat(document.getElementById('edad')?.value) || 0;
    const sex = document.getElementById('sexo')?.value;

    const resBox = document.getElementById('estContainerStacked');
    const badgeW = document.getElementById('valChumleaWeight');
    const badgeS = document.getElementById('valRossStature');
    const badgeWDisplay = document.getElementById('valChumleaWeightBadge');
    const badgeSDisplay = document.getElementById('valRossStatureBadge');

    if (atr > 0) {
        if (resBox) resBox.style.display = 'flex';

        // 1. Ross Stature Formula
        let stature = 0;
        if (sex === 'f') {
            stature = (1.83 * atr) + (84.8 - (0.24 * age));
        } else {
            stature = (2.02 * atr) + (64.19 - (0.04 * age));
        }

        // 2. Chumlea Weight Formula
        let weight = 0;
        const cb = parseFloat(document.getElementById('cbraquial')?.value) || 30; // Default Muac
        if (sex === 'f') {
            weight = (1.27 * atr) + (0.87 * cb) + (0.41 * 35) + (0.11 * 15) - 43.1;
        } else {
            weight = (0.98 * atr) + (1.16 * cb) + (0.37 * 35) + (1.16 * 15) - 35.8;
        }

        // Update UI Badges
        if (badgeSDisplay) badgeSDisplay.innerText = `Talla Ross: ${stature.toFixed(1)} cm`;
        if (badgeWDisplay) badgeWDisplay.innerText = `Peso Chumlea: ${weight.toFixed(1)} kg`;

        // Update hidden inputs for persistence/IA
        if (badgeW) badgeW.value = weight.toFixed(1) + ' kg';
        if (badgeS) badgeS.value = stature.toFixed(1) + ' cm';

    } else {
        if (resBox) resBox.style.display = 'none';
    }
}

/**
 * NEW V3.41: Advanced Anthropometry Classification (Frisancho & NHANES)
 * Uses Red-themed UI, Percentile Logic, and Area G (AMA) calculation.
 */
function updateAnthropometry() {
    const cb = parseFloat(document.getElementById('cbraquial')?.value) || 0;
    const pt = parseFloat(document.getElementById('ptricipital')?.value) || 0;
    const age = parseFloat(document.getElementById('edad')?.value) || 0;
    const sex = document.getElementById('sexo')?.value;

    const resBox = document.getElementById('frisanchoContainer');
    const lblCB = document.getElementById('lblCBStatus');
    const lblAG = document.getElementById('lblAGStatus');
    const indicator = document.getElementById('anthIndicator');
    const badgeDate = document.getElementById('valAnthDate');
    if (cb > 0 || pt > 0) {
        if (resBox) resBox.style.display = 'block';

        // 1. Calculate Area G (AMA - Arm Muscle Area)
        let ama = 0;
        if (cb > 0 && pt > 0) {
            const ptcm = pt / 10;
            const pi = 3.14159265;
            ama = Math.pow(cb - (pi * ptcm), 2) / (4 * pi);
            // Heymsfield correction for bone area
            if (sex === 'm') ama -= 10; else ama -= 6.5;
            if (ama < 0) ama = 0;
        }

        // 2. Reference Tables (Frisancho / NHANES Representative)
        const refs = {
            cb: {
                m: {
                    18: { p5: 27.2, p10: 28.2, p50: 32.7, p90: 37.7, p95: 39.5 },
                    35: { p5: 29.2, p10: 30.4, p50: 34.7, p90: 39.6, p95: 41.1 },
                    65: { p5: 27.0, p10: 28.5, p50: 32.7, p90: 37.5, p95: 39.0 },
                    75: { p5: 25.5, p10: 27.0, p50: 30.7, p90: 35.5, p95: 37.0 }
                },
                f: {
                    18: { p5: 23.5, p10: 24.5, p50: 28.5, p90: 33.5, p95: 35.5 },
                    35: { p5: 25.4, p10: 26.8, p50: 32.1, p90: 38.8, p95: 41.7 },
                    65: { p5: 24.5, p10: 26.0, p50: 31.7, p90: 38.5, p95: 41.0 },
                    75: { p5: 22.5, p10: 24.0, p50: 28.6, p90: 34.5, p95: 36.5 }
                }
            },
            ag: {
                m: {
                    18: { p5: 41.5, p10: 45.4, p50: 59.9, p90: 77.8, p95: 83.2 },
                    35: { p5: 44.5, p10: 48.9, p50: 64.1, p90: 83.5, p95: 90.0 },
                    65: { p5: 38.0, p10: 42.1, p50: 56.5, p90: 75.0, p95: 80.0 },
                    75: { p5: 32.0, p10: 36.0, p50: 48.0, p90: 65.0, p95: 70.0 }
                },
                f: {
                    18: { p5: 29.4, p10: 32.0, p50: 39.5, p90: 51.0, p95: 55.4 },
                    35: { p5: 31.0, p10: 34.5, p50: 44.2, p90: 60.5, p95: 65.5 },
                    65: { p5: 28.0, p10: 31.5, p50: 42.0, p90: 58.0, p95: 63.5 },
                    75: { p5: 24.0, p10: 27.5, p50: 36.5, p90: 52.0, p95: 57.0 }
                }
            }
        };

        const getPercentileMatch = (type, val) => {
            if (val <= 0) return { status: '--', color: '#888', pos: 50 };
            const sexRefs = refs[type][sex === 'f' ? 'f' : 'm'];
            const keys = Object.keys(sexRefs).map(Number).sort((a, b) => b - a);
            const refKey = keys.find(k => age >= k) || keys[keys.length - 1];
            const p = sexRefs[refKey];

            if (val < p.p5) return { status: 'Muy Disminuido', color: '#c0392b', pos: 2.5 };
            if (val < p.p10) return { status: 'Disminuido', color: '#e67e22', pos: 7.5 };
            if (val < p.p90) return { status: 'Normal', color: '#27ae60', pos: 50 };
            if (val <= p.p95) return { status: 'Elevado', color: '#3498db', pos: 92.5 };
            return { status: 'Muy Elevado', color: '#9b59b6', pos: 97.5 };
        };

        const resCB = getPercentileMatch('cb', cb);
        const resAG = getPercentileMatch('ag', ama);

        if (lblCB) lblCB.innerHTML = `<span style="color:${resCB.color}; font-size:1rem;">${resCB.status}</span><br><small style="color:#888; font-weight:400;">CB: ${cb} cm</small>`;
        if (lblAG && ama > 0) lblAG.innerHTML = `<span style="color:${resAG.color}; font-size:1rem;">${resAG.status}</span><br><small style="color:#888; font-weight:400;">AG: ${ama.toFixed(1)} cmÂ²</small>`;
        else if (lblAG) lblAG.innerHTML = "--";

        // 3. Update Graphical Indicator
        if (indicator) {
            let pos = resCB.pos;
            if (ama > 0) pos = (resCB.pos + resAG.pos) / 2;
            indicator.style.left = pos + '%';
        }

        // 4. Update Timestamp
        if (badgeDate) {
            const now = new Date();
            badgeDate.innerText = `Act: ${now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`;
        }
    } else {
        if (resBox) resBox.style.display = 'none';
    }
}

// --- 16. TAB NAVIGATION (NEW V3.7) ---
function initTabNavigation() {
    const tabs = document.querySelectorAll('.app-tabs .tab-btn');
    const views = document.querySelectorAll('.view-section');

    window.switchAppView = (targetView) => {
        // UI Update: Tabs (only affects app-tabs, not the header button)
        tabs.forEach(t => {
            t.classList.remove('active');
            if (t.dataset.view === targetView) {
                t.classList.add('active');
            }
        });

        // UI Update: Views
        views.forEach(v => {
            v.classList.remove('active-view');
            v.style.display = 'none';
        });

        const activeView = document.getElementById(`view-${targetView}`);
        if (activeView) {
            activeView.style.display = 'block';
            void activeView.offsetWidth; // Trigger reflow
            activeView.classList.add('active-view');
        }

        // Action Triggers based on Tab
        if (targetView === 'ward') {
            loadWardKanban();
        }
    };

    // Bind original tabs
    tabs.forEach(tab => {
        tab.onclick = () => window.switchAppView(tab.dataset.view);
    });

    // Bind new Header Ward button
    const btnWardHeader = document.getElementById('btnOpenWard');
    if (btnWardHeader) {
        btnWardHeader.onclick = () => window.switchAppView('ward');
    }
}

function showToast(msg) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('toast-show');
    setTimeout(() => { toast.classList.remove('toast-show'); }, 3000);
}
// --- 17. GLOBAL EVENTS & MISC (CLEANUP V3.16.2) ---
function initGlobalEvents() {
    // TMB Logic
    const btnTMB = document.getElementById('btnCalcTMB');
    if (btnTMB) btnTMB.onclick = calcTMB_OMS;

    // Factorial Logic
    const inpFactor = document.getElementById('factorKcal');
    if (inpFactor) inpFactor.oninput = calcFactorial;

    // Edema/Dry Weight Logic
    const selEdema = document.getElementById('edemaGrade');
    if (selEdema) selEdema.onchange = window.updateDryWeight;
    const selAscites = document.getElementById('ascitesGrade');
    if (selAscites) selAscites.onchange = window.updateDryWeight;

    // Exams Logic
    const btnAddExam = document.getElementById('btnAddExam');
    if (btnAddExam) {
        btnAddExam.onclick = (e) => {
            e.preventDefault();
            addExamRow();
        };
    }

    // Nitrogen Logic
    const inpNUU = document.getElementById('valNUU');
    const inpNFactor = document.getElementById('valNFactor');
    const fnBN = () => calcNitrogenBalance();
    if (inpNUU) inpNUU.oninput = fnBN;
    if (inpNFactor) inpNFactor.oninput = fnBN;

    // New Patient Logic V3.51/V3.6
    const btnNew = document.getElementById('btnAddPatient');
    if (btnNew) btnNew.onclick = resetPatientForm;

    // Drug Interaction Search Logic V3.50
    const inpDrug = document.getElementById('drugSearch');
    const outDrug = document.getElementById('drugInteractionResult');
    if (inpDrug && outDrug) {
        inpDrug.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 3) {
                outDrug.innerHTML = '<span style="opacity:0.5;">Busca un medicamento para ver recomendaciones...</span>';
                return;
            }
            const drugKey = Object.keys(DRUG_INTERACTIONS).find(k => k.includes(query));
            if (drugKey) {
                outDrug.innerHTML = `<div style="padding:10px; background:rgba(231, 76, 60, 0.1); border-radius:10px; border-left:4px solid #e74c3c;">
                    <strong>${drugKey.toUpperCase()}:</strong><br>${DRUG_INTERACTIONS[drugKey]}
                </div>`;
            } else {
                outDrug.innerHTML = '<span style="color:#888;">No se encontró el fármaco. Intenta con una palabra clave.</span>';
            }
        };
    }

    // Clinical Note Generator V3.50 (Updated to ADIME V4.14)
    const btnNote = document.getElementById('btnGenerateNote');
    if (btnNote) btnNote.onclick = function () {
        const container = document.getElementById('clinicalNoteContainer');
        const content = document.getElementById('noteContent');
        if (!container || !content) return;

        const p = AppState.patient;

        const fId = document.getElementById('formulaSelect')?.value;
        const formula = AppState.formulas ? AppState.formulas.find(f => f.id === fId) : null;
        const vol = window.getEffectiveSimulationVolume();
        const goal = parseFloat(document.getElementById('goalTotal')?.value) || 0;

        let pTotal = parseFloat(document.getElementById('goalProt')?.dataset.val) || 0;
        let cTotal = parseFloat(document.getElementById('goalCHO')?.dataset.val) || 0;
        let lTotal = parseFloat(document.getElementById('goalLip')?.dataset.val) || 0;

        let modulesText = "";
        const mods = ["Nessucar", "MCT", "Enterex", "Banatrol", "Proteinex", "Fresubin"];
        mods.forEach(m => {
            const val = parseFloat(document.getElementById('mod' + m)?.value) || 0;
            if (val > 0) modulesText += `${m}: ${val} ${m === "MCT" ? "ml" : "g"}, `;
        });

        const examenes = document.getElementById('evoExamenes')?.value || "Sin reportar";
        const tolerancia = document.getElementById('evoTolerancia')?.value || "Adecuada";
        const des = document.getElementById('diagnosticoPES')?.value || "Sin diagnóstico ingresado";

        const pesoFisico = p.peso || 0;
        const pesoCalc = document.getElementById('pesoCalculoSelect')?.value === 'real' ? pesoFisico : (p.peso_calculo || pesoFisico);

        const cm = (document.getElementById('tallaCM')?.value || (p.estatura * 100)) || 0;
        const sctVal = document.getElementById('valSCT')?.innerText || '-- mÂ²';

        const isBotellin = formula && formula.isBotellin;
        const rawVol = parseFloat(document.getElementById('volume')?.value) || 0;
        const mode = AppState.patient.type || 'adult';
        let volText = "";
        if (mode === 'pediatric' || mode === 'neonate') {
            const tInp = document.getElementById('volumeTimes');
            const times = tInp ? parseInt(tInp.value) || 1 : 1;
            if (times > 1) {
                volText = `${rawVol} ml x ${times} veces (${rawVol * times} ml totales)`;
            } else {
                volText = `${rawVol} ml`;
            }
        } else {
            volText = isBotellin ? `${vol} Unidad(es) (${vol * formula.volUnit} ml totales)` : `${vol} ml`;
        }

        // Build ADIME Text
        const adimeText = `A - ANTROPOMETRÍA Y REQUERIMIENTOS:
- Peso Real: ${pesoFisico} kg | Talla: ${cm} cm
- Peso de Cálculo: ${pesoCalc.toFixed(1)} kg | Superficie Corp: ${sctVal}
- Meta Energética: ${Math.round(goal)} kcal/día (${pesoCalc > 0 ? (goal / pesoCalc).toFixed(1) : 0} kcal/kg)
- Meta Proteínas: ${Math.round(pTotal)} g/día (${pesoCalc > 0 ? (pTotal / pesoCalc).toFixed(1) : 0} g/kg)
- Meta CHOs: ${Math.round(cTotal)} g/día | Líp: ${Math.round(lTotal)} g/día

B - BIOQUÍMICA Y CLÍNICA (TOLERANCIA):
- Exámenes Clave: ${examenes}
- Tolerancia Subjetiva: ${tolerancia}

D - DIAGNÃ“STICO NUTRICIONAL INTEGRADO:
- ${des}

I - INTERVENCIÃ“N Y PRESCRIPCIÃ“N:
- Fórmula Indicada: ${formula ? formula.name : 'N/A'}
- Volumen Prescrito: ${volText}
${modulesText ? `- Módulos Añadidos: ${modulesText.slice(0, -2)}` : ''}`;

        content.innerText = adimeText;
        const titleH4 = document.querySelector('#clinicalNoteContainer h4');
        if (titleH4) titleH4.innerText = "Vista Previa de Evolución (ADIME)";
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    };

    // VGO Generator
    const btnVGO = document.getElementById('btnGenerateVGO');
    if (btnVGO) btnVGO.onclick = function () {
        const container = document.getElementById('clinicalNoteContainer');
        const content = document.getElementById('noteContent');
        if (!container || !content) return;

        const p = AppState.patient;
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });

        let ageStr = '--';
        if (p.ageParts) {
            ageStr = `${p.ageParts.y} años ${p.ageParts.m} meses`;
        }

        const sexStr = p.sexo === 'm' ? 'Masculino' : (p.sexo === 'f' ? 'Femenino' : 'No especificado');

        const pesoFisico = p.peso || 0;
        const cm = (document.getElementById('tallaCM')?.value || (p.estatura * 100)) || 0;
        const tallaMt = (cm / 100).toFixed(3);
        const cCintura = document.getElementById('cCintura')?.value || '--';
        const cBraquialVal = document.getElementById('cbraquial')?.value || '[Completar]';

        const imcVal = document.getElementById('valIMC')?.innerText || '--';
        const zImcVal = document.getElementById('valZBMI')?.innerText || '--';
        const zTallaVal = document.getElementById('valZHFA')?.innerText || '--';

        const des = document.getElementById('diagnosticoPES')?.value || "Sin diagnóstico ingresado";

        const goal = parseFloat(document.getElementById('goalTotal')?.value) || 0;
        const pTotal = parseFloat(document.getElementById('goalProt')?.dataset.val) || 0;
        const cTotal = parseFloat(document.getElementById('goalCHO')?.dataset.val) || 0;
        const lTotal = parseFloat(document.getElementById('goalLip')?.dataset.val) || 0;

        const pPct = goal > 0 ? ((pTotal * 4) / goal * 100).toFixed(0) : 0;
        const cPct = goal > 0 ? ((cTotal * 4) / goal * 100).toFixed(0) : 0;
        const lPct = goal > 0 ? ((lTotal * 9) / goal * 100).toFixed(0) : 0;

        const userName = AppState.user?.user_metadata?.full_name || "[Nombre del Profesional]";

        // Obtener fecha de nacimiento en formato chileno DD/MM/YYYY
        let fNacStr = "[Completar]";
        const fnVal = document.getElementById('fechaNacimiento')?.value;
        if (fnVal) {
            const [y, mm, d] = fnVal.split('-');
            fNacStr = `${d}/${mm}/${y}`;
        }

        // Obtener valores de la Anamnesis y STRONGkids / NRS 2002
        const anam = p.anamnesis || {};
        const sk = p.strongkids || { score: 0, classification: 'Riesgo bajo' };
        const nrs = p.nrs2002 || { score: 0, classification: 'Sin riesgo nutricional' };

        const nauseasVal = anam.sintomaNauseas || 'No';
        const vomitosVal = anam.sintomaVomitos || 'No';
        const reflujoVal = anam.sintomaReflujo || 'No';
        const deposicionesVal = anam.sintomaDeposiciones || 'No';
        const distensionVal = anam.sintomaDistension || 'No';
        const gasesVal = anam.sintomaGases || 'No';

        const dentaduraVal = anam.anamnesisDentadura || 'Sí';
        const alergiasVal = anam.anamnesisAlergias || 'No';
        const deglucionVal = anam.anamnesisDeglucion || 'No';
        const apetitoVal = anam.anamnesisApetito || 'Sí';

        const vgoText = `VALORACION GLOBAL OBJETIVA POR NUTRICIONISTA

o Fecha de evaluación: ${dateStr}

Fecha de nacimiento: ${fNacStr}
Edad: ${ageStr}
Sexo: ${sexStr}

Diagnóstico:
o 1. [Completar diagnóstico médico]

Antropometría: (Evaluación en bipedestación por nutricionista del servicio)
o Peso ciego: ${pesoFisico} kg
o Talla: ${tallaMt} mt
o C. braquial: ${cBraquialVal} cm
o C. cintura: ${cCintura} cm

Indicadores nutricionales: (WHO Antrho)
o IMC: ${imcVal} kg/m2
o Zscore IMC/E: ${zImcVal} DE
o Zscore T/E: ${zTallaVal} DE
o C. Cintura /E: [Completar si aplica]

Anamnesis:
o Síntomas gastrointestinales: Nauseas (${nauseasVal}) Vómitos (${vomitosVal}) Reflujo gastroesofágico (${reflujoVal}) Deposiciones (${deposicionesVal}) Distensión abdominal (${distensionVal}) Gases (${gasesVal}).
o Anamnesis alimentaria: Dentadura (${dentaduraVal}) Alergias/intolerancias alimentarias (${alergiasVal}) Trastorno de deglución (${deglucionVal}) Apetito (${apetitoVal}).

Tamizaje: ${p.type === 'adult' ? '(NRS 2002)' : '(STRONG KIDS)'}
o Puntaje: ${p.type === 'adult' ? nrs.score : sk.score} pts
o Interpretación: ${p.type === 'adult' ? nrs.classification.toUpperCase() : sk.classification.toUpperCase()}

Diagnóstico Nutricional Integrado:
o ${des}

Requerimientos nutricionales:
o Calorías: ${Math.round(goal)} kcal
o Proteínas: ${pTotal.toFixed(1)} gr -> VCT ${pPct} %
o Carbohidratos: ${cTotal.toFixed(1)} gr -> VCT ${cPct} %
o Lípidos: ${lTotal.toFixed(1)} gr -> VCT ${lPct} %

Dietoterapia actual: [Completar]

Observaciones/Plan/Sugerencias:
o [Completar]

${userName}
Nutricionista clínica pediatría - psiquiatría infantojuvenil
Unidad de nutrición y alimentación
Hospital Regional de Antofagasta`;

        content.innerText = vgoText;
        const titleH4 = document.querySelector('#clinicalNoteContainer h4');
        if (titleH4) titleH4.innerText = "Vista Previa de Evolución (VGO)";
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    };

    // Copy Button
    const btnCopy = document.getElementById('btnCopyNote');
    if (btnCopy) btnCopy.onclick = () => {
        const text = document.getElementById('noteContent').innerText;
        navigator.clipboard.writeText(text).then(() => alert("Evolución Clínica (ADIME) copiada al portapapeles."));
    };

    // Module Input Watcher
    document.querySelectorAll('.input-module').forEach(inp => {
        inp.oninput = () => {
            if (typeof window.runSimulation === 'function') window.runSimulation();
        };
    });

}


// Global helper for Factorial
function calcFactorial() {
    const inpFactor = document.getElementById('factorKcal');
    if (!inpFactor) return;

    const f = parseFloat(inpFactor.value) || 0;
    const pObj = AppState.patient || {};
    const inputPeso = document.getElementById('peso');
    const ptWeight = parseFloat(inputPeso ? inputPeso.value : 0) || pObj.peso_calculo || pObj.peso || 0;
    const res = Math.round(f * ptWeight);

    const resBadge = document.getElementById('resFactorial');
    if (resBadge) resBadge.innerText = `${res} kcal`;
}

function calcTMB_OMS() {
    const p = AppState.patient;
    const method = document.getElementById('tmbMethod').value;
    const sexo = document.getElementById('sexo').value;
    const age = p.edad || parseFloat(document.getElementById('edad').value) || 0;
    const inputPeso = document.getElementById('peso');
    const weight = parseFloat(inputPeso ? inputPeso.value : 0) || p.peso_calculo || p.peso || 0;
    const height = p.estatura || parseFloat(document.getElementById('estatura').value) || 0;

    if (age <= 0 || weight <= 0) return;

    let tmb = 0;
    let overrideGET = false;

    // Phase 10: Poblaciones Especiales overrides
    const specCond = document.getElementById('specialCondition')?.value || 'none';
    const isPediatric = (p.type === 'pediatric' || document.getElementById('ptPediatric')?.checked);

    if (isPediatric && specCond.startsWith('cp_')) {
        let factor = 10; // GMFCS V
        if (specCond === 'cp_i_ii') factor = 14.0;
        else if (specCond === 'cp_iii_iv') factor = 11.1;

        const cm = height > 3 ? height : height * 100;
        tmb = factor * cm;

        p.tmb = tmb;
        const resBadge = document.getElementById('resTMB');
        if (resBadge) {
            resBadge.innerText = `${Math.round(tmb)} kcal (PC: ${factor} kcal/cm)`;
            resBadge.style.background = '#8e44ad';
            resBadge.style.color = '#fff';
        }

        // This is total GET, so update GET explicitly
        const getVal = document.getElementById('valGET');
        if (getVal) getVal.innerHTML = `${Math.round(tmb)} kcal <span style="font-size:0.6rem;">(Krick)</span>`;
        return;
    } else {
        const resBadge = document.getElementById('resTMB');
        if (resBadge) {
            resBadge.style.background = '#e3f2fd';
            resBadge.style.color = '#1565c0';
        }
    }

    if (method === 'oms') {
        if (sexo === 'm') {
            if (age < 3) tmb = 60.9 * weight - 54;
            else if (age < 10) tmb = 22.7 * weight + 495;
            else if (age < 18) tmb = 17.5 * weight + 651;
            else if (age < 30) tmb = 15.3 * weight + 679;
            else if (age < 60) tmb = 11.6 * weight + 879;
            else tmb = 13.5 * weight + 487;
        } else {
            if (age < 3) tmb = 61.0 * weight - 51;
            else if (age < 10) tmb = 22.5 * weight + 499;
            else if (age < 18) tmb = 12.2 * weight + 746;
            else if (age < 30) tmb = 14.7 * weight + 496;
            else if (age < 60) tmb = 8.7 * weight + 829;
            else tmb = 10.5 * weight + 596;
        }
    } else if (method === 'hb') {
        // Harris-Benedict (Original 1919 Clásica)
        const heightCm = height > 3 ? height : height * 100;
        if (sexo === 'm') {
            tmb = 66.47 + (13.75 * weight) + (5.0 * heightCm) - (6.75 * age);
        } else {
            tmb = 655.09 + (9.56 * weight) + (1.84 * heightCm) - (4.67 * age);
        }
    } else if (method === 'schofield') {
        if (sexo === 'm') {
            if (age < 3) tmb = 59.512 * weight - 30.4;
            else if (age < 10) tmb = 22.706 * weight + 504.3;
            else if (age < 18) tmb = 17.686 * weight + 658.2;
            else if (age < 30) tmb = 15.057 * weight + 692.2;
            else if (age < 60) tmb = 11.472 * weight + 873.1;
            else tmb = 11.711 * weight + 587.7;
        } else {
            if (age < 3) tmb = 58.317 * weight - 31.1;
            else if (age < 10) tmb = 20.315 * weight + 485.9;
            else if (age < 18) tmb = 13.384 * weight + 692.6;
            else if (age < 30) tmb = 14.818 * weight + 486.6;
            else if (age < 60) tmb = 8.126 * weight + 845.6;
            else tmb = 9.082 * weight + 658.5;
        }
    } else if (method === 'valencia') {
        // Valencia (América Latina)
        if (sexo === 'm') {
            if (age < 30) tmb = (13.37 * weight) + 747;
            else if (age < 60) tmb = (11.02 * weight) + 679;
            else tmb = (10.92 * weight) + 510;
        } else {
            if (age < 30) tmb = (11.02 * weight) + 679;
            else if (age < 60) tmb = (10.92 * weight) + 510;
            else tmb = (10.98 * weight) + 520;
        }
    } else if (method === 'rozashizgal') {
        // Roza y Shizgal (Harris-Benedict Revisada 1984)
        if (sexo === 'm') {
            tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
    } else if (method === 'owen') {
        // Owen (1986)
        if (sexo === 'm') {
            tmb = 879 + (10.2 * weight);
        } else {
            tmb = 795 + (7.18 * weight);
        }

    } else if (method === 'msj') {
        // Mifflin-St Jeor
        if (sexo === 'm') {
            tmb = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            tmb = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
    }

    const tmbRes = Math.round(tmb);
    document.getElementById('resTMB').innerText = `${tmbRes} kcal`;

    // Calculate GET
    const activity = parseFloat(document.getElementById('actividad')?.value) || 1.2;
    const get = Math.round(tmbRes * activity);
    document.getElementById('valGET').innerText = `${get} kcal`;
}

function calcDryWeight() {
    if (typeof window.updateDryWeight === 'function') {
        window.updateDryWeight();
    }
}

// --- 18. BIOCHEMICAL EXAMS HELPERS ---
function addExamRow() {
    const container = document.getElementById('examsContainer');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'exam-row';
    row.innerHTML = `
        <input type="date">
        <input type="text" placeholder="Examen (Ej: Albúmina)">
        <input type="text" placeholder="Resultado">
        <button class="btn-row-del" onclick="this.parentElement.remove()" title="Eliminar examen">ðŸ—‘ï¸</button>
    `;
    container.appendChild(row);
}

function calcNitrogenBalance() {
    const nuu = parseFloat(document.getElementById('valNUU').value);
    const protIngested = parseFloat(document.getElementById('valProt').innerText); // From simulator
    const factor = parseFloat(document.getElementById('valNFactor').value) || 4;

    const resDiv = document.getElementById('bnResult');

    if (!nuu || !protIngested) {
        resDiv.innerText = "Faltan datos (NUU o Prot)";
        resDiv.style.color = "#666";
        return;
    }

    const bn = (protIngested / 6.25) - (nuu + factor);
    const txt = bn > 0 ? "Anabolismo" : "Catabolismo";
    const color = bn > 0 ? "#22c55e" : "#ef4444";

    resDiv.innerHTML = `BN: <strong>${bn.toFixed(1)} g</strong> (<span style="color:${color}">${txt}</span>)`;
}

// Simple Frisancho Classification (Mock for demo - ideally needs full JSON)
// We listen to input changes for color coding
document.querySelectorAll('.input-watch').forEach(imp => {
    imp.addEventListener('input', (e) => {
        // Logic would go here. For now validation only.
        // We will simple color badge based on arbitrary ranges for demo, 
        // asking user to implement full table if strictly needed later.
    });
});

// --- NUTRI IA (ðŸ¦¦ V3.23) ---
const GEMINI_API_KEY = typeof window_GEMINI_API_KEY !== 'undefined' ? window_GEMINI_API_KEY : '';

function initNutriIA() {
    const btnGenerate = document.getElementById('btnGenerateIA');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateNutriIAAnalysis);
    }

    // Tab integration for visibility
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.view === 'nutri-ia') {
                const resultBox = document.getElementById('iaResultContainer');
                const welcomeBox = document.getElementById('iaInitialState');
                if (resultBox && resultBox.style.display === 'none' && welcomeBox) {
                    welcomeBox.style.display = 'block';
                }
            }
        });
    });
}

async function generateNutriIAAnalysis() {
    const btn = document.getElementById('btnGenerateIA');
    const label = document.getElementById('iaBtnLabel');
    const spinner = document.getElementById('iaSpinner');
    const resultBox = document.getElementById('iaResultContainer');
    const welcomeBox = document.getElementById('iaInitialState');

    if (!btn || !resultBox) return;

    btn.disabled = true;
    if (label) label.style.display = 'none';
    if (spinner) spinner.style.display = 'block';

    try {
        const prompt = constructNutriIAPrompt();
        const response = await callGeminiAPI(prompt);

        if (welcomeBox) welcomeBox.style.display = 'none';
        resultBox.style.display = 'block';
        resultBox.innerHTML = formatIAResponse(response);

        // PERSISTENCE V3.27: Save to Supabase if patient is loaded
        if (AppState.patient.id) {
            await supabaseClient.from('pacientes')
                .update({ ia_report: response })
                .eq('id', AppState.patient.id);
            AppState.patient.ia_report = response;
            console.log("IA Report persisted for patient:", AppState.patient.id);
        }

    } catch (err) {
        console.error("ðŸ”´ Error Nutri IA Detallado:", err);
        // Show more specific message if it's a known error type
        let userMsg = "Error al conectar con la Nutri IA. Verifica tu conexión.";
        if (err.message && err.message.includes("403")) userMsg = "Error 403: Acceso denegado a la IA (API Key inválida).";
        if (err.message && err.message.includes("429")) userMsg = "Error 429: Se ha superado el límite de uso de la IA.";

        alert(userMsg);
    } finally {
        btn.disabled = false;
        if (label) label.style.display = 'block';
        if (spinner) spinner.style.display = 'none';
    }
}

function constructNutriIAPrompt() {
    const p = AppState.patient;
    const context = {
        antropometria: {
            peso: p.peso, talla: p.estatura, bmi: p.bmi,
            pesoIdeal: document.getElementById('valIdealWeight')?.innerText,
            ipt: document.getElementById('valIPT')?.innerText,
            diagnosticoIPT: document.getElementById('valIPTClass')?.innerText,
            cintura: document.getElementById('ccintura')?.value,
            braquial: document.getElementById('cbraquial')?.value,
            chumlea: document.getElementById('valChumleaWeight')?.value,
            ross: document.getElementById('valRossStature')?.value
        },
        bioquimica: Array.from(document.querySelectorAll('#examsContainer .exam-row')).map(row => {
            const inputs = row.querySelectorAll('input');
            return { fecha: inputs[0]?.value, examen: inputs[1]?.value, valor: inputs[2]?.value };
        }).filter(e => e.examen),
        riesgo: {
            nrs2002: document.getElementById('nrs2002')?.value,
            vgs: document.getElementById('vgs')?.value
        },
        tolerancia: {
            residuo: document.getElementById('residuo')?.value,
            diarrea: document.getElementById('diarrea')?.value,
            distension: document.getElementById('distension')?.value
        },
        accesos: { tipo: document.getElementById('accesoTipo')?.value, fecha: document.getElementById('accesoFecha')?.value },
        diagnosticoIntegrado: document.getElementById('diagnosticoPES')?.value,
        metas: { kcalKg: document.getElementById('goalKcalBox')?.value, kcalTotal: document.getElementById('goalTotal')?.value }
    };

    return `Actúa como un Nutricionista Clínico experto del Hospital Regional de Antofagasta (HRA), Chile.
Genera un informe clínico profesional fundamentado en estos datos:
- Paciente: ${p.nombre || 'N/A'}, ${p.edad} años, ${p.sexo === 'm' ? 'M' : 'F'}.
- Antropometría: IMC ${context.antropometria.bmi}, Peso Ideal ${context.antropometria.pesoIdeal}, IPT ${context.antropometria.ipt} (${context.antropometria.diagnosticoIPT}).
- Cribado: NRS-2002: ${context.riesgo.nrs2002}, VGS: ${context.riesgo.vgs}.
- Laboratorio: ${JSON.stringify(context.bioquimica)}.
- Tolerancia GI: Residuo ${context.tolerancia.residuo}, Diarrea ${context.tolerancia.diarrea}, Distensión ${context.tolerancia.distension}.
- Diagnóstico PES: ${context.diagnosticoIntegrado}.
- Meta actual: ${context.metas.kcalTotal} kcal/día (${context.metas.kcalKg} kcal/kg).

INFORME REQUERIDO:
1. Resumen de Hallazgos Clínicos.
2. Análisis de Bioquímica y Tolerancia.
3. Plan Nutricional Sugerido (Energía, Prot, Fórmulas).
4. Recomendaciones según protocolos HRA Antofagasta.

Tono profesional y estructurado. Usa HTML (h3, p, ul, li).`;
}

async function callGeminiAPI(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`API Error ${res.status}: ${errorData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error al generar análisis.";
}

function formatIAResponse(text) {
    let formatted = text.replace(/```html/g, '').replace(/```/g, '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    return `<div class="ia-report-content">${formatted}</div>
            <div style="margin-top:20px; border-top:1px dashed #ccc; padding-top:10px; font-size:0.7rem; color:#666;">
                <i>*Sugerencia clínica IA - Validar con profesional HRA.</i>
            </div>`;
}

// --- 18. VOICE DICTATION (NEW V3.60) ---
function initVoiceDictation() {
    const btnMic = document.getElementById('btnMicPES');
    const txtPES = document.getElementById('diagnosticoPES');
    const micStatus = document.getElementById('micStatus');

    if (!btnMic || !txtPES) return;

    // Check compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btnMic.style.display = 'none'; // Hide if browser doesn't support
        console.warn("Speech API not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CL'; // Chilean Spanish
    recognition.interimResults = true; // Show words as they are spoken
    recognition.continuous = false; // Stop when the user stops talking

    let isRecording = false;

    // Toggle logic
    btnMic.onclick = () => {
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    recognition.onstart = () => {
        isRecording = true;
        if (micStatus) micStatus.innerText = "Escuchando...";
        btnMic.style.background = 'rgba(231, 76, 60, 0.1)';
        btnMic.style.color = '#e74c3c';
        btnMic.style.borderColor = '#e74c3c';
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript !== '') {
            const currentText = txtPES.value.trim();
            txtPES.value = currentText ? currentText + ' ' + finalTranscript : finalTranscript;
        }
    };

    // If there is no input after starting
    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
            alert("Acceso al micrófono denegado. Por favor dale permiso al navegador.");
        }
        recognition.stop();
    };

    recognition.onend = () => {
        isRecording = false;
        if (micStatus) micStatus.innerText = "Dictar";
        btnMic.style.background = 'transparent';
        btnMic.style.color = 'var(--primary)';
        btnMic.style.borderColor = 'var(--primary)';
    };
}

// --- 19. MACRONUTRIENT GOALS (NEW V3.63) ---

function initGoalMacroChart() {
    const ctx = document.getElementById('goalMacroChart')?.getContext('2d');
    if (!ctx) return;

    goalChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Proteínas', 'Carbohidratos', 'Lípidos'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#e74c3c', '#f1c40f', '#3498db'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${Math.round(ctx.raw)} kcal`
                    }
                }
            }
        }
    });

    const inputs = ['goalProtKg', 'goalCHOKg', 'goalLipKg', 'peso', 'goalTotal'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateMacroGoals);
    });

    // Toggle Modes
    const btnGkg = document.getElementById('btnModeGkg');
    const btnPct = document.getElementById('btnModePct');
    if (btnGkg && btnPct) {
        btnGkg.onclick = () => {
            macroGoalMode = 'gkg';
            btnGkg.classList.add('active');
            btnPct.classList.remove('active');
            document.getElementById('lblProtGoal').innerText = "Prot (g/kg)";
            document.getElementById('lblCHOGoal').innerText = "CHO (g/kg)";
            document.getElementById('lblLipGoal').innerText = "Líp (g/kg)";

            // Update placeholders for g/kg
            document.getElementById('goalProtKg').placeholder = "Ej. 1.5";
            document.getElementById('goalCHOKg').placeholder = "Ej. 5.0";
            document.getElementById('goalLipKg').placeholder = "Ej. 2.0";

            document.getElementById('macroPctProt').style.display = 'block';
            document.getElementById('macroPctCHO').style.display = 'block';
            document.getElementById('macroPctLip').style.display = 'block';
            document.getElementById('pctTotalWarning').style.display = 'flex';

            updateMacroGoals();
        };
        btnPct.onclick = () => {
            macroGoalMode = 'pct';
            btnPct.classList.add('active');
            btnGkg.classList.remove('active');
            document.getElementById('lblProtGoal').innerText = "Prot (%)";
            document.getElementById('lblCHOGoal').innerText = "CHO (%)";
            document.getElementById('lblLipGoal').innerText = "Líp (%)";

            // Update placeholders for pct
            document.getElementById('goalProtKg').placeholder = "Ej. 15%";
            document.getElementById('goalCHOKg').placeholder = "Ej. 55%";
            document.getElementById('goalLipKg').placeholder = "Ej. 30%";

            document.getElementById('macroPctProt').style.display = 'block';
            document.getElementById('macroPctCHO').style.display = 'block';
            document.getElementById('macroPctLip').style.display = 'block';
            document.getElementById('pctTotalWarning').style.display = 'flex';

            updateMacroGoals();
        };
    }

    // GET Selector Logic
    // GET Selector Logic: Keep only Manual and Evol.
    const getSelector = document.getElementById('getSelector');
    // The getSelector is now a hidden field or simplified, but we keep the logic for factorial
    const updateFinalMeta = () => {
        const boxVal = document.getElementById('goalKcalBox')?.value || 0;
        const p = AppState.patient || {};
        const inputPeso = document.getElementById('peso');
        const peso = parseFloat(inputPeso ? inputPeso.value : 0) || p.peso_calculo || p.peso || 0;

        const goalTotalEl = document.getElementById('goalTotal');
        if (goalTotalEl && boxVal > 0) {
            goalTotalEl.value = Math.round(parseFloat(boxVal) * peso);
            goalTotalEl.dispatchEvent(new Event('input'));
        }
    };

    document.getElementById('goalKcalBox')?.addEventListener('input', updateFinalMeta);
    document.getElementById('peso')?.addEventListener('input', () => {
        updateFinalMeta();
        if (typeof calcTMB_OMS === 'function') calcTMB_OMS();
        if (typeof calcFactorial === 'function') calcFactorial();
    });

    // NEW V4.39: Macro Presets
    window.applyMacroPreset = (type, value) => {
        if (type === 'prot') {
            const input = document.getElementById('goalProtKg');
            if (input) {
                input.value = value;
                input.dispatchEvent(new Event('input'));
                showToast(`ðŸŽ¯ Proteína fijada en ${value} g/kg`);
            }
        }
    };
}

function updateMacroGoals() {
    const p = AppState.patient || {};
    // Robust weight detection
    const inputPeso = document.getElementById('peso');
    const peso = parseFloat(inputPeso ? inputPeso.value : 0) || p.peso_calculo || p.peso || 0;

    const getTotal = parseFloat(document.getElementById('goalTotal')?.value) || 0;

    const valP = parseFloat(document.getElementById('goalProtKg')?.value) || 0;
    const valC = parseFloat(document.getElementById('goalCHOKg')?.value) || 0;
    const valL = parseFloat(document.getElementById('goalLipKg')?.value) || 0;

    let gProt = 0, gCHO = 0, gLip = 0;
    let pctP = 0, pctC = 0, pctL = 0;

    // Determine effectiveGoal based on selected adequacyMode (META vs GET)
    const adeqMode = AppState.adequacyMode || 'goal';
    const theoreticalGET = p.tmt || p.tmt_calculated || parseFloat(document.getElementById('valGET')?.innerText) || 2000;
    const effectiveGoal = (adeqMode === 'get') ? theoreticalGET : (getTotal || theoreticalGET);

    if (macroGoalMode === 'gkg') {
        gProt = valP * peso;
        gCHO = valC * peso;
        gLip = valL * peso;
        if (effectiveGoal > 0) {
            pctP = ((gProt * 4) / effectiveGoal) * 100;
            pctC = ((gCHO * 4) / effectiveGoal) * 100;
            pctL = ((gLip * 9) / effectiveGoal) * 100;
        }
    } else {
        // Mode: PCT
        pctP = valP;
        pctC = valC;
        pctL = valL;
        if (effectiveGoal > 0) {
            gProt = (effectiveGoal * (pctP / 100)) / 4;
            gCHO = (effectiveGoal * (pctC / 100)) / 4;
            gLip = (effectiveGoal * (pctL / 100)) / 9;
        }
    }

    const gkgP = peso > 0 ? (gProt / peso) : 0;
    const gkgC = peso > 0 ? (gCHO / peso) : 0;
    const gkgL = peso > 0 ? (gLip / peso) : 0;

    const elP = document.getElementById('goalProt');
    if (elP) { elP.dataset.val = gProt; elP.innerText = gProt.toFixed(1) + " g/día"; }
    const elC = document.getElementById('goalCHO');
    if (elC) { elC.dataset.val = gCHO; elC.innerText = gCHO.toFixed(1) + " g/día"; }
    const elL = document.getElementById('goalLip');
    if (elL) { elL.dataset.val = gLip; elL.innerText = gLip.toFixed(1) + " g/día"; }

    // Update internal sub-labels
    if (macroGoalMode === 'pct') {
        if (document.getElementById('macroPctProt')) document.getElementById('macroPctProt').innerText = `(${gkgP.toFixed(2)} g/kg)`;
        if (document.getElementById('macroPctCHO')) document.getElementById('macroPctCHO').innerText = `(${gkgC.toFixed(2)} g/kg)`;
        if (document.getElementById('macroPctLip')) document.getElementById('macroPctLip').innerText = `(${gkgL.toFixed(2)} g/kg)`;
    } else {
        // En modo g/kg: mostrar el aporte porcentual de cada macro respecto al GET
        if (document.getElementById('macroPctProt')) document.getElementById('macroPctProt').innerText = `(${pctP.toFixed(1)}%)`;
        if (document.getElementById('macroPctCHO')) document.getElementById('macroPctCHO').innerText = `(${pctC.toFixed(1)}%)`;
        if (document.getElementById('macroPctLip')) document.getElementById('macroPctLip').innerText = `(${pctL.toFixed(1)}%)`;
    }

    const kcalProt = gProt * 4;
    const kcalCHO = gCHO * 4;
    const kcalLip = gLip * 9;
    const totalKcal = kcalProt + kcalCHO + kcalLip;

    const elMacroKcal = document.getElementById('goalMacroKcal');
    if (elMacroKcal) elMacroKcal.innerText = Math.round(totalKcal);

    // --- TOTAL % INDICATOR ---
    const currentPctSum = pctP + pctC + pctL;
    const totalPctOfEnergia = (effectiveGoal > 0) ? (totalKcal / effectiveGoal) * 100 : currentPctSum;
    const pctDisplay = (macroGoalMode === 'pct') ? currentPctSum : totalPctOfEnergia;

    const warnBox = document.getElementById('pctTotalWarning');
    const warnCheck = document.getElementById('pctTotalCheck');

    if (warnBox && warnCheck && (valP > 0 || valC > 0 || valL > 0)) {
        warnCheck.innerText = pctDisplay.toFixed(1) + '%';

        let color;
        if (pctDisplay >= 98 && pctDisplay <= 102) color = '#27ae60';
        else if (pctDisplay < 98) color = '#f39c12';
        else color = '#e74c3c';

        warnBox.style.background = color + '22';
        warnBox.style.borderColor = color + '66';
        warnCheck.style.color = color;
        warnBox.style.display = 'flex';
    } else if (warnBox) {
        warnBox.style.display = 'none';
    }

    if (goalChartInstance) {
        let chartData = [kcalProt, kcalCHO, kcalLip];
        // Proporciones para el gráfico si las kcal absolutas son 0
        if (totalKcal === 0 && (pctP || pctC || pctL)) {
            chartData = [pctP * 4, pctC * 4, pctL * 9];
        }
        goalChartInstance.data.datasets[0].data = chartData;
        goalChartInstance.update();
    }

    // Auto-update adequacy and Traslape
    if (window.updateTraslapeConfig) {
        window.updateTraslapeConfig();
    } else {
        runSimulation();
    }
}

// --- HELPER: TOAST NOTIFICATIONS ---
function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(44, 62, 80, 0.9)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '30px';
    toast.style.zIndex = '10000';
    toast.style.fontSize = '0.85rem';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- WAIST EVALUATION ENGINE (CC) ---
window.evaluateWaist = (makeBadgeFn = null) => {
    const p = AppState.patient;
    const cc = parseFloat(document.getElementById('ccintura')?.value) || 0;
    const resEl = document.getElementById('valWaistClass');

    if (cc <= 0) {
        if (resEl) resEl.innerText = "";
        return "";
    }

    let status = "Normal";
    let color = "#27ae60";

    if (p.type === 'pediatric' || p.type === 'neonate') {
        const y = Math.floor(p.edad);
        if (y >= 5 && y <= 19 && window.WAIST_PERCENTILES) {
            const table = window.WAIST_PERCENTILES[p.sexo];
            const ref = table[y] || (y > 18 ? table[18] : null);
            if (ref) {
                if (cc > ref.p90) {
                    status = "Obesidad Abdominal";
                    color = "#e74c3c";
                } else if (cc > ref.p75) {
                    status = "Riesgo Obesidad Abdominal";
                    color = "#f39c12";
                }
            }
        }
    } else {
        // Adult Logic (MINSAL)
        if (p.sexo === 'm') {
            if (cc >= 102) { status = "Obesidad Abdominal"; color = "#c0392b"; }
            else if (cc >= 94) { status = "Riesgo Cardiovascular"; color = "#f39c12"; }
        } else {
            if (cc >= 88) { status = "Obesidad Abdominal"; color = "#c0392b"; }
            else if (cc >= 80) { status = "Riesgo Cardiovascular"; color = "#f39c12"; }
        }
    }

    if (resEl) {
        resEl.innerText = status;
        resEl.style.color = color;
    }

    if (makeBadgeFn) {
        return makeBadgeFn('Cintura (CC)', 0, status, color);
    }
    return "";
};


// --- NEW V4.60: Advanced NPT Dashboard Logic ---
window.applyNPTTemplate = () => {
    const type = document.getElementById('nptTemplate').value;
    const vol = parseFloat(document.getElementById('advNptVol').value) || 1000;
    const templates = {
        'smof_central': { dex: 127, aa: 50, lip: 38, na: 40, k: 30 },
        'smof_peri': { dex: 71, aa: 32, lip: 28, na: 24, k: 18 }
    };
    if (templates[type]) {
        const factor = vol / 1000;
        document.getElementById('advNptDex').value = Math.round(templates[type].dex * factor);
        document.getElementById('advNptAA').value = Math.round(templates[type].aa * factor);
        document.getElementById('advNptLip').value = Math.round(templates[type].lip * factor);
        document.getElementById('advNptNa').value = Math.round(templates[type].na * factor);
        document.getElementById('advNptK').value = Math.round(templates[type].k * factor);
    }
    window.updateAdvancedNPT();
};

window.updateAdvancedNPT = (trigger) => {
    const vol = parseFloat(document.getElementById('advNptVol')?.value) || 0;
    const dex = parseFloat(document.getElementById('advNptDex')?.value) || 0;
    const aa = parseFloat(document.getElementById('advNptAA')?.value) || 0;
    const lip = parseFloat(document.getElementById('advNptLip')?.value) || 0;
    const weight = AppState.patient?.peso_calculo || AppState.patient?.peso || 0;
    if (document.getElementById('advNptWeight')) document.getElementById('advNptWeight').value = weight;
    const kcalTotalNP = (dex * 3.4) + (lip * 9) + (aa * 4);
    let gir = 0; if (weight > 0) gir = (dex * 1000) / (weight * 1440);
    let osm = 0;
    if (vol > 0) {
        const na = parseFloat(document.getElementById('advNptNa')?.value) || 0;
        const k = parseFloat(document.getElementById('advNptK')?.value) || 0;
        osm = ((dex/vol)*5000) + ((aa/vol)*10000) + ((na/vol)*2000) + ((k/vol)*2000);
    }
    if (document.getElementById('advNptOsm')) document.getElementById('advNptOsm').innerText = Math.round(osm);
    if (document.getElementById('advNptGIR')) document.getElementById('advNptGIR').innerText = gir.toFixed(1);
    const statusEl = document.getElementById('advNptStatus');
    if (statusEl) {
        statusEl.innerText = osm > 800 ? "Central" : "Periférica";
        statusEl.style.background = osm > 800 ? "#e74c3c" : "#27ae60";
    }
    const entId = document.getElementById('advEnteralProduct').value;
    const adeqMode = AppState.adequacyMode || 'goal';
    const theoreticalGET = AppState.patient?.tmt || AppState.patient?.tmt_calculated || parseFloat(document.getElementById('valGET')?.innerText) || 2000;
    const reqKcal = (adeqMode === 'get') ? theoreticalGET : (parseFloat(document.getElementById('goalTotal')?.value) || theoreticalGET);
    let entVolInput = document.getElementById('advEnteralVol');
    let entPctInput = document.getElementById('advEnteralPct');
    let entVol = parseFloat(entVolInput?.value) || 0;
    let entPct = parseFloat(entPctInput?.value) || 0;
    if (entId !== 'none' && reqKcal > 0) {
        const formula = AppState.formulas.find(f => f.id === entId);
        if (formula) {
            const dens = formula.k / (formula.volBase || 100);
            if (trigger === 'pct') {
                entVol = (reqKcal * (entPct / 100)) / dens;
                if (entVolInput) entVolInput.value = Math.round(entVol);
            } else if (trigger === 'vol' || trigger === 'product') {
                entPct = ((entVol * dens) / reqKcal) * 100;
                if (entPctInput) entPctInput.value = Math.round(entPct);
            }
        }
    }
    let entKcal = 0, entProt = 0;
    if (entId !== 'none' && entVol > 0) {
        const f = AppState.formulas.find(f => f.id === entId);
        if (f) {
            const base = f.volBase || 100;
            entKcal = (entVol / base) * f.k;
            entProt = (entVol / base) * f.p;
        }
    }
    const totalKcal = kcalTotalNP + entKcal;
    const totalProt = aa + entProt;
    const totalVol = vol + entVol;
    const reqProt = parseFloat(document.getElementById('goalProt')?.dataset.val) || 0;
    const reqVol = parseFloat(document.getElementById('goalFluid')?.value) || 0;
    const adeqKcal = reqKcal > 0 ? (totalKcal / reqKcal) * 100 : 0;
    const adeqProt = reqProt > 0 ? (totalProt / reqProt) * 100 : 0;
    const adeqVol = reqVol > 0 ? (totalVol / reqVol) * 100 : 0;
    if (document.getElementById('totalAdeqKcal')) document.getElementById('totalAdeqKcal').innerText = Math.round(adeqKcal) + '%';
    if (document.getElementById('totalAdeqProt')) document.getElementById('totalAdeqProt').innerText = Math.round(adeqProt) + '%';
    if (document.getElementById('totalAdeqHyd')) document.getElementById('totalAdeqHyd').innerText = Math.round(adeqVol) + '%';
    if (document.getElementById('totalKcalVal')) document.getElementById('totalKcalVal').innerText = Math.round(totalKcal) + " / " + Math.round(reqKcal) + " kcal";
    if (document.getElementById('totalProtVal')) document.getElementById('totalProtVal').innerText = totalProt.toFixed(1) + " / " + reqProt.toFixed(1) + " g";
    if (document.getElementById('totalHydVal')) document.getElementById('totalHydVal').innerText = Math.round(totalVol) + " / " + Math.round(reqVol) + " ml";
    const bar = document.getElementById('totalAdeqBar');
    if (bar) bar.style.width = Math.min(adeqKcal, 100) + '%';
    const statusLabel = document.getElementById('traslapeStatusLabel');
    if (statusLabel) {
        if (adeqKcal > 95) statusLabel.innerText = "Meta Alcanzada";
        else if (entVol > 0) statusLabel.innerText = "En Traslape Activo (" + Math.round(entPct) + "% NE)";
        else statusLabel.innerText = "Fase Parenteral (100% NP)";
    }
};

window.populateEnteralList = () => {
    const select = document.getElementById('advEnteralProduct');
    if (!select) return;
    let html = '<option value="none">-- Sin Enteral --</option>';
    AppState.formulas.forEach(f => {
        if (f.cat === "Fórmulas RTH" || f.cat === "Leches HRA") {
            html += '<option value="' + f.id + '">' + f.name + '</option>';
        }
    });
    select.innerHTML = html;
};

const oldInit = window.initTabNavigation;
window.initTabNavigation = function() {
    if (oldInit) oldInit();
    document.querySelectorAll('.app-tabs .tab-btn').forEach(t => {
        t.addEventListener('click', () => {
            if (t.dataset.view === 'nutri-ia') {
                window.populateEnteralList();
                window.updateAdvancedNPT();
            }
        });
    });
};

// --- NEW V4.50: Edema & Ascites Logic ---
window.toggleEdemaPanel = () => {
    const p = document.getElementById('edemaPanel');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
};

window.updateDryWeight = () => {
    const rawPeso = parseFloat(document.getElementById('peso')?.value) || 0;
    const edemaKg = parseFloat(document.getElementById('edemaGrade')?.value) || 0;
    const ascitisKg = parseFloat(document.getElementById('ascitesGrade')?.value) || 0;
    
    const dryWeight = Math.max(0, rawPeso - (edemaKg + ascitisKg));
    const out = document.getElementById('dryWeightOut');
    if (out) out.innerText = dryWeight.toFixed(1) + " kg";
    
    // Sincronizar con AppState si el modo es 'dry'
    const mode = document.getElementById('pesoCalculoSelect')?.value;
    if (mode === 'dry') {
        calculateRequirements();
    }
};

// --- INTERACTIVE ANAMNESIS & STRONGKIDS CLINICAL LOGIC ---
window.setToggleState = (elementId, value) => {
    const group = document.querySelector(`.toggle-btn-group[data-id="${elementId}"]`);
    if (!group) return;
    
    const btns = group.querySelectorAll('.btn-toggle');
    btns.forEach(btn => {
        btn.style.background = '#f7fafc';
        btn.style.color = '#a0aec0';
        btn.style.borderColor = '#e2e8f0';
        btn.classList.remove('active');
        
        const isSiBtn = btn.innerText.trim() === 'SÍ' || btn.innerText.trim() === 'SI';
        if ((value === 'Sí' && isSiBtn) || (value === 'No' && !isSiBtn)) {
            btn.classList.add('active');
            if (value === 'Sí') {
                btn.style.background = '#d1fae5';
                btn.style.color = '#1e8449';
                btn.style.borderColor = '#6ee7b7';
            } else {
                btn.style.background = '#fee2e2';
                btn.style.color = '#c0392b';
                btn.style.borderColor = '#fca5a5';
            }
        }
    });

    if (!AppState.patient.anamnesis) AppState.patient.anamnesis = {};
    AppState.patient.anamnesis[elementId] = value;
};

window.setSkState = (qId, value, ptsYes) => {
    const group = document.querySelector(`.sk-btn-group[data-q="${qId}"]`);
    if (!group) return;

    const btns = group.querySelectorAll('.btn-toggle');
    btns.forEach(btn => {
        btn.style.background = '#f7fafc';
        btn.style.color = '#a0aec0';
        btn.style.borderColor = '#e2e8f0';
        btn.classList.remove('active');
        
        const isSiBtn = btn.innerText.trim() === 'SÍ' || btn.innerText.trim() === 'SI';
        if ((value === 'Sí' && isSiBtn) || (value === 'No' && !isSiBtn)) {
            btn.classList.add('active');
            if (value === 'Sí') {
                btn.style.background = '#d1fae5';
                btn.style.color = '#1e8449';
                btn.style.borderColor = '#6ee7b7';
            } else {
                btn.style.background = '#fee2e2';
                btn.style.color = '#c0392b';
                btn.style.borderColor = '#fca5a5';
            }
        }
    });

    const scoreLabel = document.getElementById(`skScoreQ${qId.substring(1).toUpperCase()}`);
    if (scoreLabel) {
        scoreLabel.innerText = value === 'Sí' ? `+${ptsYes} pts` : '0 pts';
        scoreLabel.style.color = value === 'Sí' ? '#e74c3c' : '#95a5a6';
    }

    window.calculateStrongKids();
};

window.calculateStrongKids = () => {
    let total = 0;
    
    const q1Active = document.querySelector('.sk-btn-group[data-q="q1"] .btn-toggle.si.active');
    const q2Active = document.querySelector('.sk-btn-group[data-q="q2"] .btn-toggle.si.active');
    const q3Active = document.querySelector('.sk-btn-group[data-q="q3"] .btn-toggle.si.active');
    const q4Active = document.querySelector('.sk-btn-group[data-q="q4"] .btn-toggle.si.active');

    if (q1Active) total += 2;
    if (q2Active) total += 1;
    if (q3Active) total += 1;
    if (q4Active) total += 1;

    const totalBadge = document.getElementById('strongKidsTotalScore');
    if (totalBadge) totalBadge.innerText = total + ' pts';

    let classif = 'Riesgo bajo';
    let color = '#27ae60';
    let bg = 'rgba(39, 174, 96, 0.05)';
    let border = 'rgba(39, 174, 96, 0.2)';
    let recs = `• No es necesaria una intervención nutricional.\n• Controlar el peso regularmente (según la política hospitalaria).\n• Evaluar el riesgo nutricional semanalmente.`;

    if (total >= 4) {
        classif = 'Riesgo alto';
        color = '#c0392b';
        bg = 'rgba(192, 57, 43, 0.05)';
        border = 'rgba(192, 57, 43, 0.2)';
        recs = `• Consulte al médico y al dietista para obtener un diagnóstico completo y asesoramiento nutricional individual y seguimiento.\n• Controle el peso dos veces por semana y evalúe el estado nutricional.\n• Evaluar el riesgo nutricional semanalmente.`;
    } else if (total >= 1) {
        classif = 'Riesgo medio';
        color = '#d35400';
        bg = 'rgba(211, 84, 0, 0.05)';
        border = 'rgba(211, 84, 0, 0.2)';
        recs = `• Considere la intervención nutricional.\n• Controlar el peso dos veces por semana.\n• Evaluar el riesgo nutricional semanalmente.`;
    }

    const classifLabel = document.getElementById('strongKidsClassif');
    const recsArea = document.getElementById('strongKidsRecs');
    const panelBox = document.getElementById('strongKidsResultPanel');

    if (classifLabel) {
        classifLabel.innerText = classif.toUpperCase();
        classifLabel.style.color = color;
    }
    if (recsArea) {
        recsArea.innerText = recs;
    }
    if (panelBox) {
        panelBox.style.background = bg;
        panelBox.style.borderColor = border;
        panelBox.style.borderWidth = '1px';
    }

    if (!AppState.patient.strongkids) AppState.patient.strongkids = {};
    AppState.patient.strongkids.score = total;
    AppState.patient.strongkids.classification = classif;
};

window.setNrsInitialState = (qId, value) => {
    if (!AppState.patient.nrs2002) AppState.patient.nrs2002 = {};
    if (!AppState.patient.nrs2002.initialAnswers) AppState.patient.nrs2002.initialAnswers = {};
    AppState.patient.nrs2002.initialAnswers[qId] = value;

    const group = document.querySelector(`.nrs-init-btn-group[data-q="${qId}"]`);
    if (!group) return;

    const btns = group.querySelectorAll('.btn-toggle');
    btns.forEach(btn => {
        btn.style.background = '#f7fafc';
        btn.style.color = '#a0aec0';
        btn.style.borderColor = '#e2e8f0';
        btn.classList.remove('active');
        
        const isSiBtn = btn.innerText.trim() === 'SÍ' || btn.innerText.trim() === 'SI';
        if ((value === 'Sí' && isSiBtn) || (value === 'No' && !isSiBtn)) {
            btn.classList.add('active');
            if (value === 'Sí') {
                btn.style.background = '#fee2e2';
                btn.style.color = '#c0392b';
                btn.style.borderColor = '#fca5a5';
            } else {
                btn.style.background = '#d1fae5';
                btn.style.color = '#1e8449';
                btn.style.borderColor = '#6ee7b7';
            }
        }
    });

    window.calculateNRS2002();
};

window.calculateNRS2002 = () => {
    const finalSection = document.getElementById('nrs2002FinalSection');
    const statusSelect = document.getElementById('nrsNutritionalStatus');
    const severitySelect = document.getElementById('nrsDiseaseSeverity');
    
    if (!statusSelect || !severitySelect) return;
    
    if (!AppState.patient.nrs2002) AppState.patient.nrs2002 = {};
    if (!AppState.patient.nrs2002.initialAnswers) {
        AppState.patient.nrs2002.initialAnswers = {
            nrsQ1: 'No',
            nrsQ2: 'No',
            nrsQ3: 'No',
            nrsQ4: 'No'
        };
    }

    const initAnswers = AppState.patient.nrs2002.initialAnswers;
    const hasAnyYes = Object.values(initAnswers).some(val => val === 'Sí');

    const totalBadge = document.getElementById('nrsTotalScore');
    const classifLabel = document.getElementById('nrsClassif');
    const recsArea = document.getElementById('nrsRecs');
    const panelBox = document.getElementById('nrsResultPanel');

    // Elementos de UI de resultados
    let total = 0;
    let classif = 'Sin riesgo';
    let color = '#1abc9c';
    let bg = 'rgba(26, 188, 156, 0.05)';
    let border = 'rgba(26, 188, 156, 0.2)';
    let recs = '';

    if (!hasAnyYes) {
        // ESCENARIO A: Todo NO en Screening Inicial
        if (finalSection) finalSection.style.display = 'none';

        recs = `• El paciente se encuentra sin riesgo en el screening inicial.\n• Reevaluar semanalmente durante la hospitalización.\n• En caso de que el paciente vaya a ser sometido a una cirugía mayor, considerar la posibilidad de soporte nutricional perioperatorio.`;
        
        if (totalBadge) totalBadge.innerText = '0 pts';
        if (classifLabel) {
            classifLabel.innerText = 'SIN RIESGO';
            classifLabel.style.color = color;
            classifLabel.style.borderColor = border;
        }
        if (recsArea) recsArea.innerText = recs;
        if (panelBox) {
            panelBox.style.background = bg;
            panelBox.style.borderColor = border;
        }

        AppState.patient.nrs2002.score = 0;
        AppState.patient.nrs2002.classification = 'Sin riesgo nutricional (Filtro Inicial Negativo)';
        AppState.patient.nrs2002.statusScore = 0;
        AppState.patient.nrs2002.severityScore = 0;
        AppState.patient.nrs2002.ageScore = 0;
    } else {
        // ESCENARIO B: Al menos un SÍ en Screening Inicial
        if (finalSection) finalSection.style.display = 'block';

        const statusVal = parseInt(statusSelect.value) || 0;
        const severityVal = parseInt(severitySelect.value) || 0;
        
        // Obtener edad del paciente desde el input de edad
        const age = parseFloat(document.getElementById('edad')?.value) || 0;
        
        // Si edad >= 70 años, suma +1 punto automáticamente
        const ageScore = age >= 70 ? 1 : 0;
        
        // Actualizar badge de bonificación por edad
        const nrsAgeBonus = document.getElementById('nrsAgeBonus');
        if (nrsAgeBonus) {
            if (ageScore > 0) {
                nrsAgeBonus.innerText = `+1 pt`;
                nrsAgeBonus.style.background = '#fee2e2';
                nrsAgeBonus.style.color = '#c0392b';
            } else {
                nrsAgeBonus.innerText = `+0 pts`;
                nrsAgeBonus.style.background = '#f1f5f9';
                nrsAgeBonus.style.color = '#64748b';
            }
        }
        
        total = statusVal + severityVal + ageScore;
        
        if (total >= 3) {
            classif = 'Con riesgo';
            color = '#c0392b';
            bg = 'rgba(192, 57, 43, 0.05)';
            border = 'rgba(192, 57, 43, 0.2)';
            recs = `• El paciente presenta RIESGO NUTRICIONAL.\n• Iniciar plan de soporte nutricional formal según protocolo institucional.\n• Monitorear estrechamente la ingesta alimentaria y el peso.\n• Reevaluar periódicamente.`;
        } else {
            classif = 'Sin riesgo';
            color = '#1abc9c';
            bg = 'rgba(26, 188, 156, 0.05)';
            border = 'rgba(26, 188, 156, 0.2)';
            recs = `• El paciente no presenta riesgo nutricional en la evaluación final.\n• Reevaluar el tamizaje semanalmente durante la hospitalización.\n• Si el paciente está programado para una cirugía mayor, considerar plan preventivo.`;
        }
        
        if (totalBadge) totalBadge.innerText = total + ' pts';
        if (classifLabel) {
            classifLabel.innerText = classif.toUpperCase() + ' NUTRICIONAL';
            classifLabel.style.color = color;
            classifLabel.style.borderColor = border;
        }
        if (recsArea) recsArea.innerText = recs;
        if (panelBox) {
            panelBox.style.background = bg;
            panelBox.style.borderColor = border;
        }
        
        AppState.patient.nrs2002.score = total;
        AppState.patient.nrs2002.classification = classif === 'Con riesgo' ? 'Con riesgo nutricional' : 'Sin riesgo nutricional';
        AppState.patient.nrs2002.statusScore = statusVal;
        AppState.patient.nrs2002.severityScore = severityVal;
        AppState.patient.nrs2002.ageScore = ageScore;
    }
};

window.initAnamnesisToggles = () => {
    if (!AppState.patient) AppState.patient = {};
    if (!AppState.patient.anamnesis) {
        AppState.patient.anamnesis = {
            sintomaNauseas: 'No',
            sintomaVomitos: 'No',
            sintomaReflujo: 'No',
            sintomaDeposiciones: 'No',
            sintomaDistension: 'No',
            sintomaGases: 'No',
            anamnesisDentadura: 'Sí',
            anamnesisAlergias: 'No',
            anamnesisDeglucion: 'No',
            anamnesisApetito: 'Sí'
        };
    }
    if (!AppState.patient.strongkids) {
        AppState.patient.strongkids = {
            score: 0,
            classification: 'Riesgo bajo'
        };
    }
    if (!AppState.patient.nrs2002) {
        AppState.patient.nrs2002 = {
            score: 0,
            classification: 'Sin riesgo nutricional (Filtro Inicial Negativo)',
            statusScore: 0,
            severityScore: 0,
            ageScore: 0,
            initialAnswers: {
                nrsQ1: 'No',
                nrsQ2: 'No',
                nrsQ3: 'No',
                nrsQ4: 'No'
            }
        };
    }

    Object.entries(AppState.patient.anamnesis).forEach(([id, val]) => {
        window.setToggleState(id, val);
    });

    window.setSkState('q1', 'No', 2);
    window.setSkState('q2', 'No', 1);
    window.setSkState('q3', 'No', 1);
    window.setSkState('q4', 'No', 1);
    
    window.setNrsInitialState('nrsQ1', 'No');
    window.setNrsInitialState('nrsQ2', 'No');
    window.setNrsInitialState('nrsQ3', 'No');
    window.setNrsInitialState('nrsQ4', 'No');
};






















// --- CURVAS DE CRECIMIENTO DINÁMICAS ---
window.showCurve = function(type) {
    const area = document.getElementById('curveDisplayArea');
    const placeholder = document.getElementById('curveImagePlaceholder');
    const img = document.getElementById('curveImg');
    const dot = document.getElementById('curveDot');
    const dot2 = document.getElementById('curveDot2');
    
    if(!area || !img || !placeholder || !dot) return;
    
    placeholder.style.display = 'none';
    img.style.display = 'block';
    dot.style.display = 'none'; // hide until plotted
    if (dot2) dot2.style.display = 'none'; // default hide dot2
    
    // Data extraction
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    let talla = parseFloat(document.getElementById('estatura').value) || 0; // en cm (could be entered in meters)
    if (talla > 0 && talla <= 3) {
        talla = talla * 100;
    }
    const pc = parseFloat(document.getElementById('pcefalico').value) || 0;
    const sexo = document.getElementById('sexo').value || 'f';
    
    // Age calculation
    let edadMeses = parseFloat(document.getElementById('edad').value) || 0; 
    const fn = document.getElementById('fechaNacimiento').value;
    let agePostnatalDays = 0;
    
    const birth = parseSpanishDate(fn);
    if (birth) {
        const now = new Date();
        let months = (now.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += now.getMonth();
        if (now.getDate() < birth.getDate()) months--;
        if (months >= 0) edadMeses = months;
        
        agePostnatalDays = Math.floor(Math.abs(now - birth) / (1000 * 60 * 60 * 24));
    }

    // Neonatal Gestational Age corregida for curve X-axis
    const semNac = parseInt(document.getElementById('egSemanas')?.value) || 0;
    const diasNac = parseInt(document.getElementById('egDias')?.value) || 0;
    let egNeonatal = semNac + (diasNac / 7);
    if (agePostnatalDays > 0) {
        egNeonatal = semNac + ((diasNac + agePostnatalDays) / 7);
    }
    if (egNeonatal < 24) egNeonatal = 24;
    if (egNeonatal > 42) egNeonatal = 42;

    // IMC Calculation
    let imc = 0;
    if (talla > 0 && peso > 0) {
        imc = peso / Math.pow(talla / 100, 2);
    }

    // --- MAPA DE CALIBRACIÓN AVANZADA ---
    // Estructura: curveMeta[type][sexo] es un array de rangos
    const curveMeta = {
        'pe': {
            'f': [
                { minAge: 0, maxAge: 24, url: 'assets/curvas/pe_f_0_2.png', xValue: edadMeses, yValue: peso, xMin: 0, xMax: 24, yMin: 2, yMax: 17, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Peso (kg)' },
                { minAge: 24, maxAge: 60, url: 'assets/curvas/pe_f_2_5.png', xValue: edadMeses, yValue: peso, xMin: 24, xMax: 60, yMin: 8, yMax: 25, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Peso (kg)' }
            ],
            'm': [
                { minAge: 0, maxAge: 24, url: 'assets/curvas/pe_m_0_2.png', xValue: edadMeses, yValue: peso, xMin: 0, xMax: 24, yMin: 2, yMax: 17, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Peso (kg)' },
                { minAge: 24, maxAge: 60, url: 'assets/curvas/pe_m_2_5.png', xValue: edadMeses, yValue: peso, xMin: 24, xMax: 60, yMin: 8, yMax: 25, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Peso (kg)' }
            ]
        },
        'te': {
            'f': [
                { minAge: 0, maxAge: 24, url: 'assets/curvas/te_f_0_2.png', xValue: edadMeses, yValue: talla, xMin: 0, xMax: 24, yMin: 45, yMax: 95, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Talla (cm)' },
                { minAge: 24, maxAge: 60, url: 'assets/curvas/te_f_2_5.png', xValue: edadMeses, yValue: talla, xMin: 24, xMax: 60, yMin: 75, yMax: 120, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Talla (cm)' },
                { minAge: 60, maxAge: 228, url: 'assets/curvas/te_f_5_19.png', xValue: edadMeses, yValue: talla, xMin: 60, xMax: 228, yMin: 100, yMax: 180, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Talla (cm)' }
            ],
            'm': [
                { minAge: 0, maxAge: 24, url: 'assets/curvas/te_m_0_2.png', xValue: edadMeses, yValue: talla, xMin: 0, xMax: 24, yMin: 45, yMax: 95, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Talla (cm)' },
                { minAge: 24, maxAge: 60, url: 'assets/curvas/te_m_2_5.png', xValue: edadMeses, yValue: talla, xMin: 24, xMax: 60, yMin: 80, yMax: 120, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Talla (cm)' },
                { minAge: 60, maxAge: 228, url: 'assets/curvas/te_m_5_19.png', xValue: edadMeses, yValue: talla, xMin: 60, xMax: 228, yMin: 100, yMax: 200, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'Talla (cm)' }
            ]
        },
        'pt': {
            'f': [
                { minTalla: 45, maxTalla: 110, url: 'assets/curvas/pt_f_0_2.png', xValue: talla, yValue: peso, xMin: 45, xMax: 110, yMin: 1, yMax: 23, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Talla (cm)', yName: 'Peso (kg)' },
                { minTalla: 65, maxTalla: 120, url: 'assets/curvas/pt_f_2_5.png', xValue: talla, yValue: peso, xMin: 65, xMax: 120, yMin: 6, yMax: 29, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Talla (cm)', yName: 'Peso (kg)' }
            ],
            'm': [
                { minTalla: 45, maxTalla: 110, url: 'assets/curvas/pt_m_0_2.png', xValue: talla, yValue: peso, xMin: 45, xMax: 110, yMin: 1, yMax: 23, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Talla (cm)', yName: 'Peso (kg)' },
                { minTalla: 65, maxTalla: 120, url: 'assets/curvas/pt_m_2_5.png', xValue: talla, yValue: peso, xMin: 65, xMax: 120, yMin: 6, yMax: 28, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Talla (cm)', yName: 'Peso (kg)' }
            ]
        },
        'pce': {
            'f': [
                { minAge: 0, maxAge: 24, url: 'assets/curvas/pce_f_0_2.png', xValue: edadMeses, yValue: pc, xMin: 0, xMax: 24, yMin: 30, yMax: 51, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'PC (cm)' }
            ],
            'm': [
                { minAge: 0, maxAge: 24, url: 'assets/curvas/pce_m_0_2.png', xValue: edadMeses, yValue: pc, xMin: 0, xMax: 24, yMin: 31, yMax: 52, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'PC (cm)' }
            ]
        },
        'imc': {
            'f': [
                { minAge: 60, maxAge: 228, url: 'assets/curvas/imc_f_5_19.png', xValue: edadMeses, yValue: imc, xMin: 60, xMax: 228, yMin: 12, yMax: 38, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'IMC (kg/m2)' }
            ],
            'm': [
                { minAge: 60, maxAge: 228, url: 'assets/curvas/imc_m_5_19.png', xValue: edadMeses, yValue: imc, xMin: 60, xMax: 228, yMin: 12, yMax: 36, pxLeft: 6.7, pxRight: 85.4, pxBottom: 7.5, pxTop: 84.5, xName: 'Meses', yName: 'IMC (kg/m2)' }
            ]
        },
        'pittaluga_peso': {
            'f': [{ url: 'assets/curvas/pittaluga_peso.png', xValue: egNeonatal, yValue: peso * 1000, xMin: 24, xMax: 42, yMin: 0, yMax: 4500, pxLeft: 8.5, pxRight: 94.5, pxBottom: 8.5, pxTop: 95.0, xName: 'EG Semanas', yName: 'Peso (g)' }],
            'm': [{ url: 'assets/curvas/pittaluga_peso.png', xValue: egNeonatal, yValue: peso * 1000, xMin: 24, xMax: 42, yMin: 0, yMax: 4500, pxLeft: 8.5, pxRight: 94.5, pxBottom: 8.5, pxTop: 95.0, xName: 'EG Semanas', yName: 'Peso (g)' }]
        },
        'pittaluga_talla_pc': {
            'f': [{ url: 'assets/curvas/pittaluga_talla_pc.png', xValue: egNeonatal, yValue: talla, yValue2: pc, xMin: 24, xMax: 42, yMin: 20, yMax: 55, pxLeft: 8.5, pxRight: 94.5, pxBottom: 8.5, pxTop: 95.0, xName: 'EG Semanas', yName: 'Talla/PC (cm)' }],
            'm': [{ url: 'assets/curvas/pittaluga_talla_pc.png', xValue: egNeonatal, yValue: talla, yValue2: pc, xMin: 24, xMax: 42, yMin: 20, yMax: 55, pxLeft: 8.5, pxRight: 94.5, pxBottom: 8.5, pxTop: 95.0, xName: 'EG Semanas', yName: 'Talla/PC (cm)' }]
        }
    };

    // Find the correct chart configuration
    let c = null;
    if (curveMeta[type] && curveMeta[type][sexo]) {
        const options = curveMeta[type][sexo];
        for (let opt of options) {
            if (opt.minAge !== undefined && edadMeses >= opt.minAge && edadMeses <= opt.maxAge) { c = opt; break; }
            if (opt.minTalla !== undefined && talla >= opt.minTalla && talla <= opt.maxTalla) { c = opt; break; }
            if (type === 'pittaluga_peso' || type === 'pittaluga_talla_pc') { c = opt; break; } // Pittaluga always maps
        }
        // Fallback to the first one if no exact match (so it at least shows something)
        if (!c && options.length > 0) c = options[0];
    }
    
    if (c) {
        img.src = c.url;
        img.onerror = () => { img.src = `https://placehold.co/800x600/8e44ad/ffffff?text=Falta+Imagen:+${encodeURIComponent(c.url)}`; };
        
        img.onload = () => {
            if (c.xValue > 0) {
                let x = Math.max(c.xMin, Math.min(c.xMax, c.xValue));
                let xPct = c.pxLeft + ((x - c.xMin) / (c.xMax - c.xMin)) * (c.pxRight - c.pxLeft);
                
                // Plot dot 1 if yValue is provided and > 0
                if (c.yValue > 0) {
                    let y = Math.max(c.yMin, Math.min(c.yMax, c.yValue));
                    let yPct = c.pxBottom + ((y - c.yMin) / (c.yMax - c.yMin)) * (c.pxTop - c.pxBottom);
                    
                    dot.style.left = `${xPct}%`;
                    dot.style.bottom = `${yPct}%`;
                    dot.style.display = 'block';
                } else {
                    dot.style.display = 'none';
                }
                
                // Plot dot 2 if yValue2 is provided (e.g., PC on pittaluga_talla_pc)
                if (type === 'pittaluga_talla_pc' && c.yValue2 > 0 && dot2) {
                    let y2 = Math.max(c.yMin, Math.min(c.yMax, c.yValue2));
                    let y2Pct = c.pxBottom + ((y2 - c.yMin) / (c.yMax - c.yMin)) * (c.pxTop - c.pxBottom);
                    
                    dot2.style.left = `${xPct}%`;
                    dot2.style.bottom = `${y2Pct}%`;
                    dot2.style.display = 'block';
                }
                
                // Auto-classification in PES diagnostic textbox
                let diag = document.getElementById('diagnosticoPES');
                let interpStr = `\n[Gráfico ${type.toUpperCase()}] ${c.xName}: ${c.xValue.toFixed(1)}, ${c.yName}: ${c.yValue.toFixed(1)}`;
                if (type === 'pittaluga_talla_pc') {
                    interpStr = `\n[Gráfico Pittaluga Talla & PC] EG: ${c.xValue.toFixed(1)} sem, Talla: ${c.yValue.toFixed(1)} cm, PC: ${c.yValue2.toFixed(1)} cm`;
                }
                if (diag && !diag.value.includes(`[Gráfico ${type.toUpperCase()}]`) && !diag.value.includes('[Gráfico Pittaluga Talla & PC]')) {
                    diag.value += interpStr;
                }
            }
        };
    } else {
        // Fallbacks (pittaluga, etc)
        img.src = `https://placehold.co/800x600/8e44ad/ffffff?text=Curva+No+Definida+o+Fuera+de+Rango`;
    }
};

window.updateCurveButtons = function() {
    const pType = document.querySelector('input[name="patientType"]:checked')?.value || 'adult';
    const pedia = document.getElementById('pediaCurves');
    const neo = document.getElementById('neoCurves');
    const adult = document.getElementById('adultCurves');
    
    if(!pedia || !neo || !adult) return;
    
    pedia.style.display = 'none';
    neo.style.display = 'none';
    adult.style.display = 'none';
    
    if(pType === 'pediatric') {
        pedia.style.display = 'flex';
    } else if(pType === 'neonate') {
        neo.style.display = 'flex';
    } else {
        adult.style.display = 'block';
    }
};








