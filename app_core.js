// --- SEDILE HRA V2.5 AUTH FIX - Build 20260128-1748 ---
// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://qibkmvtbgauobedtjapg.supabase.co';
const supabaseKey = 'sb_publishable_xCxGjcAngmfd0hJYv2uphg_yB-pF3Hp';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- EMERGENCY ERROR HANDLER ---
window.onerror = function (msg, url, line, col, error) {
    alert("⚠️ Error de Script (V3.6): " + msg + "\nLínea: " + line);
    console.error(error);
    return false;
};

// --- 2. DATABASE (Vademécum HRA & RTH) ---
const LOCAL_FORMULAS = [
    { cat: "Leches HRA", id: "alprem", name: "Alprem", type: "l", k: 80.0, p: 2.9, c: 8.1, f: 4.0 },
    { cat: "Leches HRA", id: "f1", name: "F1", type: "l", stdDil: 13, k: 67.9, p: 1.2, c: 7.6, f: 3.6 },
    { cat: "Leches HRA", id: "f2", name: "F2", type: "l", stdDil: 14, k: 68.0, p: 2.1, c: 8.2, f: 3.0 },
    {
        cat: "Leches HRA", id: "f3", name: "F3", type: "recipe", recipe: [
            { id: "comp_comfort", name: "Comfort", defPct: 10, k: 513.07, p: 10.0, c: 60.0, f: 26.15 },
            { id: "comp_nido", name: "Nido +1", defPct: 5, k: 458.0, p: 17.0, c: 52.0, f: 20.2 }
        ]
    },
    { cat: "Leches HRA", id: "f4", name: "F4", type: "l", stdDil: 20, k: 98.6, p: 4.4, c: 8.7, f: 2.6 },
    { cat: "Leches HRA", id: "f5", name: "F5", type: "l", stdDil: 14, k: 66.5, p: 2.2, c: 7.7, f: 3.4 },
    { cat: "Leches HRA", id: "f7", name: "F7", type: "l", stdDil: 14, k: 71.0, p: 1.8, c: 7.6, f: 3.7 },
    { cat: "Leches HRA", id: "f8", name: "F8", type: "l", stdDil: 8, k: 32.6, p: 2.4, c: 3.6, f: 1.0 },
    { cat: "Leches HRA", id: "f9", name: "F9", type: "l", stdDil: 14, k: 72.8, p: 2.0, c: 7.3, f: 4.0 },
    { cat: "Leches HRA", id: "sl", name: "Sin Lactosa", type: "l", stdDil: 14, k: 71.3, p: 1.5, c: 8.3, f: 3.6 },
    { cat: "Leches HRA", id: "comfort", name: "Comfort", type: "l", stdDil: 13, k: 66.7, p: 1.3, c: 7.8, f: 3.4 },
    { cat: "Leches HRA", id: "pediasure", name: "Pediasure", type: "l", k: 92.8, p: 2.8, c: 12.1, f: 3.6 },
    { cat: "Leches HRA", id: "frebini", name: "Frebini", type: "l", k: 150.0, p: 3.8, c: 18.7, f: 6.7 },
    { cat: "Leches HRA", id: "pediasure_drink", name: "Pediasure Drink", type: "l", k: 100.0, p: 3.0, c: 13.1, f: 3.9 },
    { cat: "Leches HRA", id: "ensure_compact", name: "Ensure Compact", type: "l", k: 240.0, p: 10.2, c: 28.7, f: 9.4 },
    { cat: "Leches HRA", id: "e1", name: "E1", type: "l", stdDil: 22, k: 94.2, p: 3.5, c: 12.6, f: 3.1 },
    {
        cat: "Leches HRA", id: "e2", name: "E2", type: "recipe", recipe: [
            { id: "comp_ensure", name: "Ensure", defPct: 22, k: 428.18, p: 15.9, c: 57.27, f: 14.09 },
            { id: "comp_vivalitewp", name: "Vivalite WP", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 }
        ]
    },
    {
        cat: "Leches HRA", id: "e3", name: "E3", type: "recipe", recipe: [
            { id: "comp_ensure", name: "Ensure", defPct: 22, k: 428.18, p: 15.9, c: 57.27, f: 14.09 },
            { id: "comp_vivalitewp", name: "Vivalite WP", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 },
            { id: "comp_nessucar", name: "Nessucar", defPct: 5, k: 380.0, p: 0.0, c: 96.0, f: 0.0 }
        ]
    },
    { cat: "Leches HRA", id: "g1", name: "G1", type: "l", stdDil: 20, k: 95.3, p: 4.3, c: 9.1, f: 3.5 },
    {
        cat: "Leches HRA", id: "g2", name: "G2", type: "recipe", recipe: [
            { id: "comp_vivalitegold", name: "Vivalite Gold", defPct: 20, k: 476.5, p: 21.5, c: 45.5, f: 17.5 },
            { id: "comp_vivalitewp", name: "Vivalite WP", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 }
        ]
    },
    {
        cat: "Leches HRA", id: "g3", name: "G3", type: "recipe", recipe: [
            { id: "comp_vivalitegold", name: "Vivalite Gold", defPct: 20, k: 476.5, p: 21.5, c: 45.5, f: 17.5 },
            { id: "comp_vivalitewp", name: "Vivalite WP", defPct: 3, k: 357.0, p: 90.0, c: 0.0, f: 0.0 },
            { id: "comp_nessucar", name: "Nessucar", defPct: 5, k: 380.0, p: 0.0, c: 96.0, f: 0.0 }
        ]
    },
    { cat: "Leches HRA", id: "ff1", name: "FF1", type: "l", k: 100.1, p: 3.7, c: 13.3, f: 3.3 },
    { cat: "Leches HRA", id: "ff2", name: "FF2", type: "l", k: 145.1, p: 6.3, c: 13.3, f: 3.4 },
    { cat: "Leches HRA", id: "ff3", name: "FF3", type: "l", k: 164.3, p: 6.3, c: 18.1, f: 3.4 },
    { cat: "Leches HRA", id: "clinical", name: "Clinical", type: "l", k: 150.0, p: 9.1, c: 17.0, f: 4.8 },
    { cat: "Leches HRA", id: "glucerna_shake", name: "Glucerna Shake", type: "l", k: 93.0, p: 4.6, c: 11.0, f: 3.4 },
    { cat: "Leches HRA", id: "protical", name: "Protical", type: "l", k: 133.0, p: 8.3, c: 6.3, f: 8.3 },
    { cat: "Leches HRA", id: "nut_inicio", name: "Nutrición de Inicio", type: "l", k: 196.1, p: 8.9, c: 11.5, f: 0.0 },
    { cat: "Leches HRA", id: "nut_trofica", name: "Nutrición Trófica", type: "l", k: 46.1, p: 0.0, c: 11.5, f: 0.0 },
    { cat: "Leches HRA", id: "abintra", name: "Abintra", type: "l", k: 40.0, p: 9.0, c: 1.0, f: 0.0 },
    { cat: "Leches HRA", id: "glutapak", name: "Glutapak-R", type: "l", k: 60.0, p: 10.0, c: 5.0, f: 0.0 },
    { cat: "Leches HRA", id: "fortificador", name: "Fortificador", type: "l", k: 17.4, p: 1.4, c: 1.3, f: 0.7 },
    { cat: "Leches HRA", id: "g4", name: "G4", type: "l", k: 176.1, p: 6.9, c: 18.3, f: 3.5 },
    { cat: "Fórmulas RTH", id: "osmolite", name: "Osmolite", type: "l", k: 100.0, p: 4.0, c: 13.6, f: 3.4 },
    { cat: "Fórmulas RTH", id: "glucerna_15", name: "Glucerna 1.5", type: "l", k: 150.0, p: 7.5, c: 12.76, f: 7.5 },
    { cat: "Fórmulas RTH", id: "diben_15", name: "Diben 1.5 Kcal", type: "l", k: 150.0, p: 7.5, c: 13.1, f: 7.0 },
    { cat: "Fórmulas RTH", id: "fresubin_fibre", name: "Fresubin Original Fibre", type: "l", k: 100.0, p: 3.8, c: 13.0, f: 3.4 },
    { cat: "Fórmulas RTH", id: "fresubin_intensive", name: "Fresubin Intensive", type: "l", k: 122.0, p: 10.0, c: 12.9, f: 3.2 },
    { cat: "Fórmulas RTH", id: "fresubin_2kcal", name: "Fresubin 2 Kcal HP", type: "l", k: 200.0, p: 10.0, c: 17.5, f: 10.0 },
    { cat: "Fórmulas RTH", id: "ensure_clinical_rth", name: "Ensure Clinical (RTH)", type: "l", k: 149.2, p: 8.0, c: 18.0, f: 4.8 },
    { cat: "Fórmulas en Polvo", id: "nan_optipro", name: "Nan Optipro", type: "p", k: 522.0, p: 9.6, c: 58.0, f: 28.0 },
    { cat: "Fórmulas en Polvo", id: "nido_3", name: "Nido Etapa 3+", type: "p", k: 458.0, p: 17.0, c: 52.0, f: 20.2 },
    { cat: "Fórmulas en Polvo", id: "purita_pro2", name: "Purita + Pro2", type: "p", k: 439.0, p: 29.9, c: 45.7, f: 15.2 }
];

