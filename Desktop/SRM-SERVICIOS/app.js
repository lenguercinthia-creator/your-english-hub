// Turnos reservados
let citas = JSON.parse(localStorage.getItem("citas")) || [];

// Precios de los servicios
const precios = {
    consulta: 15000,
    acupuntura: 30000,
    dolor: 30000,
    homeopatia: 20000,
    obesidad: 20000,
    cardiologia: 30000
};

// Nombres de servicios para mostrar en la tabla
const nombresServicios = {
    consulta: "Consulta Médica",
    acupuntura: "Acupuntura",   
    dolor: "Tratamiento del Dolor",
    masajes: "Masajes Terapéuticos",
    homeopatia: "Homeopatía",
    obesidad: "Tratamiento de la Obesidad",
    cardiologia: "Atención Cardiológica"
};

// Agregando el turno con la validación de los campos
document.getElementById("btn-reservar").addEventListener("click", () => {
    const tipo = document.getElementById("tipo-servicio").value;
    const nombre = document.getElementById("nombre").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !telefono || !tipo || !fecha || !hora) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (!/^\d{9,12}$/.test(telefono)) {
        alert("El celular debe contener entre 9 y 12 dígitos numéricos.");
        return;
    }

    const conflicto = citas.some(cita => cita.fecha === fecha && cita.hora === hora);
    if (conflicto) {
        alert("Ya existe una cita reservada para esa fecha y hora.");
        return;
    }

    const nuevaCita = {
        id: Date.now(),
        tipo: nombresServicios[tipo],
        nombre,
        telefono,
        fecha,
        hora,
        costo: precios[tipo]
    };

    citas.push(nuevaCita);
    actualizarCitas();

    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("tipo-servicio").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").value = "";
});

// Actualizando la tabla de citas
function actualizarCitas() {
    const tabla = document.getElementById("cuerpo-tabla");
    tabla.innerHTML = "";

    citas.forEach(cita => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${cita.tipo}</td>
            <td>${cita.fecha}</td>
            <td>${cita.nombre}</td>
            <td>${cita.telefono}</td>
            <td>${cita.hora}</td>
            <td>$${cita.costo.toLocaleString()}</td>
            <td><button class="eliminar btn btn-danger" data-id="${cita.id}">Eliminar</button></td>
        `;
        tabla.appendChild(fila);
    });

    // Guardar en localStorage
    localStorage.setItem("citas", JSON.stringify(citas));

    // Actualizar total
    document.getElementById("total").innerText = citas.reduce((total, cita) => total + cita.costo, 0).toLocaleString();
}

// Eliminar la cita
function eliminarCita(id) {
    citas = citas.filter(cita => cita.id !== id);
    actualizarCitas();
}

// Confirmando las reservas con notificaciones
document.getElementById("confirmar").addEventListener("click", () => {
    if (citas.length === 0) {
        alert("No hay citas para confirmar.");
        return;
    }

    let resumen = "Resumen de citas reservadas:\n\n";
    citas.forEach(cita => {
        resumen += `${cita.tipo} - ${cita.nombre} - ${cita.telefono} - ${cita.fecha} - ${cita.hora} - $${cita.costo.toLocaleString()}\n`;
    });

    resumen += `\nTotal: $${citas.reduce((total, cita) => total + cita.costo, 0).toLocaleString()}`;
    resumen += "\n\n¿Confirma la reserva de estas citas?";

    const confirmacion = confirm(resumen);
    if (confirmacion) {
        alert("Citas confirmadas. ¡Gracias por su reserva!");
        citas = [];
        actualizarCitas();
    } else {
        alert("Puede seguir editando su reserva.");
    }
});

// Cargar las citas al cargar la página
window.addEventListener("load", () => {
    const citasGuardadas = JSON.parse(localStorage.getItem("citas"));
    if (citasGuardadas) {
        citas = citasGuardadas;
        actualizarCitas();
    }
});

// Eliminar la cita al hacer click en el botón eliminar      
document.getElementById("tabla-citas").addEventListener("click", (event) => {
    if (event.target.classList.contains("eliminar")) {
        const id = parseInt(event.target.dataset.id);
        eliminarCita(id);
    }
});
