// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://qibkmvtbgauobedtjapg.supabase.co';
const supabaseKey = 'sb_publishable_xCxGjcAngmfd0hJYv2uphg_yB-pF3Hp';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('Conexión con NutriSoporte establecida');

// --- 2. FALLBACK DATABASE (Vademécum Local) ---
const LOCAL_FORMULAS = [
    { cat: "Pediatría: Prematuros", id: "nan_prem", name: "Nan Prematuros", type: "p", dil: 16.1, k: 498, p: 14.4, f: 25.9, c: 53.2, img: "https://www.farmaciasahumada.cl/media/catalog/product/cache/f7259066601f034789547ce399435b5e/7/6/7613036929424_1.jpg" },
    { cat: "Pediatría: Prematuros", id: "sim_neo", name: "Similac Neosure", type: "p", dil: 14.6, k: 518, p: 13.3, f: 28.2, c: 52.8, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw15197828/images/large/292864-1-similac-neosure-polvo-370-g.jpg" },
    { cat: "Pediatría: Inicio (0-6m)", id: "nan_1", name: "Nan 1 Optipro", type: "p", dil: 12.9, k: 522, p: 9.5, f: 27.7, c: 58.7, img: "https://geant.vteximg.com.br/arquivos/ids/263228/671400.jpg?v=637482813962630000" },
    { cat: "Pediatría: Continuación", id: "nan_2", name: "Nan 2", type: "p", dil: 13.8, k: 486, p: 15.0, f: 21.2, c: 58.8, img: "https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/5009848_1/w=1500,h=1500,fit=pad" },
    { cat: "Pediatría: Crecimiento", id: "nan_3", name: "Nan 3", type: "p", dil: 14.0, k: 438, p: 15.0, f: 17.0, c: 54.7, img: "https://jumbo.vtexassets.com/arquivos/ids/345262/Formula-l-ctea-NAN-3-Optipro-800-g-1-300435.jpg?v=637256247960300000" },
    { cat: "Especiales / Alergias", id: "nan_sl", name: "Nan Sin Lactosa", type: "p", dil: 13.5, k: 509, p: 10.9, f: 25.4, c: 59.0, img: "https://www.farmaciasahumada.cl/media/catalog/product/cache/f7259066601f034789547ce399435b5e/7/6/7613035133372_1.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "fresubin_orig", name: "Fresubin Original", type: "l", k: 100, p: 3.8, f: 3.4, c: 13.8, img: "https://www.fresenius-kabi.com/cl/images/Fresubin_Original_Fibre.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "ensure_adv", name: "Ensure Advance Botella", type: "l", k: 105, p: 5.48, f: 3.37, c: 13.5, img: "https://jumbo.vtexassets.com/arquivos/ids/444222/Alimento-liquido-Ensure-Advance-vainilla-botella-237-ml.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "nepro_ap", name: "Nepro AP (Renal)", type: "l", k: 180, p: 8.1, f: 9.6, c: 16.0, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw15197828/images/large/270438-nepro-ap-vainilla-237-ml.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "diben", name: "Diben (Diabetes)", type: "l", k: 150, p: 7.5, f: 7.0, c: 13.1, img: "https://www.fresenius-kabi.com/cl/images/Diben_Drink_Cappuccino.jpg" },
    { cat: "Polvos Adulto", id: "ensure_polvo", name: "Ensure Polvo", type: "p", dil: 22.0, k: 430, p: 15.9, f: 14.0, c: 60.0, img: "https://jumbo.vtexassets.com/arquivos/ids/444218/Alimento-en-polvo-Ensure-vainilla-lata-850-g.jpg" },
    { cat: "Módulos", id: "malto", name: "Módulo Maltodextrina", type: "p", dil: 5.0, k: 380, p: 0, f: 0, c: 95.0, img: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png" },
    { cat: "Módulos", id: "prot", name: "Módulo Proteína (Caseinato)", type: "p", dil: 5.0, k: 370, p: 90.0, f: 1.0, c: 1.0, img: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png" }
];

const EXCHANGE_DB = [
    { id: 'cereal', name: 'Cereales', k: 70, p: 2, f: 0, c: 15 },
    { id: 'veg', name: 'Verduras', k: 30, p: 1, f: 0, c: 5 },
    { id: 'fruit', name: 'Frutas', k: 65, p: 0, f: 0, c: 15 },
    { id: 'dairy_skim', name: 'Lácteos Descremados', k: 70, p: 7, f: 0, c: 10 },
    { id: 'dairy_med', name: 'Lácteos Semi', k: 100, p: 7, f: 4, c: 10 },
    { id: 'dairy_whole', name: 'Lácteos Enteros', k: 135, p: 7, f: 8, c: 10 },
    { id: 'meat_lean', name: 'Carnes Magras', k: 50, p: 7, f: 2, c: 0 },
    { id: 'oil', name: 'Aceites/Grasas', k: 45, p: 0, f: 5, c: 0 },
    { id: 'sugar_sc', name: 'Azúcares', k: 20, p: 0, f: 0, c: 5 }
];

// --- 3. GLOBAL STATE ---
const AppState = {
    patient: { nombre: '', edad: 0, sexo: 'm', peso: 0, estatura: 0, actividad: 1.2, bmi: 0, tmt: 0 },
    formulas: [],
    exchanges: []
};

// --- 4. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', async () => {
    initViewNavigation();
    initPatientLogic();
    initSimulatorListeners();
    PatientManager.init();
    await loadFormulas();
    await loadExchanges();

    const btnSave = document.getElementById('btnSaveHistory');
    if (btnSave) btnSave.addEventListener('click', savePrescriptionToSupabase);
});

// --- 5. PATIENT MANAGER SYSTEM ---
const PatientManager = {
    patients: [],
    activePatientId: null,

    init() {
        this.loadPatients();
        this.renderPatientUI();
        this.initEventListeners();
    },

    loadPatients() {
        const stored = localStorage.getItem('sedile_patients');
        this.patients = stored ? JSON.parse(stored) : [];
        const activeId = localStorage.getItem('sedile_active_patient');
        this.activePatientId = activeId ? parseInt(activeId) : (this.patients.length > 0 ? this.patients[0].id : null);
    },

    saveData() {
        localStorage.setItem('sedile_patients', JSON.stringify(this.patients));
        if (this.activePatientId) localStorage.setItem('sedile_active_patient', this.activePatientId);
    },

    getActivePatient() {
        return this.patients.find(p => p.id === this.activePatientId);
    },

    addPatient(name) {
        if (!name) return;
        const newPatient = { id: Date.now(), name: name, history: [] };
        this.patients.push(newPatient);
        this.activePatientId = newPatient.id;
        this.saveData();
        this.renderPatientUI();
    },

    deletePatient(id, e) {
        if (e) e.stopPropagation();
        if (!confirm('¿Eliminar paciente?')) return;
        this.patients = this.patients.filter(p => p.id !== id);
        if (this.activePatientId === id) this.activePatientId = this.patients.length > 0 ? this.patients[0].id : null;
        this.saveData();
        this.renderPatientUI();
    },

    switchPatient(id) {
        this.activePatientId = id;
        this.saveData();
        this.renderPatientUI();
    },

    renderPatientUI() {
        const patient = this.getActivePatient();
        const labelName = document.getElementById('currentPatientName');
        const labelAvatar = document.getElementById('currentPatientAvatar');

        if (labelName && labelAvatar) {
            if (patient) {
                labelName.innerText = patient.name;
                labelAvatar.innerText = patient.name.charAt(0).toUpperCase();
            } else {
                labelName.innerText = 'Pacientes';
                labelAvatar.innerText = '+';
            }
        }

        const listContainer = document.getElementById('patientList');
        if (listContainer) {
            listContainer.innerHTML = '';
            this.patients.forEach(p => {
                const el = document.createElement('div');
                el.className = 'patient-item ' + (p.id === this.activePatientId ? 'active-patient' : '');
                el.innerHTML = `
                    <div style='display:flex; align-items:center; flex:1' onclick='PatientManager.switchPatient(${p.id})'>
                        <span class='patient-avatar' style='width:24px;height:24px;margin-right:10px;font-size:0.7rem'>${p.name.charAt(0).toUpperCase()}</span>
                        <span style='font-weight:600; font-size:0.9rem'>${p.name}</span>
                    </div>
                    <button onclick='PatientManager.deletePatient(${p.id}, event)' style='background:none; border:none; color:#ff5252; cursor:pointer; padding:5px;'>🗑️</button>
                `;
                listContainer.appendChild(el);
            });
        }
    },

    initEventListeners() {
        const btn = document.getElementById('btnPatientToggle');
        const menu = document.getElementById('patientMenu');
        if (btn) {
            btn.onclick = (e) => {
                e.stopPropagation();
                menu.classList.toggle('active');
            };
        }
        document.onclick = (e) => {
            if (menu && !menu.contains(e.target) && !e.target.closest('#btnPatientToggle')) {
                menu.classList.remove('active');
            }
        };
        const btnAdd = document.getElementById('btnAddPatient');
        if (btnAdd) {
            btnAdd.onclick = () => {
                const name = prompt('Nombre del nuevo paciente:');
                if (name) this.addPatient(name);
            };
        }
    }
};

// --- 6. VIEW NAVIGATION ---
function initViewNavigation() {
    const btns = { 'btnToSim': 1, 'btnBackToPatient': 0 };
    Object.keys(btns).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.addEventListener('click', () => switchView(btns[btnId]));
    });

    document.querySelectorAll('.step').forEach((el, idx) => {
        el.addEventListener('click', () => switchView(idx));
    });
}

