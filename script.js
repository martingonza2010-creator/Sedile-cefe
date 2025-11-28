// --- 1. BASE DE DATOS DE FÓRMULAS (Vademécum Master) ---
const formulas = [
    // --- PEDIATRÍA (POLVOS) ---
    { cat: "Pediatría: Prematuros", id: "nan_prem", name: "Nan Prematuros", type: "p", dil: 16.1, k: 498, p: 14.4, f: 25.9, c: 53.2 },
    { cat: "Pediatría: Prematuros", id: "sim_neo", name: "Similac Neosure", type: "p", dil: 14.6, k: 518, p: 13.3, f: 28.2, c: 52.8 },
    { cat: "Pediatría: Prematuros", id: "nan_alprem", name: "Nan Alprem (Hidrolizada)", type: "p", dil: 15.9, k: 506, p: 14.5, f: 26.0, c: 53.6 },

    { cat: "Pediatría: Inicio (0-6m)", id: "nan_1", name: "Nan 1 Optipro", type: "p", dil: 12.9, k: 522, p: 9.5, f: 27.7, c: 58.7 },
    { cat: "Pediatría: Inicio (0-6m)", id: "nidal_1", name: "Nidal 1", type: "p", dil: 12.9, k: 519, p: 9.5, f: 27.7, c: 57.8 },
    { cat: "Pediatría: Inicio (0-6m)", id: "similac_1", name: "Similac 1", type: "p", dil: 14.2, k: 513, p: 10.6, f: 28.2, c: 53.0 },

    { cat: "Pediatría: Continuación", id: "nan_2", name: "Nan 2", type: "p", dil: 13.8, k: 486, p: 15.0, f: 21.2, c: 58.8 },
    { cat: "Pediatría: Continuación", id: "bebelac_2", name: "Bebelac 2", type: "p", dil: 15.3, k: 475, p: 15.0, f: 19.0, c: 60.0 },
    { cat: "Pediatría: Continuación", id: "enfamil_2", name: "Enfamil Premium 2", type: "p", dil: 13.8, k: 477, p: 14.6, f: 21.6, c: 56.0 },

    { cat: "Pediatría: Crecimiento", id: "nan_3", name: "Nan 3", type: "p", dil: 14.0, k: 438, p: 15.0, f: 17.0, c: 54.7 },
    { cat: "Pediatría: Crecimiento", id: "nido_3", name: "Nido 3+", type: "p", dil: 13.0, k: 458, p: 17.0, f: 20.2, c: 52.0 },

    { cat: "PNAC / Estado", id: "purita", name: "Leche Purita Fortificada", type: "p", dil: 10.0, k: 439, p: 29.9, f: 15.2, c: 45.7 },

    { cat: "Especiales / Alergias", id: "nan_ar", name: "Nan AR (Anti-reflujo)", type: "p", dil: 13.5, k: 513, p: 9.8, f: 26.0, c: 59.9 },
    { cat: "Especiales / Alergias", id: "nan_sl", name: "Nan Sin Lactosa", type: "p", dil: 13.5, k: 509, p: 10.9, f: 25.4, c: 59.0 },
    { cat: "Especiales / Alergias", id: "alfamino", name: "Alfamino (AA Libres)", type: "p", dil: 13.5, k: 503, p: 13.3, f: 24.6, c: 57.0 },
    { cat: "Especiales / Alergias", id: "althera", name: "Althera", type: "p", dil: 13.5, k: 506, p: 12.5, f: 26.0, c: 55.5 },

    // --- ADULTOS / ENTERAL (LÍQUIDOS) ---
    { cat: "Líquidos (Botella/RTH)", id: "fresubin_orig", name: "Fresubin Original", type: "l", k: 100, p: 3.8, f: 3.4, c: 13.8 },
    { cat: "Líquidos (Botella/RTH)", id: "ensure_adv", name: "Ensure Advance Botella", type: "l", k: 105, p: 5.48, f: 3.37, c: 13.5 },
    { cat: "Líquidos (Botella/RTH)", id: "glucerna_liq", name: "Glucerna Líquida", type: "l", k: 93, p: 4.6, f: 3.8, c: 10.0 },
    { cat: "Líquidos (Botella/RTH)", id: "nepro_ap", name: "Nepro AP (Renal)", type: "l", k: 180, p: 8.1, f: 9.6, c: 16.0 },
    { cat: "Líquidos (Botella/RTH)", id: "enterex_renal_liq", name: "Enterex Renal Líquido", type: "l", k: 200, p: 8.4, f: 10.0, c: 19.0 },
    { cat: "Líquidos (Botella/RTH)", id: "fresubin_2kcal", name: "Fresubin 2 Kcal", type: "l", k: 200, p: 10.0, f: 7.8, c: 22.5 },
    { cat: "Líquidos (Botella/RTH)", id: "diben", name: "Diben (Diabetes)", type: "l", k: 150, p: 7.5, f: 7.0, c: 13.1 },
    { cat: "Líquidos (Botella/RTH)", id: "supportan", name: "Supportan (Onco)", type: "l", k: 150, p: 10.0, f: 6.7, c: 11.6 },

    // --- ADULTOS (POLVOS) ---
    { cat: "Polvos Adulto", id: "ensure_polvo", name: "Ensure Polvo (Estándar)", type: "p", dil: 22.0, k: 430, p: 15.9, f: 14.0, c: 60.0 },
    { cat: "Polvos Adulto", id: "enterex_polvo", name: "Enterex Polvo", type: "p", dil: 22.0, k: 450, p: 16.0, f: 15.0, c: 62.0 },

    // --- MÓDULOS ---
    { cat: "Módulos", id: "malto", name: "Módulo Maltodextrina", type: "p", dil: 5.0, k: 380, p: 0, f: 0, c: 95.0 },
    { cat: "Módulos", id: "prot", name: "Módulo Proteína (Caseinato)", type: "p", dil: 5.0, k: 370, p: 90.0, f: 1.0, c: 1.0 }
];

