// --- 1. BASE DE DATOS DE FÓRMULAS (Vademécum Master) ---
const formulas = [
    // --- PEDIATRÍA (POLVOS) ---
    { cat: "Pediatría: Prematuros", id: "nan_prem", name: "Nan Prematuros", type: "p", dil: 16.1, k: 498, p: 14.4, f: 25.9, c: 53.2, img: "https://www.farmaciasahumada.cl/media/catalog/product/cache/f7259066601f034789547ce399435b5e/7/6/7613036929424_1.jpg" },
    { cat: "Pediatría: Prematuros", id: "sim_neo", name: "Similac Neosure", type: "p", dil: 14.6, k: 518, p: 13.3, f: 28.2, c: 52.8, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw15197828/images/large/292864-1-similac-neosure-polvo-370-g.jpg" },
    { cat: "Pediatría: Prematuros", id: "nan_alprem", name: "Nan Alprem (Hidrolizada)", type: "p", dil: 15.9, k: 506, p: 14.5, f: 26.0, c: 53.6, img: "https://d2j6dbq0eux0bg.cloudfront.net/images/66619176/3133887140.jpg" },

    { cat: "Pediatría: Inicio (0-6m)", id: "nan_1", name: "Nan 1 Optipro", type: "p", dil: 12.9, k: 522, p: 9.5, f: 27.7, c: 58.7, img: "https://geant.vteximg.com.br/arquivos/ids/263228/671400.jpg?v=637482813962630000" },
    { cat: "Pediatría: Inicio (0-6m)", id: "nidal_1", name: "Nidal 1", type: "p", dil: 12.9, k: 519, p: 9.5, f: 27.7, c: 57.8, img: "https://jumbo.vtexassets.com/arquivos/ids/444212/Leche-en-polvo-Nidal-Inicio-tarro-800-g.jpg?v=637584196162330000" },
    { cat: "Pediatría: Inicio (0-6m)", id: "similac_1", name: "Similac 1", type: "p", dil: 14.2, k: 513, p: 10.6, f: 28.2, c: 53.0, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dwa3c32b95/images/large/292862-Similac-1-Hmo-850-Gr-Lata.jpg" },

    { cat: "Pediatría: Continuación", id: "nan_2", name: "Nan 2", type: "p", dil: 13.8, k: 486, p: 15.0, f: 21.2, c: 58.8, img: "https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/5009848_1/w=1500,h=1500,fit=pad" },
    { cat: "Pediatría: Continuación", id: "bebelac_2", name: "Bebelac 2", type: "p", dil: 15.3, k: 475, p: 15.0, f: 19.0, c: 60.0, img: "https://tofuu.getjusto.com/orioneat-prod/n348p3dJ8jje2sWdY-Bebelac%202.png" },
    { cat: "Pediatría: Continuación", id: "enfamil_2", name: "Enfamil Premium 2", type: "p", dil: 13.8, k: 477, p: 14.6, f: 21.6, c: 56.0, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dwc6c0f3a6/images/large/270428-enfamil-premium-etapa-2-sobre-800-g.jpg" },

    { cat: "Pediatría: Crecimiento", id: "nan_3", name: "Nan 3", type: "p", dil: 14.0, k: 438, p: 15.0, f: 17.0, c: 54.7, img: "https://jumbo.vtexassets.com/arquivos/ids/345262/Formula-l-ctea-NAN-3-Optipro-800-g-1-300435.jpg?v=637256247960300000" },
    { cat: "Pediatría: Crecimiento", id: "nido_3", name: "Nido 3+", type: "p", dil: 13.0, k: 458, p: 17.0, f: 20.2, c: 52.0, img: "https://www.nestle.cl/sites/g/files/pydnoa311/files/Nido_3%2B.png" },

    { cat: "PNAC / Estado", id: "purita", name: "Leche Purita Fortificada", type: "p", dil: 10.0, k: 439, p: 29.9, f: 15.2, c: 45.7, img: "https://www.minsal.cl/wp-content/uploads/2015/09/leche-purita-fortificada-1.jpg" },

    { cat: "Especiales / Alergias", id: "nan_ar", name: "Nan AR (Anti-reflujo)", type: "p", dil: 13.5, k: 513, p: 9.8, f: 26.0, c: 59.9, img: "https://www.farmaciasahumada.cl/media/catalog/product/cache/f7259066601f034789547ce399435b5e/7/6/7613034927781_1_1.jpg" },
    { cat: "Especiales / Alergias", id: "nan_sl", name: "Nan Sin Lactosa", type: "p", dil: 13.5, k: 509, p: 10.9, f: 25.4, c: 59.0, img: "https://www.farmaciasahumada.cl/media/catalog/product/cache/f7259066601f034789547ce399435b5e/7/6/7613035133372_1.jpg" },
    { cat: "Especiales / Alergias", id: "alfamino", name: "Alfamino (AA Libres)", type: "p", dil: 13.5, k: 503, p: 13.3, f: 24.6, c: 57.0, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw4f2b1d3a/images/large/287313-alfamino-polvo-400-g.jpg" },
    { cat: "Especiales / Alergias", id: "althera", name: "Althera", type: "p", dil: 13.5, k: 506, p: 12.5, f: 26.0, c: 55.5, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw4f2b1d3a/images/large/287314-althera-polvo-400-g.jpg" },

    // --- ADULTOS / ENTERAL (LÍQUIDOS) ---
    { cat: "Líquidos (Botella/RTH)", id: "fresubin_orig", name: "Fresubin Original", type: "l", k: 100, p: 3.8, f: 3.4, c: 13.8, img: "https://www.fresenius-kabi.com/cl/images/Fresubin_Original_Fibre.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "ensure_adv", name: "Ensure Advance Botella", type: "l", k: 105, p: 5.48, f: 3.37, c: 13.5, img: "https://jumbo.vtexassets.com/arquivos/ids/444222/Alimento-liquido-Ensure-Advance-vainilla-botella-237-ml.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "glucerna_liq", name: "Glucerna Líquida", type: "l", k: 93, p: 4.6, f: 3.8, c: 10.0, img: "https://jumbo.vtexassets.com/arquivos/ids/410228/Glucerna-Liquido-Vainilla-237-Ml-Botella.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "nepro_ap", name: "Nepro AP (Renal)", type: "l", k: 180, p: 8.1, f: 9.6, c: 16.0, img: "https://www.cruzverde.cl/dw/image/v2/BDPM_PRD/on/demandware.static/-/Sites-masterCatalog_Chile/default/dw15197828/images/large/270438-nepro-ap-vainilla-237-ml.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "enterex_renal_liq", name: "Enterex Renal Líquido", type: "l", k: 200, p: 8.4, f: 10.0, c: 19.0, img: "https://www.enterex.cl/wp-content/uploads/2020/06/Enterex-Renal-Vainilla-237ml.png" },
    { cat: "Líquidos (Botella/RTH)", id: "fresubin_2kcal", name: "Fresubin 2 Kcal", type: "l", k: 200, p: 10.0, f: 7.8, c: 22.5, img: "https://www.fresenius-kabi.com/cl/images/Fresubin_2kcal_Drink_Vainilla.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "diben", name: "Diben (Diabetes)", type: "l", k: 150, p: 7.5, f: 7.0, c: 13.1, img: "https://www.fresenius-kabi.com/cl/images/Diben_Drink_Cappuccino.jpg" },
    { cat: "Líquidos (Botella/RTH)", id: "supportan", name: "Supportan (Onco)", type: "l", k: 150, p: 10.0, f: 6.7, c: 11.6, img: "https://www.fresenius-kabi.com/cl/images/Supportan_Drink_Cappuccino.jpg" },

    // --- ADULTOS (POLVOS) ---
    { cat: "Polvos Adulto", id: "ensure_polvo", name: "Ensure Polvo (Estándar)", type: "p", dil: 22.0, k: 430, p: 15.9, f: 14.0, c: 60.0, img: "https://jumbo.vtexassets.com/arquivos/ids/444218/Alimento-en-polvo-Ensure-vainilla-lata-850-g.jpg" },
    { cat: "Polvos Adulto", id: "enterex_polvo", name: "Enterex Polvo", type: "p", dil: 22.0, k: 450, p: 16.0, f: 15.0, c: 62.0, img: "https://www.enterex.cl/wp-content/uploads/2020/05/Enterex-Polvo-Vainilla-400g.png" },

    // --- MÓDULOS ---
    { cat: "Módulos", id: "malto", name: "Módulo Maltodextrina", type: "p", dil: 5.0, k: 380, p: 0, f: 0, c: 95.0, img: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png" },
    { cat: "Módulos", id: "prot", name: "Módulo Proteína (Caseinato)", type: "p", dil: 5.0, k: 370, p: 90.0, f: 1.0, c: 1.0, img: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png" }
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
        dilInput.style.backgroundColor = "rgba(0,0,0,0.05)";
        dilInput.style.cursor = "not-allowed";
    } else {
        // Es polvo
        dilInput.value = formula.dil; // Poner dilución sugerida
        dilInput.disabled = false;
        dilInput.style.backgroundColor = "rgba(255,255,255,0.6)";
        dilInput.style.cursor = "text";
    }

    // --- NEW: Update Image ---
    const imgEl = document.getElementById('dynamicImg');
    if (imgEl && formula.img) {
        // Animation effect
        imgEl.classList.add('change');
        setTimeout(() => {
            imgEl.src = formula.img;
            imgEl.onload = () => {
                imgEl.classList.remove('change');
            };
        }, 300);
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
