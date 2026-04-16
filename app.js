const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby9jcos9cwpBTteyBLhSMXwU2qyRd9K6h9C4Ja6D3PVATjbq2xkCW4xBv2qDyV-BIgO/exec";
let BD_ESTUDIANTES = [];

const mapCampos = {
    'estudiante': '.view-estudiante',
    'criterioCite': '#view-cite',
    'destinatario': '#view-destinatario',
    'cargo': '#view-cargo',
    'empresa': '#view-empresa',
    'tratamiento': '#view-tratamiento',
    'mencion': '#view-mencion',
    'fecha': '#view-fecha',
    'info1': '#view-info1',
    'info2': '#view-info2',
    'info3': '#view-info3',
    'generoEstudiante': '.view-genero-del, #view-genero-adjetivos'
};

// --- FUNCIÓN DE CARGA INICIAL (CORREGIDA) ---
async function cargarBaseDeDatos() {
    try {
        // 1. IMPORTANTE: Faltaba el fetch para obtener los datos de la URL
        const respuesta = await fetch(WEB_APP_URL);
        BD_ESTUDIANTES = await respuesta.json();
        
        const datalist = document.getElementById('listaEstudiantes');
        datalist.innerHTML = ""; // Limpiar por si acaso

        BD_ESTUDIANTES.forEach(est => {
            const option = document.createElement('option');
            option.value = est.nombre;
            datalist.appendChild(option);
        });
        console.log("✅ Base de datos cargada: ", BD_ESTUDIANTES.length, " estudiantes");
    } catch (error) {
        console.error("❌ Error cargando estudiantes:", error);
    }
}

// --- FUNCIÓN DE BÚSQUEDA (CORREGIDA) ---
function checkStudentMatch() {
    // Obtenemos el valor que el usuario escribió
    const nombreEscrito = document.getElementById('estudiante').value;
    
    // Buscamos en la base de datos cargada
    const encontrado = BD_ESTUDIANTES.find(est => est.nombre === nombreEscrito);

    if (encontrado) {
        document.getElementById('criterioCite').value = encontrado.cite;
        document.getElementById('generoEstudiante').value = encontrado.genero;
        document.getElementById('mencion').value = encontrado.mencion;

        document.getElementById('criterioCite').style.backgroundColor = "#d4edda";
    } else {
        // Si no hay match exacto, limpiamos el fondo (o podrías dejar que escriban manual)
        document.getElementById('criterioCite').style.backgroundColor = "";
    }

    updatePreview();
}

// --- RESTO DE FUNCIONES (IGUALES) ---
function updatePreview() {
    const nombre = document.getElementById('estudiante').value || "NOMBRE DEL ESTUDIANTE";
    document.querySelectorAll('.view-estudiante').forEach(el => el.innerText = nombre);

    const genero = document.getElementById('generoEstudiante').value;
    const textoDel = (genero === 'M') ? 'del ' : 'de la ';
    const textoAdj = (genero === 'M') ? 'un estudiante ' : 'una estudiante ';
    
    document.querySelectorAll('.view-genero-del').forEach(el => el.innerText = textoDel);
    const elAdj = document.getElementById('view-genero-adjetivos');
    if (elAdj) elAdj.innerText = textoAdj;

    document.getElementById('view-destinatario').innerText = document.getElementById('destinatario').value || "DESTINATARIO";
    document.getElementById('view-cargo').innerText = (document.getElementById('cargo').value || "CARGO").toUpperCase();
    document.getElementById('view-empresa').innerText = (document.getElementById('empresa').value || "EMPRESA").toUpperCase();
    document.getElementById('view-tratamiento').innerText = document.getElementById('tratamiento').value;
    document.getElementById('view-mencion').innerText = document.getElementById('mencion').value;
    document.getElementById('view-cite').innerText = document.getElementById('criterioCite').value || "UPFT-FI-FCEE-PP-N° 001-I-2026";
    
    const i1 = document.getElementById('info1').value || "el gran avance del área";
    document.getElementById('view-info1').innerHTML = i1.replace(/\n/g, '<br>');

    const i2 = document.getElementById('info2').value || "activo y destacado, quien, en el quinto semestre de estudios, participó del programa de intercambio estudiantil, cursando así asignaturas de la Carrera de ………en la Universidad de Boyacá, Colombia.";
    document.getElementById('view-info2').innerHTML = i2.replace(/\n/g, '<br>');

    const i3 = document.getElementById('info3').value || "ha sido miembro activo y voluntario de la Fundación UNIFRANZ, participando en eventos y actividades solidarias, de educación y prevención, ……… ";
    document.getElementById('view-info3').innerHTML = i3.replace(/\n/g, '<br>');

    const fechaVal = document.getElementById('fecha').value;
    if(fechaVal) {
        const p = fechaVal.split("-");
        document.getElementById('view-fecha').innerText = `${p[2]}-${p[1]}-${p[0]}`;
    }
}

function initResaltado() {
    Object.entries(mapCampos).forEach(([inputId, selector]) => {
        const input = document.getElementById(inputId);
        if(input) {
            input.addEventListener('focus', () => {
                document.querySelectorAll(selector).forEach(el => el.classList.add('resaltado-activo'));
            });
            input.addEventListener('blur', () => {
                document.querySelectorAll(selector).forEach(el => el.classList.remove('resaltado-activo'));
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initResaltado();
    updatePreview();
    cargarBaseDeDatos(); // Lanzamos la carga al iniciar
});

// Evento de búsqueda mientras se escribe
document.getElementById('estudiante').addEventListener('input', checkStudentMatch);

document.getElementById('formCarta').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnEnviar');
    const msg = document.getElementById('mensaje');
    btn.disabled = true;
    btn.innerText = "⏳ Generando Documento...";

    const datos = {
        estudiante: document.getElementById('estudiante').value,
        generoEstudiante: document.getElementById('generoEstudiante').value,
        criterioCite: document.getElementById('criterioCite').value,
        destinatario: document.getElementById('destinatario').value,
        cargo: document.getElementById('cargo').value,
        empresa: document.getElementById('empresa').value,
        mencion: document.getElementById('mencion').value,
        fecha: document.getElementById('fecha').value,
        tratamiento: document.getElementById('tratamiento').value,
        info1: document.getElementById('info1').value,
        info2: document.getElementById('info2').value,
        info3: document.getElementById('info3').value
    };

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        msg.style.display = "block";
        msg.style.backgroundColor = "#27ae60";
        msg.innerText = "✅ ¡Documento guardado con éxito!";
        
        setTimeout(() => {
            msg.style.display = "none";
            btn.disabled = false;
            btn.innerText = "Generar y Guardar en Drive";
        }, 3000);
    } catch (error) {
        msg.style.display = "block";
        msg.style.backgroundColor = "#e74c3c";
        msg.innerText = "❌ Hubo un error al guardar.";
        btn.disabled = false;
    }
});