function switchView(index) {
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.view-section');
    steps.forEach((s, i) => s.classList.toggle('active', i === index));
    sections.forEach((sec, i) => {
        sec.style.display = (i === index) ? 'block' : 'none';
        sec.classList.toggle('active', i === index);
    });
}

// --- 7. DATA LOADING ---
async function loadFormulas() {
    let formulas = [];
    try {
        const { data, error } = await supabase.from('formulas').select('*');
        if (!error && data && data.length > 0) formulas = data;
    } catch (e) { }

    if (formulas.length === 0) formulas = LOCAL_FORMULAS;
    AppState.formulas = formulas;
    updateFormulaSelect();
}

async function loadExchanges() {
    let exchanges = [];
    try {
        const { data, error } = await supabase.from('intercambios').select('*');
        if (!error && data && data.length > 0) exchanges = data;
    } catch (e) { }

    if (exchanges.length === 0) exchanges = EXCHANGE_DB;
    AppState.exchanges = exchanges;
    updateFormulaSelect();
}

function updateFormulaSelect() {
    const sel = document.getElementById('formulaSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">Seleccione Fórmula o Intercambio...</option>';

    const cats = [...new Set(AppState.formulas.map(i => i.cat || 'General'))];
    cats.forEach(cat => {
        const group = document.createElement('optgroup');
        group.label = cat;
        AppState.formulas.filter(i => (i.cat || 'General') === cat).forEach(item => {
            const opt = document.createElement('option');
            opt.value = 'for_' + item.id;
            opt.innerText = item.name;
            group.appendChild(opt);
        });
        sel.appendChild(group);
    });

    const excGroup = document.createElement('optgroup');
    excGroup.label = "--- INTERCAMBIOS ---";
    AppState.exchanges.forEach(item => {
        const opt = document.createElement('option');
        opt.value = 'exc_' + item.id;
        opt.innerText = item.name;
        excGroup.appendChild(opt);
    });
    sel.appendChild(excGroup);
    sel.onchange = handleProductChange;
}

function handleProductChange() {
    const val = document.getElementById('formulaSelect').value;
    const imgEl = document.getElementById('dynamicImg');
    const dilInput = document.getElementById('dilution');
    const lblDil = document.getElementById('lblDilution');
    if (val.startsWith('for_')) {
        const id = val.replace('for_', '');
        const f = AppState.formulas.find(x => x.id == id);
        if (f) {
            if (f.img) imgEl.src = f.img;
            if (f.type === 'l') {
                dilInput.disabled = true; dilInput.placeholder = "N/A (Líquido)";
                if (lblDil) lblDil.innerText = "Dilución (Líquido)";
            } else {
                dilInput.disabled = false; dilInput.value = f.dil || '';
                if (lblDil) lblDil.innerText = "Dilución (%)";
            }
        }
    } else if (val.startsWith('exc_')) {
        dilInput.disabled = true; dilInput.placeholder = "Cantidad/Porciones";
        if (lblDil) lblDil.innerText = "Unidades/Porciones";
    }
}

// --- 8. PATIENT LOGIC ---
function initPatientLogic() {
    ['nombre', 'edad', 'sexo', 'peso', 'estatura', 'actividad'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateRequirements);
    });
    const form = document.getElementById('form-paciente');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const msg = document.getElementById('mensaje');
            msg.innerText = "Guardando...";
            const data = {
                nombre: document.getElementById('nombre').value,
                edad: parseInt(document.getElementById('edad').value),
                peso_kg: parseFloat(document.getElementById('peso').value),
                estatura_m: parseFloat(document.getElementById('estatura').value)
            };
            const { error } = await supabase.from('pacientes').insert([data]);
            if (error) { msg.innerText = "Error: " + error.message; msg.style.color = "red"; }
            else { msg.innerText = "¡Guardado!"; msg.style.color = "green"; }
        };
    }
}