// --- 3. GLOBAL STATE ---
const AppState = {
    user: null,
    patient: { id: null, nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0, ia_report: null },
    formulas: LOCAL_FORMULAS,
    calcMode: 'vol',
    favorites: [], // Init empty first
    userOverridesGoal: false,
    compareMode: false,
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
    "fenitoina": "⚠️ Separar de la nutrición enteral (NE) al menos 1-2 horas antes y después para evitar reducción en su absorción. Monitorizar niveles séricos.",
    "propofol": "⚠️ Aporta 1.1 kcal/ml de lípidos. Considerar este aporte calórico graso dentro del balance calórico total para evitar sobrealimentación.",
    "omeprazol": "⚠️ Administrar preferentemente en ayunas o 30-60 min antes de la NE para asegurar eficacia. No mezclar directamente con la fórmula.",
    "furosemida": "⚠️ Puede causar hipopotasemia e hipomagnesemia. Monitorizar electrolitos periódicamente si se usa con NE a largo plazo.",
    "levodopa": "⚠️ Las proteínas de la dieta pueden competir con su absorción. Ajustar tiempos de toma si el control motor fluctúa.",
    "warfarina": "⚠️ El contenido de Vitamina K de algunas fórmulas enterales puede interferir con el efecto anticoagulante. Mantener aporte constante.",
    "metformina": "⚠️ Puede causar déficit de B12 con uso prolongado. Considerar suplementación si existen signos clínicos.",
    "cloroquina": "⚠️ Puede causar hipoglicemia severa. Monitorizar glicemia capilar.",
    "ciprofloxacino": "⚠️ La absorción se reduce significativamente con productos lácteos o fórmulas enterales cálcicas. Suspender NE 2h antes/después."
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
// --- 4. INITIALIZATION & AUTH ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 SEDILE HRA: DOMContentLoaded initialized");
    checkUser();

    const btnLogin = document.getElementById('btnLoginGoogle');
    if (btnLogin) btnLogin.onclick = login;

    const btnLogoutHeader = document.getElementById('btnLogoutHeader');
    if (btnLogoutHeader) btnLogoutHeader.onclick = logout;

    const safelyInit = (fn, name) => {
        try { fn(); } catch (e) { console.error(`❌ Init Error (${name}):`, e); }
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
    safelyInit(initGlobalEvents, "GlobalEvents");
    safelyInit(initNutriIA, "NutriIA");
    safelyInit(initVoiceDictation, "VoiceDictation");
    safelyInit(initWardKanban, "WardKanban");

    updateFormulaSelect();
    initFormulaSearch();
    applyCircularFavicon();

    console.log("✅ Initialization complete. Formulas loaded:", AppState.formulas.length);

    // Force repopulating formulas after a delay
    setTimeout(() => {
        const sel = document.getElementById('formulaSelect');
        if (sel && sel.options.length <= 1) {
            console.warn("⚠️ Dropdown empty, retrying updateFormulaSelect...");
            updateFormulaSelect();
        }
    }, 1560);
});

async function applyCircularFavicon() {
    const faviconUrl = 'favicon.jpg';
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
        alert("⚠️ Error: Estás abriendo el archivo localmente (file://). Debes usar Vercel.");
        return;
    }

    if (!supabaseClient) {
        alert("🔴 Error Crítico: Supabase no se cargó. Revisa tu conexión a internet.");
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

async function logout() {
    // 1. Clear Supabase Session
    await supabaseClient.auth.signOut();

    // 2. Clear Local Storage
    localStorage.clear();
    sessionStorage.clear();

    // 3. Unregister Service Workers
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
        }
    }

    // 4. Clear ALL Caches
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
    }

    // 5. Force Hard Reload (Clean)
    window.location.replace(window.location.origin);
}

function showApp() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    const name = AppState.user.user_metadata.full_name || 'Usuario';
    const shortName = name.split(' ')[0]; // Take first name only for cleaner look
    document.getElementById('userNameDisplay').innerHTML = `Nutricionista <b>${name}</b>`;
}

function showLogin() {
    document.getElementById('auth-screen').style.display = 'grid';
    document.getElementById('main-app').style.display = 'none';
}

// --- 5. COMPACT UI LOGIC ---
function initCompactLayout() {
    const modeToggles = document.querySelectorAll('.mode-toggle');
    modeToggles.forEach(btn => {
        btn.onclick = () => {
            modeToggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.calcMode = btn.dataset.mode;
            updateInputLabels();
            runSimulation();
        };
    });
}

function updateInputLabels() {
    const lblDil = document.getElementById('lblDilution');
    const inputDil = document.getElementById('dilution');
    if (AppState.calcMode === 'grams') {
        lblDil.innerText = "Gramos Totales (g)";
        inputDil.placeholder = "Ej. 50";
    } else {
        lblDil.innerText = "Dilución (%)";
        inputDil.placeholder = "Ej. 13.5";
    }
}

