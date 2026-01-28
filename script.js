// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://qibkmvtbgauobedtjapg.supabase.co';
const supabaseKey = 'sb_publishable_xCxGjcAngmfd0hJYv2uphg_yB-pF3Hp';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Iniciando Sedile HRA V2.5...");

// --- 2. MASSIVE DATABASE ---
const LOCAL_FORMULAS = [
    // --- LECHES HRA (Per 100cc) ---
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

    // --- FÓRMULAS RTH (Per 100ml) ---
    { cat: "Fórmulas RTH", id: "osmolite", name: "Osmolite", type: "l", k: 100.0, p: 4.0, c: 13.6, f: 3.4 },
    { cat: "Fórmulas RTH", id: "glucerna_15", name: "Glucerna 1.5", type: "l", k: 150.0, p: 7.5, c: 12.76, f: 7.5 },
    { cat: "Fórmulas RTH", id: "diben_15", name: "Diben 1.5 Kcal", type: "l", k: 150.0, p: 7.5, c: 13.1, f: 7.0 },
    { cat: "Fórmulas RTH", id: "fresubin_fibre", name: "Fresubin Original Fibre", type: "l", k: 100.0, p: 3.8, c: 13.0, f: 3.4 },
    { cat: "Fórmulas RTH", id: "fresubin_intensive", name: "Fresubin Intensive", type: "l", k: 122.0, p: 10.0, c: 12.9, f: 3.2 },
    { cat: "Fórmulas RTH", id: "fresubin_2kcal", name: "Fresubin 2 Kcal HP", type: "l", k: 200.0, p: 10.0, c: 17.5, f: 10.0 },
    { cat: "Fórmulas RTH", id: "ensure_clinical_rth", name: "Ensure Clinical (RTH)", type: "l", k: 149.2, p: 8.0, c: 18.0, f: 4.8 }
];

const EXCHANGE_DB = [
    { id: 'cereal', name: 'Cereales', k: 70, p: 2, f: 0, c: 15 },
    { id: 'veg', name: 'Verduras', k: 30, p: 1, f: 0, c: 5 },
    { id: 'fruit', name: 'Frutas', k: 65, p: 0, f: 0, c: 15 },
    { id: 'dairy_skim', name: 'Lácteos Descremados', k: 70, p: 7, f: 0, c: 10 },
    { id: 'meat_lean', name: 'Carnes Magras', k: 50, p: 7, f: 2, c: 0 },
    { id: 'oil', name: 'Aceites/Grasas', k: 45, p: 0, f: 5, c: 0 },
];

// --- 3. GLOBAL STATE ---
const AppState = {
    patient: { nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0 },
    formulas: [],
    exchanges: EXCHANGE_DB,
    calcMode: 'vol'
};

// --- 4. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM Cargado. Inicializando widgets...");
    initCompactLayout();
    initProtocolModal();
    initPatientLogic();
    initSimulatorLogic();
    PatientManager.init();
    await loadFormulas();
});

// --- 5. COMPACT UI LOGIC ---
function initCompactLayout() {
    const modeToggles = document.querySelectorAll('.mode-toggle');
    modeToggles.forEach(btn => {
        btn.onclick = () => {
            modeToggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.calcMode = btn.dataset.mode;
            updateInputLabels();
            runSimulation(); // Recalculate on switch
        };
    });
}

function updateInputLabels() {
    const lblDil = document.getElementById('lblDilution');
    const inputDil = document.getElementById('dilution');
    if (!lblDil || !inputDil) return;

    if (AppState.calcMode === 'grams') {
        lblDil.innerText = "Gramos Totales (g)";
        inputDil.placeholder = "Ej. 50";
    } else {
        lblDil.innerText = "Dilución (%)";
        inputDil.placeholder = "Ej. 13.5";
    }
}

// --- 6. PROTOCOL MODAL ---
function initProtocolModal() {
    const modal = document.getElementById('protocolModal');
    const btnOpen = document.getElementById('btnProtocolOpen');
    const btnClose = document.getElementById('btnProtocolClose');

    console.log("Configurando modal:", !!modal, !!btnOpen);

    if (btnOpen) {
        btnOpen.onclick = () => {
            console.log("Abriendo modal...");
            modal.classList.add('active');
        };
    }
    if (btnClose) {
        btnClose.onclick = () => {
            modal.classList.remove('active');
        };
    }

    // Export function to window so HTML can see it
    window.switchProtocolTab = (idx) => {
        console.log("Cambiando pestaña a:", idx);
        document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
        const tabs = [document.getElementById('tab-infusion'), document.getElementById('tab-delivery')];
        tabs.forEach((t, i) => {
            if (t) t.style.display = i === idx ? 'block' : 'none';
        });
    };
}