function calculateRequirements() {
    const p = AppState.patient;
    p.nombre = document.getElementById('nombre').value;
    p.edad = parseFloat(document.getElementById('edad').value) || 0;
    p.sexo = document.getElementById('sexo').value;
    p.peso = parseFloat(document.getElementById('peso').value) || 0;
    p.estatura = parseFloat(document.getElementById('estatura').value) || 0;
    p.actividad = parseFloat(document.getElementById('actividad').value) || 1.2;
    if (p.peso > 0 && p.estatura > 0) {
        p.bmi = p.peso / (p.estatura * p.estatura);
        document.getElementById('valBMI').innerText = p.bmi.toFixed(1);
        document.getElementById('bmiDisplay').style.display = 'block';
    }
    if (p.peso > 0 && p.estatura > 0 && p.edad > 0) {
        let bmr = (10 * p.peso) + (6.25 * (p.estatura * 100)) - (5 * p.edad);
        bmr += (p.sexo === 'm' ? 5 : -161);
        p.tmt = bmr * p.actividad;
        document.getElementById('valTMT').innerText = Math.round(p.tmt);
        document.getElementById('tmtDisplay').style.display = 'block';
        document.getElementById('simGoal').innerText = Math.round(p.tmt);
    }
}

// --- 9. SIMULATOR LOGIC ---
function initSimulatorListeners() {
    const btn = document.getElementById('btnCalculate');
    if (btn) btn.onclick = runSimulation;
}

