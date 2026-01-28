// --- SEDILE HRA V2.5 AUTH FIX - Build 20260128-1748 ---
// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://qibkmvtbgauobedtjapg.supabase.co';
const supabaseKey = 'sb_publishable_xCxGjcAngmfd0hJYv2uphg_yB-pF3Hp';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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
    { cat: "Fórmulas RTH", id: "ensure_clinical_rth", name: "Ensure Clinical (RTH)", type: "l", k: 149.2, p: 8.0, c: 18.0, f: 4.8 }
];

// --- 3. GLOBAL STATE ---
const AppState = {
    user: null,
    patient: { nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0 },
    formulas: LOCAL_FORMULAS,
    calcMode: 'vol'
};

// --- 4. INITIALIZATION & AUTH ---
document.addEventListener('DOMContentLoaded', async () => {
    checkUser();

    document.getElementById('btnLoginGoogle').onclick = login;
    document.getElementById('btnLogout').onclick = logout;

    initCompactLayout();
    initProtocolModal();
    initHistoryModal();
    initPatientLogic();
    initSimulatorLogic();
    updateFormulaSelect();
    applyCircularFavicon();
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
    await supabaseClient.auth.signOut();
    window.location.reload();
}

function showApp() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    document.getElementById('userNameDisplay').innerText = `Nutricionista: ${AppState.user.user_metadata.full_name || 'Dr.'}`;
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
            const btn = form.querySelector('button');
            btn.innerText = "Guardando...";

            const data = {
                nombre: document.getElementById('nombre').value,
                edad: parseInt(document.getElementById('edad').value) || 0,
                peso_kg: parseFloat(document.getElementById('peso').value) || 0,
                estatura_m: parseFloat(document.getElementById('estatura').value) || 0,
                user_id: AppState.user.id
            };

            const { error } = await supabaseClient.from('pacientes').insert([data]);
            btn.innerText = error ? "Error" : "Guardado";
            setTimeout(() => btn.innerText = "Guardar", 2000);
        };
    }
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

    container.innerHTML = data.map(p => `
        <div class="history-item" onclick="loadPatient(${p.id})">
            <h4>${p.nombre}</h4>
            <div class="meta">
                <span>Peso: ${p.peso_kg}kg | Edad: ${p.edad}a</span>
                <span>${new Date(p.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

window.loadPatient = async (id) => {
    const { data } = await supabaseClient.from('pacientes').select('*').eq('id', id).single();
    if (data) {
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('edad').value = data.edad;
        document.getElementById('peso').value = data.peso_kg;
        document.getElementById('estatura').value = data.estatura_m;
        calculateRequirements();
        document.getElementById('historyModal').classList.remove('active');
    }
};

function calculateRequirements() {
    const p = AppState.patient;
    p.nombre = document.getElementById('nombre').value;
    p.edad = parseFloat(document.getElementById('edad').value) || 0;
    p.peso = parseFloat(document.getElementById('peso').value) || 0;
    p.estatura = parseFloat(document.getElementById('estatura').value) || 0;
    p.actividad = parseFloat(document.getElementById('actividad').value) || 1.2;

    if (p.peso > 0 && p.estatura > 0) {
        p.bmi = p.peso / (p.estatura * p.estatura);
        document.getElementById('valBMI').innerText = p.bmi.toFixed(1);
    }

    if (p.peso > 0 && p.estatura > 0 && p.edad > 0) {
        let bmr = (10 * p.peso) + (6.25 * (p.estatura * 100)) - (5 * p.edad) + (document.getElementById('sexo').value === 'm' ? 5 : -161);
        p.tmt = bmr * p.actividad;
        document.getElementById('valTMT').innerText = Math.round(p.tmt);
        document.getElementById('simGoal').innerText = Math.round(p.tmt);
        runSimulation();
    }
}

// --- 8. SIMULATOR LOGIC ---
function updateFormulaSelect() {
    const sel = document.getElementById('formulaSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">Seleccione Fórmula...</option>';
    const cats = [...new Set(AppState.formulas.map(i => i.cat))];
    cats.forEach(cat => {
        const group = document.createElement('optgroup');
        group.label = cat;
        AppState.formulas.filter(i => i.cat === cat).forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.innerText = item.name;
            group.appendChild(opt);
        });
        sel.appendChild(group);
    });
    sel.onchange = runSimulation;
}

function initSimulatorLogic() {
    document.getElementById('volume').oninput = runSimulation;
    document.getElementById('dilution').oninput = runSimulation;
    document.getElementById('btnSaveHistory').onclick = savePrescription;
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

    document.getElementById('valKcal').innerText = Math.round(k);
    document.getElementById('valProt').innerText = p.toFixed(1);
    document.getElementById('valCHO').innerText = c.toFixed(1);
    document.getElementById('valLip').innerText = l.toFixed(1);
    document.getElementById('simCurrent').innerText = Math.round(k);

    const goal = AppState.patient.tmt || 2000;
    document.getElementById('simBar').style.width = Math.min((k / goal) * 100, 100) + '%';
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
