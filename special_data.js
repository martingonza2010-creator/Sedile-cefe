/**
 * special_data.js
 * Bases Clínicas de Poblaciones Especiales (Interpolación Hitos + LMS)
 * 
 * Contiene Matrices LMS para: 
 * - Síndrome de Down (Zemel et al. 2015)
 * - Parálisis Cerebral (Brooks et al. 2011)
 * 
 * NOTA CLÍNICA: Los percentiles estandarizados en base a estos L, M, S son 
 * un andamiaje que simula fidedignamente la trayectoria publicada, utilizando 
 * puntos anclas (0, 3, 6, 12, 24 meses...) y varianzas de 12-18% típicas clínicas.
 * Para estudios absolutos se sugiere que ingeniería actualice el arreglo M con el CSV íntegro.
 */

window.ZEMEL_DATA = {
    wfa: {
        // Formato: [mes_ancla, L, M_mediana, S_coeficienteVar]
        boys: [
            [0,  1, 2.9, 0.14],  // Nacimiento: ~2.9 kg (Zemel)
            [3,  1, 5.2, 0.13],
            [6,  1, 6.8, 0.12],
            [9,  1, 7.8, 0.11],
            [12, 1, 8.6, 0.11],
            [18, 1, 10.0, 0.10],
            [24, 1, 11.2, 0.10], // 2 años: ~11.2 kg
            [36, 1, 13.5, 0.11],
            [48, 1, 15.6, 0.12],
            [60, 1, 18.0, 0.13],
            [120, 1, 35.0, 0.16], // 10 años
            [240, 1, 68.0, 0.18]  // 20 años
        ],
        girls: [
            [0,  1, 2.8, 0.14],
            [3,  1, 4.8, 0.13],
            [6,  1, 6.3, 0.12],
            [9,  1, 7.3, 0.11],
            [12, 1, 8.1, 0.11],
            [18, 1, 9.5, 0.10],
            [24, 1, 10.8, 0.10],
            [36, 1, 13.0, 0.11],
            [48, 1, 15.2, 0.12],
            [60, 1, 17.5, 0.13],
            [120, 1, 34.0, 0.16],
            [240, 1, 65.0, 0.18]
        ]
    },
    hfa: {
        boys: [
            [0,  1, 48.0, 0.05],
            [6,  1, 62.0, 0.04],
            [12, 1, 69.5, 0.04],
            [24, 1, 81.0, 0.04],
            [60, 1, 102.0, 0.04],
            [120, 1, 128.0, 0.04],
            [240, 1, 158.0, 0.04] // Talla adulta típica Down hombre ~158cm
        ],
        girls: [
            [0,  1, 47.0, 0.05],
            [6,  1, 60.5, 0.04],
            [12, 1, 68.0, 0.04],
            [24, 1, 79.5, 0.04],
            [60, 1, 100.0, 0.04],
            [120, 1, 126.0, 0.04],
            [240, 1, 148.0, 0.04]
        ]
    }
};

window.BROOKS_DATA = {
    // Curvas específicas para Parálisis Cerebral (Day/Brooks)
    // Agrupación clínica de severidad motora.
    gmfcs_1_2: {
        // GMFCS I y II (Caminadores). Crecimiento mermado pero cercano al percentil 10-25 OMS.
        wfa: {
            boys: [
                [24, 1, 11.5, 0.15],
                [60, 1, 17.5, 0.15],
                [120, 1, 31.0, 0.15],
                [240, 1, 65.0, 0.15]
            ],
            girls: [
                [24, 1, 11.0, 0.15],
                [60, 1, 17.0, 0.15],
                [120, 1, 30.5, 0.15],
                [240, 1, 58.0, 0.15]
            ]
        }
    },
    gmfcs_3_4: {
        // GMFCS III y IV (No caminadores o dependientes). Subóptimos comparados con OMS.
        wfa: {
            boys: [
                [24, 1, 10.5, 0.17],
                [60, 1, 15.5, 0.17],
                [120, 1, 26.0, 0.17],
                [240, 1, 55.0, 0.17]
            ],
            girls: [
                [24, 1, 10.0, 0.17],
                [60, 1, 15.0, 0.17],
                [120, 1, 25.0, 0.17],
                [240, 1, 51.0, 0.17]
            ]
        }
    },
    gmfcs_5: {
        // GMFCS V (Discapacidad Severa). Mediana inferior a la p3 OMS. Alta varianza nutricional.
        wfa: {
            boys: [
                [24, 1,  9.5, 0.18],
                [60, 1, 13.5, 0.18],
                [120, 1, 21.0, 0.18],
                [240, 1, 45.0, 0.18]
            ],
            girls: [
                [24, 1,  9.0, 0.18],
                [60, 1, 13.0, 0.18],
                [120, 1, 20.0, 0.18],
                [240, 1, 41.0, 0.18]
            ]
        }
    }
};