function runSimulation() {
    const val = document.getElementById('formulaSelect').value;
    const vol = parseFloat(document.getElementById('volume').value) || 0;
    let k = 0;
    if (val.startsWith('for_')) {
        const id = val.replace('for_', '');
        const item = AppState.formulas.find(x => x.id == id);
        if (!item) return;
        if (item.type === 'l') { k = (item.k || item.calories) * (vol / 100); }
        else { k = (item.k || item.calories) * ((vol * (parseFloat(document.getElementById('dilution').value) || item.dil)) / 10000); }
    } else if (val.startsWith('exc_')) {
        const id = val.replace('exc_', '');
        const item = AppState.exchanges.find(x => x.id == id);
        if (item) { k = item.k * vol; }
    }
    document.getElementById('valKcal').innerText = Math.round(k);
    document.getElementById('simCurrent').innerText = Math.round(k);
    const goal = AppState.patient.tmt || 2000;
    document.getElementById('simBar').style.width = Math.min((k / goal) * 100, 100) + '%';
}

async function savePrescriptionToSupabase() {
    const payload = {
        paciente_nombre: AppState.patient.nombre || 'Anónimo',
        detalle: `Fórmula/Int: ${document.getElementById('formulaSelect').value}, Kcal: ${document.getElementById('valKcal').innerText}`,
        fecha: new Date().toISOString()
    };
    const { error } = await supabase.from('prescripciones').insert([payload]);
    alert(error ? "Error: " + error.message : "¡Prescripción guardada en la nube!");
}