// --- 6. MODALS ---
function initProtocolModal() {
    const modal = document.getElementById('protocolModal');
    const btnOpen = document.getElementById('btnProtocolOpen');
    const btnClose = document.getElementById('btnProtocolClose');
    if (btnOpen) btnOpen.onclick = () => modal.classList.add('active');
    if (btnClose) btnClose.onclick = () => modal.classList.remove('active');

    window.switchProtocolTab = (idx) => {
        document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
        document.getElementById('tab-infusion').style.display = idx === 0 ? 'block' : 'none';
        document.getElementById('tab-delivery').style.display = idx === 1 ? 'block' : 'none';
    };
}

function initHistoryModal() {
    const modal = document.getElementById('historyModal');
    const btnOpen = document.getElementById('btnOpenHistory');
    const btnClose = document.getElementById('btnHistoryClose');
    if (btnOpen) btnOpen.onclick = () => {
        modal.classList.add('active');
        loadHistoryList(); // Changed from loadHistory to loadHistoryList
    };
    if (btnClose) btnClose.onclick = () => modal.classList.remove('active');
}

// --- 7. PATIENT & HISTORY LOGIC ---
function initPatientLogic() {
    const fields = ['nombre', 'edad', 'sexo', 'peso', 'estatura', 'actividad'];
    fields.forEach(f => {
        const el = document.getElementById(f);
        if (el) el.oninput = calculateRequirements;
    });

    const form = document.getElementById('form-paciente');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = `<span>⏳</span> Guardando...`;

            try {
                const nombre = document.getElementById('nombre').value;
                const edad = parseInt(document.getElementById('edad').value) || 0;
                const peso = parseFloat(document.getElementById('peso').value) || 0;
                const estatura = parseFloat(document.getElementById('estatura').value) || 0;
                const sexo = document.getElementById('sexo').value;
                const actividad = parseFloat(document.getElementById('actividad').value) || 1.2;
                const diagnostico = document.getElementById('diagnostico')?.value || '';
                const cama = document.getElementById('cama')?.value || '';
                const tmt = parseFloat(document.getElementById('goalTotal').value) || 0;

                // FULL STATE PERSISTENCE V3.51
                const metadata = {
                    simulator: {
                        formula: document.getElementById('formulaSelect').value,
                        volume: document.getElementById('volume').value,
                        dilution: document.getElementById('dilution').value,
                        goal_total: tmt,
                        macro_mode: macroGoalMode || 'gkg',
                        goal_prot: document.getElementById('goalProtKg').value,
                        goal_cho: document.getElementById('goalCHOKg').value,
                        goal_lip: document.getElementById('goalLipKg').value,
                        modules: {
                            nessucar: document.getElementById('modNessucar').value,
                            mct: document.getElementById('modMCT').value,
                            enterex: document.getElementById('modEnterex').value,
                            banatrol: document.getElementById('modBanatrol').value,
                            proteinex: document.getElementById('modProteinex').value,
                            fresubin: document.getElementById('modFresubin').value
                        }
                    },
                    assessment: {
                        cintura: document.getElementById('ccintura').value,
                        braquial: document.getElementById('cbraquial').value,
                        pantorrilla: document.getElementById('cpantorrilla').value,
                        atr: document.getElementById('altrodilla').value,
                        pliegues: {
                            pt: document.getElementById('ptricipital').value,
                            pb: document.getElementById('pbicipital').value,
                            ps: document.getElementById('piliaco').value,
                            pa: document.getElementById('pabdominal').value
                        },
                        talla: {
                            mediaenv: document.getElementById('mediaenv').value,
                            envcomp: document.getElementById('envcomp').value
                        },
                        edema: document.getElementById('edemaGrade').value,
                        exams: Array.from(document.querySelectorAll('#examsContainer .exam-row')).map(row => {
                            const inputs = row.querySelectorAll('input');
                            return { date: inputs[0].value, type: inputs[1].value, res: inputs[2].value };
                        }),
                        cribaje: {
                            nrs: document.getElementById('nrs2002').value,
                            vgs: document.getElementById('vgs').value
                        },
                        gi: {
                            residuo: document.getElementById('residuo').value,
                            diarrea: document.getElementById('diarrea').value,
                            distension: document.getElementById('distension').value
                        },
                        pes: document.getElementById('diagnosticoPES').value
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
                    showToast("✅ Ficha completa guardada en historial");
                    loadHistoryList(); // Changed from loadHistory to loadHistoryList
                    btn.innerHTML = `<span>✔</span> ¡Guardado!`;
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
    // Update tabs
    const tabActivos = document.getElementById('tabHistActivos');
    const tabPapelera = document.getElementById('tabHistPapelera');
    if (tabActivos) tabActivos.classList.toggle('active', !showPapelera);
    if (tabPapelera) tabPapelera.classList.toggle('active', showPapelera);

    const list = document.getElementById('patientListContainer');
    if (!list) return;

    list.innerHTML = '<p style="text-align:center;">Cargando historial...</p>';

    const { data: records, error } = await supabaseClient
        .from('pacientes')
        .select('*, metadata') // Select everything to maintain chart support and metadata for deletion
        .eq('user_id', AppState.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        list.innerHTML = '<p>Error cargando historial.</p>';
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
                // Fallback simulating from created date if no deleted_at metadata
                const diffTime = Math.abs(now - new Date(r.created_at));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                daysLeft = 30 - diffDays;
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

    // Draw Chart for the most recent active patient name
    const chartContainerE = document.getElementById('chartContainer');
    if (!showPapelera && showRecords.length > 0) {
        const topPatient = showRecords[0];
        const history = records.filter(p => p.nombre === topPatient.nombre && p.estado_sala !== 'eliminado').slice(0, 5).reverse();

        if (chartContainerE) {
            if (history.length > 1) {
                chartContainerE.style.display = 'block';
                renderEvolutionChart(history);
            } else {
                chartContainerE.style.display = 'none';
            }
        }
    } else if (chartContainerE) {
        chartContainerE.style.display = 'none';
    }

    if (showRecords.length === 0) {
        list.innerHTML = `<p style="text-align:center; opacity:0.6;">${showPapelera ? 'La papelera está vacía.' : 'Ningún registro guardado aún.'}</p>`;
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
                        <button class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem; background:#27ae60;" onclick="window.restorePatient('${r.id}')">↩️ Restaurar</button>
                        <button class="btn-micro" style="padding: 6px; font-size: 0.9rem; background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid #e74c3c; border-radius: 8px;" onclick="event.stopPropagation(); window.hardDeletePatient('${r.id}')" title="Eliminar definitivamente">🗑️</button>
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
                        <button class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="loadPatient('${r.id}')">📂 Cargar</button>
                        <button class="btn-micro" style="padding: 6px; font-size: 0.9rem; background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid #e74c3c; border-radius: 8px;" onclick="event.stopPropagation(); window.deletePatient('${r.id}')" title="Mover a papelera">🗑️</button>
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
        // Enforce exclusion of discharged patients here since we fetched all
        if (p.estado_sala === 'de_alta') return;

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
                alertBadge += `<span style="background:#e74c3c; color:white; padding:2px 6px; border-radius:10px; font-size:0.6rem; margin-right:5px;">⚠️ Sonda > 30d</span>`;
            }
        }

        // Fast Check Weight drop (simulate if multiple histories exist but for now simple badge)
        if (p.requiere_atencion) {
            alertBadge += `<span style="background:#f39c12; color:white; padding:2px 6px; border-radius:10px; font-size:0.6rem;">⚠️ Revisar Peso</span>`;
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
                        🔍
                    </button>
                    <button onclick="event.stopPropagation(); window.togglePatientState('${p.id}', '${isCritico ? 'activo' : 'critico'}')" style="background:none; border:none; cursor:pointer; font-size:0.9rem;" title="Cambiar a ${isCritico ? 'En Curso' : 'Crítico'}">
                        ${isCritico ? '↩️' : '🚨'}
                    </button>
                    <button onclick="event.stopPropagation(); window.dischargePatient('${p.id}')" style="background:none; border:none; color:#27ae60; cursor:pointer;" title="Dar de Alta">
                        ✔️
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
    if (!confirm("El paciente se moverá a la papelera (permanecerá ahí 30 días antes de su eliminación automática). ¿Continuar?")) return;

    // Set state to 'eliminado' and inject deleted_at metadata
    const { data: p } = await supabaseClient.from('pacientes').select('metadata').eq('id', id).single();
    let meta = p?.metadata || {};
    meta.deleted_at = new Date().toISOString();

    const { error } = await supabaseClient.from('pacientes').update({
        estado_sala: 'eliminado',
        metadata: meta
    }).eq('id', id);

    if (error) {
        console.error("Error moviendo paciente a papelera:", error);
        alert("Error al eliminar: " + error.message);
    } else {
        if (typeof window.loadHistoryList === 'function') window.loadHistoryList(false);
        if (typeof loadWardKanban === 'function') loadWardKanban();
        // Clear inputs if currently loaded
        if (AppState.patient && AppState.patient.id === id) {
            AppState.patient.id = null;
            document.getElementById('nombre').value = "";
            document.getElementById('simGoal').innerText = "--";
            document.getElementById('valGET').innerText = "0 kcal";
        }
    }
};

window.hardDeletePatient = async (id) => {
    if (!confirm("🚨 ADVERTENCIA PÚBLICA: ¿Quieres eliminar PERMANENTEMENTE a este paciente de la base de datos de inmediato?")) return;
    const { error } = await supabaseClient.from('pacientes').delete().eq('id', id);
    if (!error) window.loadHistoryList(true);
};

window.restorePatient = async (id) => {
    // Return to generic 'activo' state
    const { error } = await supabaseClient.from('pacientes').update({ estado_sala: 'activo' }).eq('id', id);
    if (!error) window.loadHistoryList(true);
    if (typeof loadWardKanban === 'function') loadWardKanban();
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
            <div style="font-size:2.5rem; margin-bottom:5px;">🛌</div>
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

    // Filter unique latest per patient
    const activeMap = new Map();
    patients.forEach(p => {
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
                <td>${p.estado_sala === 'critico' ? '⚠️ CRÍTICO' : 'En Curso'}</td>
            </tr>
        `;
    });

    const reportHTML = `
        <div style="text-align:center; margin-bottom:20px; font-family:'Poppins', sans-serif;">
            <h2 style="margin:0; color:#333;">🏥 Reporte Entrega de Turno: SEDILE HRA</h2>
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
    const VERSION = "3.50";
    const padding = 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Axis
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    if (history.length < 2) return;

    // Normalize Data
    const weights = history.map(h => h.peso_kg);
    const maxW = Math.max(...weights) + 2;
    const minW = Math.min(...weights) - 2;
    const xStep = (width - 2 * padding) / (history.length - 1);

    const getY = (w) => height - padding - ((w - minW) / (maxW - minW) * (height - 2 * padding));

    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth = 3;
    history.forEach((h, i) => {
        const x = padding + i * xStep;
        const y = getY(h.peso_kg);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points
    ctx.fillStyle = '#8e44ad';
    history.forEach((h, i) => {
        const x = padding + i * xStep;
        const y = getY(h.peso_kg);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.fillText(h.peso_kg + 'kg', x - 10, y - 10);
        ctx.fillStyle = '#8e44ad';
    });
}

// Ensure initProtocolModal exists
function initProtocolModal() {
    const modal = document.getElementById('protocolModal');
    const btnOpen = document.getElementById('btnProtocolOpen');
    const btnClose = document.getElementById('btnProtocolClose');

    if (btnOpen && modal) {
        btnOpen.onclick = (e) => {
            e.preventDefault();
            modal.classList.add('active');
        };
    }
    if (btnClose && modal) {
        btnClose.onclick = () => {
            modal.classList.remove('active');
        };
    }

    // Modal tabs
    window.switchProtocolTab = (index) => {
        const tabs = modal.querySelectorAll('.tab-btn');
        const contents = modal.querySelectorAll('.tab-content');

        tabs.forEach((t, i) => {
            if (i === index) t.classList.add('active');
            else t.classList.remove('active');
        });

        contents.forEach((c, i) => {
            if (i === index) c.style.display = 'block';
            else c.style.display = 'none';
        });
    };
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
            if (typeof updateMacroGoals === 'function') updateMacroGoals();
        }

        document.getElementById('historyModal').classList.remove('active');
    }
};

function calculateRequirements() {
    const p = AppState.patient;
    const nombreEl = document.getElementById('nombre');
    const edadEl = document.getElementById('edad');
    const pesoEl = document.getElementById('peso');
    const estaturaEl = document.getElementById('estatura');
    const actividadEl = document.getElementById('actividad');
    const sexoEl = document.getElementById('sexo');

    if (!nombreEl || !edadEl || !pesoEl || !estaturaEl || !actividadEl || !sexoEl) return;

    p.nombre = nombreEl.value;
    p.edad = parseFloat(edadEl.value) || 0;
    p.peso = parseFloat(pesoEl.value) || 0;
    p.estatura = parseFloat(estaturaEl.value) || 0;
    p.actividad = parseFloat(actividadEl.value) || 1.2;
    const sexo = sexoEl.value;

    // NEW V3.19: Ideal Weight & IPT (Real-time)
    if (p.estatura > 0 && p.edad > 0) {
        const factorIdx = p.edad >= 65 ? 25.5 : 21.7;
        const pesoIdeal = factorIdx * (p.estatura * p.estatura);
        document.getElementById('valIdealWeight').innerText = pesoIdeal.toFixed(1) + ' kg';

        if (p.peso > 0) {
            const ipt = (p.peso / pesoIdeal) * 100;
            const iptVal = ipt.toFixed(1);
            document.getElementById('valIPT').innerText = iptVal + '%';

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

    if (p.peso > 0 && p.edad > 0) {
        // --- TMB (OMS/WHO) AUTOMATIC ---
        let bmr = 0;
        let method = document.getElementById('tmbMethod').value;
        const cm = p.estatura * 100;

        // FAO/OMS
        if (method === 'oms') {
            if (sexo === 'm') {
                if (p.edad < 3) bmr = (60.9 * p.peso) - 54;
                else if (p.edad < 10) bmr = (22.7 * p.peso) + 495;
                else if (p.edad < 18) bmr = (17.5 * p.peso) + 651;
                else if (p.edad < 30) bmr = (15.3 * p.peso) + 679;
                else if (p.edad < 60) bmr = (11.6 * p.peso) + 879;
                else bmr = (13.5 * p.peso) + 487;
            } else {
                if (p.edad < 3) bmr = (61.0 * p.peso) - 51;
                else if (p.edad < 10) bmr = (22.5 * p.peso) + 499;
                else if (p.edad < 18) bmr = (12.2 * p.peso) + 746;
                else if (p.edad < 30) bmr = (14.7 * p.peso) + 496;
                else if (p.edad < 60) bmr = (8.7 * p.peso) + 829;
                else bmr = (10.5 * p.peso) + 596;
            }
        }
        // Harris-Benedict (Original 1919 or Revised 1984 - typical clinical use is Roza/Shizgal 1984)
        else if (method === 'hb') {
            if (sexo === 'm') {
                bmr = 88.362 + (13.397 * p.peso) + (4.799 * cm) - (5.677 * p.edad);
            } else {
                bmr = 447.593 + (9.247 * p.peso) + (3.098 * cm) - (4.330 * p.edad);
            }
        }
        // Schofield (1985)
        else if (method === 'schofield') {
            if (sexo === 'm') {
                if (p.edad < 3) bmr = (0.167 * p.peso) + (15.174 * p.estatura) - 0.6176;
                else if (p.edad < 10) bmr = (19.59 * p.peso) + (130.3 * p.estatura) + 414.9;
                else if (p.edad < 18) bmr = (16.25 * p.peso) + (137.2 * p.estatura) + 515.5;
                else if (p.edad < 30) bmr = (15.057 * p.peso) + (692.6 * p.estatura) + 655.8; // Changed slightly due to units, standard is W+H
                else if (p.edad < 60) bmr = (11.472 * p.peso) + (873.1 * p.estatura) + 864; // Approximation
                else bmr = (11.711 * p.peso) + (587.7 * p.estatura) + 597;
            } else {
                // Females roughly
                if (p.edad < 3) bmr = (16.25 * p.peso) + (1023.2 * p.estatura) - 413.5;
                else if (p.edad < 10) bmr = (16.969 * p.peso) + (161.8 * p.estatura) + 371.2;
                else if (p.edad < 18) bmr = (8.365 * p.peso) + (465 * p.estatura) + 200;
                else if (p.edad < 30) bmr = (13.623 * p.peso) + (283 * p.estatura) + 98;
                else if (p.edad < 60) bmr = (10.996 * p.peso) + (207.4 * p.estatura) + 795;
                else bmr = (9.082 * p.peso) + (305.6 * p.estatura) + 746;
            }
        }
        // Mifflin-St Jeor
        else if (method === 'msj') {
            if (sexo === 'm') {
                bmr = (10 * p.peso) + (6.25 * cm) - (5 * p.edad) + 5;
            } else {
                bmr = (10 * p.peso) + (6.25 * cm) - (5 * p.edad) - 161;
            }
        }

        const resTMB = document.getElementById('resTMB');
        if (resTMB) resTMB.innerText = `${Math.round(bmr * p.actividad)} kcal (TMBxFA)`;
        p.tmt_calculated = bmr * p.actividad;

        // Ensure factorial is also calculated
        calcFactorialNoRecursion();

        // Update Official GET Based on Selection
        window.updateSelectedGET();

        calcHydration();
        runSimulation();
    }
}

function calcFactorialNoRecursion() {
    const p = AppState.patient;
    const fKcal = parseFloat(document.getElementById('factorKcal')?.value) || 25;
    if (p.peso > 0) {
        const factTotal = p.peso * fKcal;
        p.factorial_calculated = factTotal;
        const resF = document.getElementById('resFactorial');
        if (resF) resF.innerText = `${Math.round(factTotal)} kcal`;
    }
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
function initSimulatorLogic() {
    const vol = document.getElementById('volume');
    const dil = document.getElementById('dilution');
    const btnSave = document.getElementById('btnSaveHistory');

    if (vol) vol.oninput = runSimulation;
    if (dil) dil.oninput = runSimulation;
    if (btnSave) btnSave.onclick = savePrescription;

    // Trigger update on any module/oral/iv input change
    document.querySelectorAll('.input-module, .input-oral, .input-iv, #ivType').forEach(inp => {
        inp.addEventListener('input', runSimulation);
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
}

function checkFavoriteStatus() {
    const fId = document.getElementById('formulaSelect').value;
    const btn = document.getElementById('btnToggleFav');
    if (!btn) return;

    if (AppState.favorites.includes(fId)) {
        btn.innerText = '⭐';
        btn.style.background = 'gold';
        btn.style.color = 'white';
        btn.style.borderColor = 'gold';
    } else {
        btn.innerText = '☆';
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
        console.warn("⚠️ AppState.formulas empty, reloading from LOCAL_FORMULAS...");
        AppState.formulas = [...LOCAL_FORMULAS];
    } else {
        // Ensure all local ones are present (V3.26 Force sync)
        if (AppState.formulas.length < LOCAL_FORMULAS.length) {
            AppState.formulas = [...LOCAL_FORMULAS];
        }
    }

    const selects = [
        document.getElementById('formulaSelect'),
        document.getElementById('formulaSelectB')
    ];

    // Sort logic: Favorites first, then by Category
    const normalizedFilter = filter.toLowerCase().trim();

    const sortedFormulas = [...AppState.formulas]
        .filter(f => !normalizedFilter || f.name.toLowerCase().includes(normalizedFilter) || f.cat.toLowerCase().includes(normalizedFilter))
        .sort((a, b) => {
            const aFav = AppState.favorites.includes(a.id);
            const bFav = AppState.favorites.includes(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });

    const cats = [...new Set(sortedFormulas.map(i => i.cat))];

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
                const star = AppState.favorites.includes(item.id) ? '⭐ ' : '';
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

function renderFormulaInputs(formula) {
    const wrapper = document.getElementById('dilutionWrapper');
    const container = document.getElementById('recipeInputsContainer');
    const baseDilInput = document.getElementById('dilution');

    if (!formula) {
        if (wrapper) wrapper.style.display = 'block';
        if (container) container.style.display = 'none';
        return;
    }

    if (formula.type === 'recipe') {
        if (wrapper) wrapper.style.display = 'none';
        if (container) {
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';

            let html = '';
            formula.recipe.forEach((rec) => {
                html += `
                    <div class="input-group" style="flex: 1; min-width: 100px; margin-bottom: 0;">
                        <label style="font-size:0.75rem; color:#2c3e50; line-height:1.1;">${rec.name} (%)</label>
                        <input type="number" id="rec_${rec.id}" value="${rec.defPct}" oninput="runSimulation()">
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    } else {
        if (wrapper) wrapper.style.display = 'block';
        if (container) container.style.display = 'none';
        // Auto-fill standard dilution if present
        if (formula.stdDil && baseDilInput) {
            baseDilInput.value = formula.stdDil;
        }
    }
}

function runSimulation() {
    const fId = document.getElementById('formulaSelect').value;
    const formula = AppState.formulas.find(f => f.id === fId);
    if (!formula) return;

    const v1 = parseFloat(document.getElementById('volume').value) || 0;
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;

    let k = 0, p = 0, c = 0, l = 0;

    if (AppState.calcMode === 'vol') {
        const vol = v1;
        if (formula.type === 'recipe') {
            // RECETAS DINÁMICAS (Dynamic Recipes)
            formula.recipe.forEach(rec => {
                const el = document.getElementById('rec_' + rec.id);
                const dil = el ? (parseFloat(el.value) || 0) : rec.defPct;
                const grams = vol * (dil / 100);
                k += rec.k * (grams / 100);
                p += rec.p * (grams / 100);
                c += rec.c * (grams / 100);
                l += rec.f * (grams / 100);
            });
        } else if (formula.type === 'p') {
            // Polvos (Powders): Volumen * (Dilucion / 100) = Gramos
            const dil = v2 > 0 ? v2 : (formula.stdDil || 0);
            const grams = vol * (dil / 100);
            k = formula.k * (grams / 100);
            p = formula.p * (grams / 100);
            c = formula.c * (grams / 100);
            l = formula.f * (grams / 100);
        } else {
            // Líquidos o Fórmulas SEDILE listas: Volumen base.
            let scl = 1;
            // Si la fórmula tiene dilución estándar (ej F1 al 13%), calculamos su escala comparado a la estándar
            if (formula.stdDil && v2 > 0) {
                scl = v2 / formula.stdDil;
            }
            k = formula.k * (vol / 100) * scl;
            p = formula.p * (vol / 100) * scl;
            c = formula.c * (vol / 100) * scl;
            l = formula.f * (vol / 100) * scl;
        }
    } else {
        const grams = v2;
        if (formula.type === 'recipe') {
            // Si usan modo gramos con una receta armada, distribuimos proporcionalmente
            let totalDefPct = formula.recipe.reduce((sum, r) => sum + r.defPct, 0) || 1;
            formula.recipe.forEach(rec => {
                let compGrams = grams * (rec.defPct / totalDefPct);
                k += rec.k * (compGrams / 100);
                p += rec.p * (compGrams / 100);
                c += rec.c * (compGrams / 100);
                l += rec.f * (compGrams / 100);
            });
        } else {
            k = formula.k * (grams / 100);
            p = formula.p * (grams / 100);
            c = formula.c * (grams / 100);
            l = formula.f * (grams / 100);
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

    // Animation: Count Up Numbers
    animateValue("valKcal", Math.round(k));
    animateValue("valProt", p.toFixed(1));
    animateValue("valCHO", c.toFixed(1));
    animateValue("valLip", l.toFixed(1));
    animateValue("simCurrent", Math.round(k));

    const goal = parseFloat(document.getElementById('goalTotal').value) || 2000;
    document.getElementById('simBar').style.width = Math.min((k / goal) * 100, 100) + '%';

    // Animation: Stacked Bar (New)
    const totalMacross = p + c + l;
    if (totalMacross > 0) {
        const pPct = (p / totalMacross) * 100;
        const cPct = (c / totalMacross) * 100;
        const lPct = (l / totalMacross) * 100;

        document.getElementById('barProt').style.width = pPct + "%";
        document.getElementById('barCHO').style.width = cPct + "%";
        document.getElementById('barLip').style.width = lPct + "%";
    } else {
        document.getElementById('barProt').style.width = "0%";
        document.getElementById('barCHO').style.width = "0%";
        document.getElementById('barLip').style.width = "0%";
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

    // Use AppState.officialGET for kcal goal
    const officialKcalGoal = AppState.officialGET || parseFloat(document.getElementById('goalTotal').value) || 2000;

    if (adeqCard) {
        if (officialKcalGoal > 0 || goalP > 0 || goalC > 0 || goalL > 0) {
            adeqCard.style.display = 'block';

            // Kcal Adequacy
            if (officialKcalGoal > 0) {
                const pctK = (k / officialKcalGoal) * 100;
                adeqKcal.innerText = Math.round(pctK) + "%";
                adeqKcal.style.color = (pctK < 90) ? '#e67e22' : (pctK > 110) ? '#e74c3c' : '#27ae60';
            } else { adeqKcal.innerText = "--"; adeqKcal.style.color = '#888'; }

            // Prot Adequacy
            if (goalP > 0) {
                const pctP = (p / goalP) * 100;
                adeqProt.innerText = Math.round(pctP) + "%";
                adeqProt.style.color = (pctP < 90) ? '#e67e22' : (pctP > 110) ? '#e74c3c' : '#27ae60';
            } else { adeqProt.innerText = "--"; adeqProt.style.color = '#888'; }

            // CHO Adequacy
            if (goalC > 0) {
                const pctC = (c / goalC) * 100;
                adeqCHO.innerText = Math.round(pctC) + "%";
                adeqCHO.style.color = (pctC < 90) ? '#e67e22' : (pctC > 110) ? '#e74c3c' : '#27ae60';
            } else { adeqCHO.innerText = "--"; adeqCHO.style.color = '#888'; }

            // Lip Adequacy
            if (goalL > 0) {
                const pctL = (l / goalL) * 100;
                adeqLip.innerText = Math.round(pctL) + "%";
                adeqLip.style.color = (pctL < 90) ? '#e67e22' : (pctL > 110) ? '#e74c3c' : '#27ae60';
            } else { adeqLip.innerText = "--"; adeqLip.style.color = '#888'; }

        } else {
            // Hide card if no goals exist
            adeqCard.style.display = 'none';
        }
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
}

// --- 10. INFUSION CALCULATOR LOGIC (NEW) ---
function initInfusionLogic() {
    const rateInput = document.getElementById('infusionRate');
    const timeInput = document.getElementById('infusionStart');

    if (rateInput) rateInput.oninput = calcInfusion;
    if (timeInput) timeInput.oninput = calcInfusion;
}

function calcInfusion() {
    // Inputs
    const vol = parseFloat(document.getElementById('volume').value) || 0;
    const rate = parseFloat(document.getElementById('infusionRate').value) || 0;
    const startTimeStr = document.getElementById('infusionStart').value;

    const resBox = document.getElementById('infusionResultBox');
    const valEnd = document.getElementById('valEndTime');
    const valDur = document.getElementById('valDuration');

    if (vol > 0 && rate > 0 && startTimeStr) {
        resBox.style.display = 'block';

        // 1. Calculate Duration in Hours
        const durationHrs = vol / rate;

        // 2. Parse Start Time
        const [startH, startM] = startTimeStr.split(':').map(Number);

        // 3. Add Duration to Start Date object
        const now = new Date();
        now.setHours(startH, startM, 0, 0);

        // Add milliseconds (hours * 3600 * 1000)
        const endTimestamp = now.getTime() + (durationHrs * 3600 * 1000);
        const endDate = new Date(endTimestamp);

        // 4. Format Output
        const endH = endDate.getHours().toString().padStart(2, '0');
        const endM = endDate.getMinutes().toString().padStart(2, '0');

        // Check if next day
        const dayDiff = endDate.getDate() - now.getDate();
        let dayLabel = "";
        if (dayDiff > 0) dayLabel = " (+1 día)";

        valEnd.innerText = `${endH}:${endM}${dayLabel}`;

        // Format duration for display (e.g. 20.5 hrs -> 20h 30m)
        const hrs = Math.floor(durationHrs);
        const mins = Math.round((durationHrs - hrs) * 60);
        valDur.innerText = `(${hrs}h ${mins}m)`;

    } else {
        resBox.style.display = 'none';
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
    showToast("✨ Formulario reseteado para nuevo paciente");
}

function calcHydration() {
    const p = AppState.patient;
    const vol = parseFloat(document.getElementById('volume').value) || 0;
    const dil = (parseFloat(document.getElementById('dilution').value) || 100) / 100;
    let realVol = vol * dil; // Effective volume from formula

    // NEW V3.60: Add Oral Water and IV Volume to Real Volume
    const oralWater = parseFloat(document.getElementById('oralWater').value) || 0;
    const ivVol = parseFloat(document.getElementById('ivVolume').value) || 0;

    realVol += oralWater + ivVol;

    if (p.peso <= 0) return;

    let req = 0;
    const isMlKg = document.querySelector('input[name="hydMethod"][value="mlkg"]').checked;

    if (isMlKg) {
        const factor = parseFloat(document.getElementById('hydFactor').value) || 0;
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
                const star = AppState.favorites.includes(f.id) ? '⭐ ' : '';
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
        console.warn("📊 Chart.js not loaded yet or blocked. Skipping chart init.");
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

    const v1 = parseFloat(document.getElementById('volume').value) || 0;
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;

    let k2 = 0, p2 = 0, c2 = 0, l2 = 0;

    if (AppState.calcMode === 'vol') {
        k2 = formulaB.k * (v1 / 100);
        p2 = formulaB.p * (v1 / 100);
        c2 = formulaB.c * (v1 / 100);
        l2 = formulaB.f * (v1 / 100);
    } else {
        k2 = formulaB.k * (v2 / 100);
        p2 = formulaB.p * (v2 / 100);
        c2 = formulaB.c * (v2 / 100);
        l2 = formulaB.f * (v2 / 100);
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
        const c2 = AppState.calcMode === 'vol' ? formulaB.c * (v1 / 100) : formulaB.c * (v2 / 100);
        const l2 = AppState.calcMode === 'vol' ? formulaB.f * (v1 / 100) : formulaB.f * (v2 / 100);

        const calP = p2 * 4;
        const calC = c2 * 4;
        const calL = l2 * 9;
        const totalCal = calP + calC + calL || 1;

        document.getElementById('barProtB').style.width = (calP / totalCal * 100) + "%";
        document.getElementById('barCHOB').style.width = (calC / totalCal * 100) + "%";
        document.getElementById('barLipB').style.width = (calL / totalCal * 100) + "%";
    }
}

// --- 15. COMPLETE ASSESSMENT LOGIC (NEW) ---
function initAssessmentLogic() {
    // Name Sync
    const nameInput = document.getElementById('nombre');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const val = e.target.value;
            const patientBadge = document.getElementById('currentPatientName');
            if (patientBadge) patientBadge.innerText = val || 'Nuevo Paciente';
        });
    }

    // Evolution Logic (Auxiliary Tool) V3.18
    const inpGoalKcal = document.getElementById('goalKcalBox');
    const inpGoalTotal = document.getElementById('goalTotal');
    const resEvoBadge = document.getElementById('evolutionResult');
    const lastGoalLabel = document.getElementById('valLastGoalDate');

    // Load last goal date from storage
    if (localStorage.getItem('sedile_last_goal_date') && lastGoalLabel) {
        lastGoalLabel.innerText = `Ultima meta: ${localStorage.getItem('sedile_last_goal_date')}`;
    }

    if (inpGoalKcal) {
        inpGoalKcal.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            const weight = parseFloat(document.getElementById('peso').value) || 0;
            const total = Math.round(val * weight);

            if (resEvoBadge) {
                resEvoBadge.innerHTML = `<b>${total}</b> kcal/día`;
                resEvoBadge.style.color = "#8e44ad";
            }

            // NEW V3.26: Sync with Total Goal input
            if (inpGoalTotal) {
                inpGoalTotal.value = total;
                // Trigger simulator update
                AppState.userOverridesGoal = true;
                const simGoalBadge = document.getElementById('simGoal');
                if (simGoalBadge) simGoalBadge.innerText = total;
                runSimulation();
            }
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
            if (lastGoalLabel) lastGoalLabel.innerText = `Ultima meta: ${today}`;
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
        if (lblAG && ama > 0) lblAG.innerHTML = `<span style="color:${resAG.color}; font-size:1rem;">${resAG.status}</span><br><small style="color:#888; font-weight:400;">AG: ${ama.toFixed(1)} cm²</small>`;
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
    const tabs = document.querySelectorAll('.tab-btn');
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
    if (selEdema) selEdema.onchange = calcDryWeight;

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

    // Clinical Note Generator V3.50
    const btnNote = document.getElementById('btnGenerateNote');
    if (btnNote) btnNote.onclick = function () {
        const container = document.getElementById('clinicalNoteContainer');
        const content = document.getElementById('noteContent');
        if (!container || !content) return;

        const p = AppState.patient;
        if (!p) { alert("Selecciona un paciente primero."); return; }

        const fId = document.getElementById('formulaSelect').value;
        const formula = AppState.formulas.find(f => f.id === fId);
        const vol = parseFloat(document.getElementById('volume').value) || 0;
        const goal = parseFloat(document.getElementById('goalTotal').value) || 0;

        // Modules info
        let modulesText = "";
        const mods = ["Nessucar", "MCT", "Enterex", "Banatrol", "Proteinex", "Fresubin"];
        mods.forEach(m => {
            const val = parseFloat(document.getElementById('mod' + m).value) || 0;
            if (val > 0) modulesText += `${m}: ${val}${m === "MCT" ? "ml" : "g"}, `;
        });

        const tableHTML = `
            <table style="width:100%; border-collapse:collapse; margin-bottom:15px; border:1px solid #eee;">
                <tr style="background:#f9f9f9;">
                    <th style="padding:8px; border:1px solid #eee; text-align:left;">Parámetro</th>
                    <th style="padding:8px; border:1px solid #eee; text-align:left;">Dato</th>
                </tr>
                <tr><td style="padding:8px; border:1px solid #eee;">Peso Actual</td><td style="padding:8px; border:1px solid #eee;">${p.weight} kg</td></tr>
                <tr><td style="padding:8px; border:1px solid #eee;">Meta Kcal</td><td style="padding:8px; border:1px solid #eee;">${goal} kcal/día</td></tr>
                <tr><td style="padding:8px; border:1px solid #eee;">Prescripción</td><td style="padding:8px; border:1px solid #eee;">${formula ? formula.name : 'N/A'} - ${vol} ml</td></tr>
                ${modulesText ? `<tr><td style="padding:8px; border:1px solid #eee;">Módulos</td><td style="padding:8px; border:1px solid #eee;">${modulesText.slice(0, -2)}</td></tr>` : ''}
            </table>
        `;

        const des = document.getElementById('diagnosticoPES').value || "(Sin diagnóstico ingresado)";
        const textHTML = `<p><strong>Evolución Nutricional:</strong> Paciente bajo control de Nutrición. Meta calórica de ${goal} kcal/día (${(goal / p.weight).toFixed(1)} kcal/kg).
            Prescripción actual: ${formula ? formula.name : '---'} en volumen de ${vol}ml. ${modulesText ? `Reforzado con módulos: ${modulesText.slice(0, -2)}.` : ''}</p>
            <p><strong>Diagnóstico/PES:</strong> ${des}</p>`;

        content.innerHTML = tableHTML + textHTML;
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    };

    // Copy Button
    const btnCopy = document.getElementById('btnCopyNote');
    if (btnCopy) btnCopy.onclick = () => {
        const text = document.getElementById('noteContent').innerText;
        navigator.clipboard.writeText(text).then(() => alert("Nota clínica copiada al portapapeles."));
    };

    // Module Input Watcher
    document.querySelectorAll('.input-module').forEach(inp => {
        inp.oninput = updateSimulator;
    });

}


// Global helper for Factorial
function calcFactorial() {
    const inpFactor = document.getElementById('factorKcal');
    if (!inpFactor) return;

    const f = parseFloat(inpFactor.value) || 0;
    const p = AppState.patient.peso || parseFloat(document.getElementById('peso').value) || 0;
    const res = Math.round(f * p);

    const resBadge = document.getElementById('resFactorial');
    if (resBadge) resBadge.innerText = `${res} kcal`;
}

function calcTMB_OMS() {
    const p = AppState.patient;
    const method = document.getElementById('tmbMethod').value;
    const sexo = document.getElementById('sexo').value;
    const age = p.edad || parseFloat(document.getElementById('edad').value) || 0;
    const weight = p.peso || parseFloat(document.getElementById('peso').value) || 0;
    const height = p.estatura || parseFloat(document.getElementById('estatura').value) || 0;

    if (age <= 0 || weight <= 0) return;

    let tmb = 0;

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
        // Harris-Benedict revised
        if (sexo === 'm') {
            tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
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
    const p = AppState.patient;
    const grade = parseInt(document.getElementById('edemaGrade').value);
    if (!p.peso) return;

    // Grades: 0, 1, 3, 7, 10
    const dry = p.peso - grade;
    document.getElementById('valDryWeight').innerText = dry.toFixed(1);
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
        <button class="btn-row-del" onclick="this.parentElement.remove()" title="Eliminar examen">🗑️</button>
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

// --- NUTRI IA (🦦 V3.23) ---
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
        console.error("🔴 Error Nutri IA Detallado:", err);
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
let goalChartInstance = null;
let macroGoalMode = 'gkg'; // 'gkg' or 'pct'

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

            document.getElementById('macroPctProt').style.display = 'none';
            document.getElementById('macroPctCHO').style.display = 'none';
            document.getElementById('macroPctLip').style.display = 'none';
            document.getElementById('pctTotalWarning').style.display = 'none';

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

            updateMacroGoals();
        };
    }

    // GET Selector Logic
    const getSelector = document.getElementById('getSelector');
    if (getSelector) {
        getSelector.addEventListener('change', (e) => {
            const mode = e.target.value;
            const goalTotalEl = document.getElementById('goalTotal');

            if (mode === 'manual') return; // Do nothing, let user type

            let val = 0;
            if (mode === 'factorial') {
                const box = document.getElementById('goalKcalBox').value;
                const peso = AppState.patient.peso || 0;
                val = (parseFloat(box) || 0) * peso;
            } else if (mode === 'hb') {
                val = AppState.patient._tempHB || 0;
            } else if (mode === 'schofield') {
                val = AppState.patient._tempSchofield || 0;
            } else if (mode === 'fao') {
                val = AppState.patient._tempFAO || 0;
            }

            if (val > 0) {
                goalTotalEl.value = Math.round(val);
                // Dispatch input event to trigger downstream updates like runSimulation
                goalTotalEl.dispatchEvent(new Event('input'));
            }
        });
    }
}

function updateMacroGoals() {
    const peso = AppState.patient.peso || 0;
    const getTotal = parseFloat(document.getElementById('goalTotal')?.value) || 0;

    const valP = parseFloat(document.getElementById('goalProtKg')?.value) || 0;
    const valC = parseFloat(document.getElementById('goalCHOKg')?.value) || 0;
    const valL = parseFloat(document.getElementById('goalLipKg')?.value) || 0;

    let gProt = 0, gCHO = 0, gLip = 0;
    let pctP = 0, pctC = 0, pctL = 0;

    if (macroGoalMode === 'gkg') {
        gProt = valP * peso;
        gCHO = valC * peso;
        gLip = valL * peso;

        if (getTotal > 0) {
            pctP = ((gProt * 4) / getTotal) * 100;
            pctC = ((gCHO * 4) / getTotal) * 100;
            pctL = ((gLip * 9) / getTotal) * 100;
        }
    } else {
        // Mode: PCT
        if (getTotal > 0) {
            pctP = valP;
            pctC = valC;
            pctL = valL;

            gProt = (getTotal * (pctP / 100)) / 4;
            gCHO = (getTotal * (pctC / 100)) / 4;
            gLip = (getTotal * (pctL / 100)) / 9;
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
        document.getElementById('macroPctProt').innerText = `(${gkgP.toFixed(2)} g/kg)`;
        document.getElementById('macroPctCHO').innerText = `(${gkgC.toFixed(2)} g/kg)`;
        document.getElementById('macroPctLip').innerText = `(${gkgL.toFixed(2)} g/kg)`;

        // Show warning if total % != 100
        const totalPct = pctP + pctC + pctL;
        const warnLabel = document.getElementById('pctTotalWarning');
        const warnVal = document.getElementById('pctTotalVal');
        if (warnLabel && warnVal) {
            if (valP > 0 || valC > 0 || valL > 0) {
                if (Math.round(totalPct) !== 100) {
                    warnLabel.style.display = 'inline';
                    warnVal.innerText = totalPct.toFixed(1);
                } else {
                    warnLabel.style.display = 'none';
                }
            } else {
                warnLabel.style.display = 'none';
            }
        }
    }

    const kcalProt = gProt * 4;
    const kcalCHO = gCHO * 4;
    const kcalLip = gLip * 9;
    const totalKcal = kcalProt + kcalCHO + kcalLip;

    const elMacroKcal = document.getElementById('goalMacroKcal');
    if (elMacroKcal) elMacroKcal.innerText = Math.round(totalKcal);

    if (goalChartInstance) {
        goalChartInstance.data.datasets[0].data = [kcalProt, kcalCHO, kcalLip];
        goalChartInstance.update();
    }

    // Auto-update adequacy
    runSimulation();
}
