// =====================================================
// JavaScript Principal del Sistema de Biblioteca
// =====================================================

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // Confirmación para eliminaciones
    const deleteButtons = document.querySelectorAll('.btn-danger[type="submit"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('¿Está seguro de realizar esta acción?')) {
                e.preventDefault();
            }
        });
    });

    // Resaltar fila de tabla al pasar el mouse
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f8ff';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // Auto-focus en el primer input de formularios
    const firstInput = document.querySelector('.form-control');
    if (firstInput) {
        firstInput.focus();
    }

    console.log('Sistema de Biblioteca - Cargado correctamente');
});

// Función para formatear fechas
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-GT', opciones);
}

// Función para validar formularios antes de enviar
function validarFormulario(formulario) {
    const inputs = formulario.querySelectorAll('[required]');
    let valido = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valido = false;
        } else {
            input.style.borderColor = '';
        }
    });

    return valido;
}
