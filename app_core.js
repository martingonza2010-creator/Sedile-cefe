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
    { cat: "Leches HRA", id: "f1", name: "F1", type: "l", k: 67.9, p: 1.2, c: 7.6, f: 3.6 },
    { cat: "Leches HRA", id: "f2", name: "F2", type: "l", k: 68.0, p: 2.1, c: 8.2, f: 3.0 },
    { cat: "Leches HRA", id: "f3", name: "F3", type: "l", k: 65.5, p: 2.4, c: 8.5, f: 2.4 },
    { cat: "Leches HRA", id: "f4", name: "F4", type: "l", k: 98.6, p: 4.4, c: 8.7, f: 2.6 },
    { cat: "Leches HRA", id: "f5", name: "F5", type: "l", k: 66.5, p: 2.2, c: 7.7, f: 3.4 },
    { cat: "Leches HRA", id: "f7", name: "F7", type: "l", k: 71.0, p: 1.8, c: 7.6, f: 3.7 },
    { cat: "Leches HRA", id: "f8", name: "F8", type: "l", k: 32.6, p: 2.4, c: 3.6, f: 1.0 },
    { cat: "Leches HRA", id: "f9", name: "F9", type: "l", k: 72.8, p: 2.0, c: 7.3, f: 4.0 },
    { cat: "Leches HRA", id: "sl", name: "Sin Lactosa", type: "l", k: 71.3, p: 1.5, c: 8.3, f: 3.6 },
    { cat: "Leches HRA", id: "comfort", name: "Comfort", type: "l", k: 66.7, p: 1.3, c: 7.8, f: 3.4 },
    { cat: "Leches HRA", id: "pediasure", name: "Pediasure", type: "l", k: 92.8, p: 2.8, c: 12.1, f: 3.6 },
    { cat: "Leches HRA", id: "frebini", name: "Frebini", type: "l", k: 150.0, p: 3.8, c: 18.7, f: 6.7 },
    { cat: "Leches HRA", id: "pediasure_drink", name: "Pediasure Drink", type: "l", k: 100.0, p: 3.0, c: 13.1, f: 3.9 },
    { cat: "Leches HRA", id: "ensure_compact", name: "Ensure Compact", type: "l", k: 240.0, p: 10.2, c: 28.7, f: 9.4 },
    { cat: "Leches HRA", id: "e1", name: "E1", type: "l", k: 94.2, p: 3.5, c: 12.6, f: 3.1 },
    { cat: "Leches HRA", id: "e2", name: "E2", type: "l", k: 139.2, p: 6.1, c: 12.6, f: 3.1 },
    { cat: "Leches HRA", id: "e3", name: "E3", type: "l", k: 158.4, p: 6.1, c: 17.4, f: 3.1 },
    { cat: "Leches HRA", id: "g1", name: "G1", type: "l", k: 95.3, p: 4.3, c: 9.1, f: 3.5 },
    { cat: "Leches HRA", id: "g2", name: "G2", type: "l", k: 140.3, p: 6.9, c: 9.1, f: 3.5 },
    { cat: "Leches HRA", id: "g3", name: "G3", type: "l", k: 159.5, p: 6.9, c: 13.9, f: 3.5 },
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
    patient: { nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0 },
    formulas: LOCAL_FORMULAS,
    calcMode: 'vol',
    favorites: [], // Init empty first
    userOverridesGoal: false,
    compareMode: false,
    formulaB: null,
    chart: null
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

    initCompactLayout();
    initTabNavigation();
    initProtocolModal();
    initHistoryModal();
    initPatientLogic();
    initSimulatorLogic();
    initInfusionLogic();
    initHydrationLogic();
    initCompareLogic();
    initChartSim();
    initAssessmentLogic();
    initGlobalEvents();
    initNutriIA();

    updateFormulaSelect();
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
        loadHistory();
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
                const tmt = parseFloat(document.getElementById('goalTotal').value) || 0;

                const data = {
                    nombre,
                    edad,
                    peso_kg: peso,
                    estatura_m: estatura,
                    sexo,
                    actividad,
                    tmt,
                    user_id: AppState.user.id
                };

                const { error } = await supabaseClient.from('pacientes').insert([data]);

                if (!error) {
                    showToast("✅ Paciente guardado en historial");
                    loadHistory();
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
                alert("Error al guardar: " + err.message);
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

async function loadHistory() {
    const container = document.getElementById('historyContainer');
    container.innerHTML = '<p style="text-align:center; opacity:0.6;">Buscando tus pacientes...</p>';

    const { data, error } = await supabaseClient
        .from('pacientes')
        .select('*')
        .eq('user_id', AppState.user.id)
        .order('created_at', { ascending: false });

    if (error || !data.length) {
        container.innerHTML = '<p style="text-align:center; opacity:0.6;">Aún no tienes pacientes guardados.</p>';
        return;
    }

    // Draw Chart for the most recent patient name
    if (data.length > 0) {
        const topPatient = data[0];
        const history = data.filter(p => p.nombre === topPatient.nombre).slice(0, 5).reverse();

        if (history.length > 1) {
            document.getElementById('chartContainer').style.display = 'block';
            renderEvolutionChart(history);
        } else {
            document.getElementById('chartContainer').style.display = 'none';
        }
    }

    container.innerHTML += data.map(p => `
        <div class="history-item" onclick="loadPatient(${p.id})">
            <h4>${p.nombre}</h4>
            <div class="meta">
                <span>Peso: ${p.peso_kg}kg | Edad: ${p.edad}a</span>
                <span>${new Date(p.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

function renderEvolutionChart(history) {
    const canvas = document.getElementById('evolutionChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;

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

window.loadPatient = async (id) => {
    const { data } = await supabaseClient.from('pacientes').select('*').eq('id', id).single();
    if (data) {
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('edad').value = data.edad;
        document.getElementById('peso').value = data.peso_kg;
        document.getElementById('estatura').value = data.estatura_m;
        // Trigger calc
        calculateRequirements();
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

        const resTMB = document.getElementById('resTMB');
        if (resTMB) resTMB.innerText = `${Math.round(bmr)} kcal`;

        // Update Requerimiento Total
        if (!AppState.userOverridesGoal) {
            p.tmt = bmr * p.actividad;
            const goalTotalBox = document.getElementById('goalTotal');
            // const goalKcalBox = document.getElementById('goalKcalBox'); // REMOVED V3.21: Stop auto-overwrite

            if (goalTotalBox) goalTotalBox.value = Math.round(p.tmt);
            // if (goalKcalBox) goalKcalBox.value = (p.tmt / p.peso).toFixed(1); // REMOVED V3.21

            // Keep the automatic Evolution Badge update ONLY if the user hasn't typed manually yet
            // Actually, better to just clear it or leave it as TMB reference if needed, 
            // but user wants manual control. Let's just update the badge if the box is empty?
            // User request: "Evolución kcal/kg... no sea apenas coloque el peso... sino que yo coloque ejemplo 20"
            // So we DO NOT touch the box value. We DO NOT touch the badge unless user types.

            document.getElementById('simGoal').innerText = Math.round(p.tmt);
        }

        calcTMB_OMS();
        calcFactorial();
        calcHydration();
        runSimulation();
    }
}

// --- 8. SIMULATOR LOGIC ---
function initSimulatorLogic() {
    const vol = document.getElementById('volume');
    const dil = document.getElementById('dilution');
    const btnSave = document.getElementById('btnSaveHistory');

    if (vol) vol.oninput = runSimulation;
    if (dil) dil.oninput = runSimulation;
    if (btnSave) btnSave.onclick = savePrescription;

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

function updateFormulaSelect() {
    // AGGRESSIVE FALLBACK V3.21: Use LOCAL_FORMULAS if AppState is empty
    if (!AppState.formulas || AppState.formulas.length === 0) {
        console.warn("⚠️ AppState.formulas empty, reloading from LOCAL_FORMULAS...");
        AppState.formulas = [...LOCAL_FORMULAS];
    }

    const selects = [
        document.getElementById('formulaSelect'),
        document.getElementById('formulaSelectB')
    ];

    // Sort logic: Favorites first, then by Category
    const sortedFormulas = [...AppState.formulas].sort((a, b) => {
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

function runSimulation() {
    const fId = document.getElementById('formulaSelect').value;
    const formula = AppState.formulas.find(f => f.id === fId);
    if (!formula) return;

    const v1 = parseFloat(document.getElementById('volume').value) || 0;
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;

    let k = 0, p = 0, c = 0, l = 0;

    if (AppState.calcMode === 'vol') {
        const vol = v1;
        k = formula.k * (vol / 100);
        p = formula.p * (vol / 100);
        c = formula.c * (vol / 100);
        l = formula.f * (vol / 100);
    } else {
        const grams = v2;
        k = formula.k * (grams / 100);
        p = formula.p * (grams / 100);
        c = formula.c * (grams / 100);
        l = formula.f * (grams / 100);
    }

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

function calcHydration() {
    const p = AppState.patient;
    const vol = parseFloat(document.getElementById('volume').value) || 0;
    const dil = (parseFloat(document.getElementById('dilution').value) || 100) / 100;
    const realVol = vol * dil; // Effective volume

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

function updateCompareResults(k1, p1, c1, l1) {
    const fIdB = document.getElementById('formulaSelectB').value;
    const formulaB = AppState.formulas.find(f => f.id === fIdB);
    const box = document.getElementById('compareResult');

    if (!formulaB) {
        box.innerHTML = '';
        return;
    }

    const v1 = parseFloat(document.getElementById('volume').value) || 0;
    const v2 = parseFloat(document.getElementById('dilution').value) || 0;

    let k2 = 0, p2 = 0;

    // Calc Formula B stats (same mode)
    if (AppState.calcMode === 'vol') {
        k2 = formulaB.k * (v1 / 100);
        p2 = formulaB.p * (v1 / 100);
    } else {
        k2 = formulaB.k * (v2 / 100);
        p2 = formulaB.p * (v2 / 100);
    }

    const diffK = Math.round(k2 - k1);
    const diffP = (p2 - p1).toFixed(1);

    const badgeK = diffK > 0 ? `<span class="diff-badge diff-pos">+${diffK} kcal</span>` : `<span class="diff-badge diff-neg">${diffK} kcal</span>`;
    const badgeP = diffP > 0 ? `<span class="diff-badge diff-pos">+${diffP}g Prot</span>` : `<span class="diff-badge diff-neg">${diffP}g Prot</span>`;

    box.innerHTML = `Diferencia: ${badgeK} ${badgeP}`;
}

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

// --- 14. CHART LOGIC (NEW) ---
function initChartSim() {
    const ctx = document.getElementById('macroChart')?.getContext('2d');
    if (!ctx) return;

    AppState.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Prot', 'Carb', 'Líp'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#e67e22',
                    '#3498db',
                    '#f1c40f'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
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
        box.innerHTML = '';
        macroBox.innerHTML = '';
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

    // --- macro badges for B ---
    macroBox.innerHTML = `
            <div class="macro-badge-item p"><span>P</span><strong>${p2.toFixed(1)}g</strong></div>
            <div class="macro-badge-item c"><span>C</span><strong>${c2.toFixed(1)}g</strong></div>
            <div class="macro-badge-item f"><span>F</span><strong>${l2.toFixed(1)}g</strong></div>
        `;

    // --- differences ---
    const diffK = Math.round(k2 - k1);
    const diffP = (p2 - p1).toFixed(1);
    const diffC = (c2 - c1).toFixed(1);
    const diffL = (l2 - l1).toFixed(1);

    const getBadge = (val, unit) => {
        const isPos = parseFloat(val) >= 0;
        const sign = isPos ? '+' : '';
        return `<span class="diff-badge ${isPos ? 'diff-pos' : 'diff-neg'}">${sign}${val}${unit}</span>`;
    };

    box.innerHTML = `
            <div><b>Vs:</b> ${getBadge(diffK, ' kcal')}</div>
            <div style="display:flex; gap:5px; font-size:0.75rem;">
                ${getBadge(diffP, 'g P')} | ${getBadge(diffC, 'g C')} | ${getBadge(diffL, 'g F')}
            </div>
        `;

    // Update Secondary Stack Bar
    const stackSec = document.getElementById('stackCompare');
    if (stackSec) {
        stackSec.style.display = 'flex';
        setTimeout(() => { stackSec.style.opacity = '0.6'; stackSec.style.transform = 'translateY(18px)'; }, 50);

        // Calculate % relative to Kcal Total (approx) or same scale as primary
        // Primary scale: width% = (g * 4 / TotalKcal) * 100 ? No, usually stacked 100% of weight?
        // Let's us simple distribution % for bar width
        const totalK = k2 || 1;
        const pPct = ((p2 * 4) / totalK) * 100;
        const cPct = ((formulaB.c * (v1 / 100) * 4) / totalK) * 100; // approx
        // Actually simpler: Just copy the logic from updateStackBar but for B
        // We need 'c' and 'l' for formula B
        const c2 = AppState.calcMode === 'vol' ? formulaB.c * (v1 / 100) : formulaB.c * (v2 / 100);
        const l2 = AppState.calcMode === 'vol' ? formulaB.f * (v1 / 100) : formulaB.f * (v2 / 100);

        // Distribution
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
                resEvoBadge.style.color = "#8e44ad"; // Purple as requested
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

    // NEW V3.16: ROSS Estimation (Pediatrics)
    const rossInputs = ['altrodilla', 'cbraquial', 'edad', 'sexo'];
    rossInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcRoss);
    });
}

function calcRoss() {
    const atr = parseFloat(document.getElementById('altrodilla').value) || 0;
    const cb = parseFloat(document.getElementById('cbraquial').value) || 0;
    const age = parseFloat(document.getElementById('edad').value) || 0;
    const sex = document.getElementById('sexo').value;

    const resBox = document.getElementById('rossContainer');
    const badgeW = document.getElementById('valRossWeight');
    // const badgeH = document.getElementById('valRossHeight'); // Removed in V3.22
    const badgeDate = document.getElementById('valRossDate');

    if (atr > 0 || cb > 0) {
        if (resBox) resBox.style.display = 'block';

        let weight = 0;
        if (sex === 'f') weight = (2.37 * cb) + (1.64 * age) - 28.28;
        else weight = (2.54 * cb) + (1.82 * age) - 32.73;

        // Display in Input Field
        if (badgeW) badgeW.value = (weight > 0 ? weight : 0).toFixed(1) + ' kg';

        // Update Timestamp
        if (badgeDate) {
            const now = new Date();
            const timeStr = now.toLocaleDateString('es-CL') + ' ' + now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
            badgeDate.innerText = `Última act: ${timeStr}`;
        }

    } else {
        if (resBox) resBox.style.display = 'none';
    }
}

// --- 16. TAB NAVIGATION (NEW V3.7) ---
function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-section');

    tabs.forEach(tab => {
        tab.onclick = () => {
            const targetView = tab.dataset.view;
            console.log("Switching to tab:", targetView);

            // UI Update: Tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // UI Update: Views
            views.forEach(v => {
                v.classList.remove('active-view');
                v.style.display = 'none';
            });

            const activeView = document.getElementById(`view-${targetView}`);
            if (activeView) {
                activeView.style.display = 'block';
                // Trigger reflow for animation
                void activeView.offsetWidth;
                activeView.classList.add('active-view');
            }
        };
    });
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
        // Remove old listeners to be safe (though this is init)
        btnAddExam.onclick = null;
        btnAddExam.onclick = addExamRow;
    }

    // Nitrogen Logic
    const inpNUU = document.getElementById('valNUU');
    const inpNFactor = document.getElementById('valNFactor');
    const fnBN = () => calcNitrogenBalance();
    if (inpNUU) inpNUU.oninput = fnBN;
    if (inpNFactor) inpNFactor.oninput = fnBN;

    // Purpose Modal Logic
    const modPurpose = document.getElementById('purposeModal');
    if (modPurpose) {
        const btnOpen = document.getElementById('btnOpenPurpose');
        const btnClose = document.getElementById('btnPurposeClose');
        if (btnOpen) btnOpen.onclick = () => modPurpose.classList.add('active');
        if (btnClose) btnClose.onclick = () => modPurpose.classList.remove('active');
    }
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
const GEMINI_API_KEY = "AIzaSyClmI1-BQWQejRurf02zYPgxMax0DKZ9lg";

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
    } catch (err) {
        console.error("Error Nutri IA:", err);
        alert("Error al conectar con la Nutri IA. Verifica tu conexión.");
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
            ross: document.getElementById('valRossWeight')?.value
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