// --- 2. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    initSelect();
    initEventListeners();
});

function initSelect() {
    const select = document.getElementById('formulaSelect');
    const categories = [...new Set(formulas.map(item => item.cat))]; // Categorías únicas

    categories.forEach(cat => {
        const group = document.createElement('optgroup');
        group.label = cat;
        formulas.filter(i => i.cat === cat).forEach(prod => {
            const opt = document.createElement('option');
            opt.value = prod.id; // Usamos ID para buscar luego
            // Icono visual según tipo
            const icon = prod.type === 'l' ? "💧 " : "🥡 ";
            opt.innerText = icon + prod.name;
            group.appendChild(opt);
        });
        select.appendChild(group);
    });
}

function initEventListeners() {
    // Cambio de producto (Auto-fill dilución)
    document.getElementById('formulaSelect').addEventListener('change', handleProductChange);

    // Calculadora
    document.getElementById('calcForm').addEventListener('submit', handleCalculation);

    // Feedback Toggle
    const btnToggle = document.getElementById('toggleFeedback');
    const feedbackContainer = document.getElementById('feedbackFormContainer');

    btnToggle.addEventListener('click', () => {
        if (feedbackContainer.style.display === 'block') {
            feedbackContainer.style.display = 'none';
        } else {
            feedbackContainer.style.display = 'block';
            feedbackContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Enviar Feedback
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedback);
}

// --- 3. LÓGICA DE INTERACCIÓN ---
function handleProductChange() {
    const fID = document.getElementById('formulaSelect').value;
    const dilInput = document.getElementById('dilution');

    const formula = formulas.find(x => x.id === fID);
    if (!formula) return;

    if (formula.type === 'l') {
        // Es líquido
        dilInput.value = "";
        dilInput.placeholder = "N/A (Líquido)";
        dilInput.disabled = true;
        dilInput.style.backgroundColor = "#e0e0e0";
        dilInput.style.cursor = "not-allowed";
    } else {
        // Es polvo
        dilInput.value = formula.dil; // Poner dilución sugerida
        dilInput.disabled = false;
        dilInput.style.backgroundColor = "#f9fafb";
        dilInput.style.cursor = "text";
    }
}

// --- 4. LÓGICA DE CÁLCULO ---
function handleCalculation(e) {
    e.preventDefault();

    const fID = document.getElementById('formulaSelect').value;
    const vol = parseFloat(document.getElementById('volume').value);
    let dil = parseFloat(document.getElementById('dilution').value);

    const formula = formulas.find(x => x.id === fID);
    if (!formula) return;

    let grams = 0;
    let kcal = 0, prot = 0, fat = 0, carb = 0, density = 0;
    let instruction = "";

    if (formula.type === 'l') {
        // LÍQUIDO: Aportes por 100ml
        const factor = vol / 100;

        kcal = formula.k * factor;
        prot = formula.p * factor;
        fat = formula.f * factor;
        carb = formula.c * factor;

        density = formula.k / 100; // Kcal por ml
        grams = 0; // No aplica peso

        instruction = `Servir <strong>${vol} ml</strong> de <strong>${formula.name}</strong> directos del envase.`;

    } else {
        // POLVO: Aportes por 100g
        if (!dil || isNaN(dil)) {
            alert("Por favor ingresa una dilución válida.");
            return;
        }

        grams = (vol * dil) / 100;
        const factor = grams / 100;

        kcal = formula.k * factor;
        prot = formula.p * factor;
        fat = formula.f * factor;
        carb = formula.c * factor;

        density = kcal / vol;

        instruction = `Mezclar <strong>${grams.toFixed(1)} g</strong> de polvo con agua hasta alcanzar un volumen final de <strong>${vol} ml</strong>.`;
    }

    // Mostrar Resultados
    const resultsArea = document.getElementById('results-area');
    resultsArea.style.display = 'block';

    // Actualizar Textos
    document.getElementById('txtPrep').innerHTML = instruction;
    document.getElementById('valDens').innerText = density.toFixed(2);

    // Ocultar/Mostrar tarjeta de gramos según tipo
    const cardGrams = document.getElementById('card-grams');
    if (formula.type === 'l') {
        cardGrams.style.display = 'none';
    } else {
        cardGrams.style.display = 'flex'; // O 'block' según CSS
    }

    // Animar Elementos
    animateElements();

    // Contadores
    animateValue(document.getElementById('valKcal'), 0, kcal, 1500, false);
    animateValue(document.getElementById('valProt'), 0, prot, 1200, true);
    animateValue(document.getElementById('valFat'), 0, fat, 1200, true);
    animateValue(document.getElementById('valCarb'), 0, carb, 1200, true);

    if (formula.type !== 'l') {
        animateValue(document.getElementById('valGrams'), 0, grams, 1000, true);
    }

    // Scroll
    if (window.innerWidth < 600) {
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// --- 5. ANIMACIONES ---
function animateElements() {
    const ids = ['card-instr', 'card-kcal', 'card-prot', 'card-fat', 'card-carb', 'card-grams'];

    ids.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) { // Check existence (card-grams might be hidden)
            el.classList.remove('animate-enter');
            el.style.animationDelay = `${index * 0.05}s`;
            void el.offsetWidth;
            el.classList.add('animate-enter');
        }
    });
}

function animateValue(obj, start, end, duration, isFloat) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = start + (end - start) * ease;
        obj.innerHTML = isFloat ? current.toFixed(1) : Math.round(current);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = isFloat ? end.toFixed(1) : Math.round(end);
        }
    };
    window.requestAnimationFrame(step);
}

// --- 6. FEEDBACK ---
function handleFeedback(e) {
    e.preventDefault();
    const message = document.getElementById('feedbackMessage').value;
    const emailTo = "tu_correo@ejemplo.com";
    const subject = "Sugerencia Sedile App";
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;

    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "¡Abriendo correo...";
    btn.style.background = "#4caf50";

    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
        document.getElementById('feedbackMessage').value = "";
        document.getElementById('feedbackFormContainer').style.display = 'none';
    }, 2000);
}