// --- 7. PATIENT LOGIC ---
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
            const originalText = btn.innerText;
            btn.innerText = "Guardando...";

            const data = {
                nombre: document.getElementById('nombre').value,
                edad: parseInt(document.getElementById('edad').value) || 0,
                peso_kg: parseFloat(document.getElementById('peso').value) || 0,
                estatura_m: parseFloat(document.getElementById('estatura').value) || 0
            };

            try {
                const { error } = await supabase.from('pacientes').insert([data]);
                if (error) throw error;
                btn.innerText = "¡Listo!";
                PatientManager.addPatient(data.nombre);
            } catch (err) {
                console.error("Error Supabase:", err);
                btn.innerText = "Error (Local)";
                PatientManager.addPatient(data.nombre + " (local)");
            }
            setTimeout(() => btn.innerText = originalText, 2000);
        };
    }
}

function calculateRequirements() {
    const p = AppState.patient;
    p.nombre = document.getElementById('nombre').value;
    p.edad = parseFloat(document.getElementById('edad').value) || 0;
    p.peso = parseFloat(document.getElementById('peso').value) || 0;
    p.estatura = parseFloat(document.getElementById('estatura').value) || 0;
    p.actividad = parseFloat(document.getElementById('actividad').value) || 1.2;

    const bmiEl = document.getElementById('valBMI');
    if (p.peso > 0 && p.estatura > 0 && bmiEl) {
        p.bmi = p.peso / (p.estatura * p.estatura);
        bmiEl.innerText = p.bmi.toFixed(1);
    }

    const tmtEl = document.getElementById('valTMT');
    const simGoal = document.getElementById('simGoal');
    if (p.peso > 0 && p.estatura > 0 && p.edad > 0 && tmtEl) {
        let bmr = (10 * p.peso) + (6.25 * (p.estatura * 100)) - (5 * p.edad) + (document.getElementById('sexo').value === 'm' ? 5 : -161);
        p.tmt = bmr * p.actividad;
        tmtEl.innerText = Math.round(p.tmt);
        if (simGoal) simGoal.innerText = Math.round(p.tmt);
        runSimulation(); // Update progress bar
    }
}

// --- 8. SIMULATOR LOGIC ---
async function loadFormulas() {
    console.log("Cargando base de datos de fórmulas...");
    AppState.formulas = LOCAL_FORMULAS;
    updateFormulaSelect();
}

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
    const v = document.getElementById('volume');
    const d = document.getElementById('dilution');
    if (v) v.oninput = runSimulation;
    if (d) d.oninput = runSimulation;

    const btnSave = document.getElementById('btnSaveHistory');
    if (btnSave) btnSave.onclick = savePrescriptionToSupabase;
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
        // Logic for reconstituted formulas from HRA image (Image 1 values are per 100ml)
        k = formula.k * (vol / 100);
        p = formula.p * (vol / 100);
        c = formula.c * (vol / 100);
        l = formula.f * (vol / 100);
    } else {
        // GRAMAGE MODE (per 100g)
        const gramsInput = v2;
        k = formula.k * (gramsInput / 100);
        p = formula.p * (gramsInput / 100);
        c = formula.c * (gramsInput / 100);
        l = formula.f * (gramsInput / 100);
    }

    document.getElementById('valKcal').innerText = Math.round(k);
    document.getElementById('valProt').innerText = p.toFixed(1);
    document.getElementById('valCHO').innerText = c.toFixed(1);
    document.getElementById('valLip').innerText = l.toFixed(1);

    const simCurrent = document.getElementById('simCurrent');
    if (simCurrent) simCurrent.innerText = Math.round(k);

    const goal = AppState.patient.tmt || 2000;
    const bar = document.getElementById('simBar');
    if (bar) {
        const pct = Math.min((k / goal) * 100, 100);
        bar.style.width = pct + '%';
    }
}

async function savePrescriptionToSupabase() {
    const kcal = document.getElementById('valKcal').innerText;
    if (kcal === "0") {
        alert("Primero realiza un cálculo");
        return;
    }

    const payload = {
        paciente_nombre: AppState.patient.nombre || 'Anónimo',
        detalle: `Fórmula: ${document.getElementById('formulaSelect').value}, Kcal: ${kcal}`,
        fecha: new Date().toISOString()
    };

    try {
        const { error } = await supabase.from('prescripciones').insert([payload]);
        if (error) throw error;
        alert("¡Prescripción guardada en la nube!");
    } catch (err) {
        console.error(err);
        alert("Error al guardar en nube. Revisa consola.");
    }
}

// --- 9. PATIENT MANAGER ---
const PatientManager = {
    patients: [],
    init() {
        const s = localStorage.getItem('sedile_v2_pats');
        this.patients = s ? JSON.parse(s) : [];
        this.render();
    },
    addPatient(name) {
        if (!this.patients.find(p => p.name === name)) {
            this.patients.push({ name: name, id: Date.now() });
            localStorage.setItem('sedile_v2_pats', JSON.stringify(this.patients));
            this.render();
        }
    },
    render() {
        const list = document.getElementById('patientList');
        if (!list) return;
        list.innerHTML = this.patients.map(p => `<div class="patient-item">${p.name}</div>`).join('');
    }
};
