window.onload = function() {
    var fecha = new Date();
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    document.getElementById('autoDate').innerText = fecha.getDate() + " de " + meses[fecha.getMonth()] + " " + fecha.getFullYear();
    runCalculations();
};

function syncName() {
    document.getElementById('commercialClient').value = document.getElementById('clientNameInput').value;
}

function addNewRow() {
    var container = document.getElementById('productContainer');
    var tr = document.createElement('tr');
    tr.className = 'product-row';
    tr.innerHTML = `
        <td>
            <button class="btn-del" onclick="removeRow(this)">X</button>
            <input type="text" class="text-center row-qty" value="1" oninput="runCalculations()">
        </td>
        <td><input type="text" class="text-center" value="U"></td>
        <td>
            <!-- Dejamos el div vacío y le añadimos el atributo placeholder -->
            <div class="desc-editable" contenteditable="true" placeholder="Escribe la descripción del producto aquí..."></div>
            <div class="image-uploader-wrapper">
                <button class="btn-image" onclick="this.nextElementSibling.click()">📷 Agregar Imagen</button>
                <input type="file" accept="image/*" style="display: none;" onchange="uploadImage(this)">
            </div>
        </td>
        <td><input type="text" class="text-right row-vunit" value="0.00" oninput="runCalculations()"></td>
        <td class="text-right row-total" style="padding-right:10px; font-weight: bold;">$0.00</td>
    `;
    container.appendChild(tr);
    runCalculations();
}


function removeRow(button) {
    button.closest('.product-row').remove();
    runCalculations();
}

function uploadImage(input) {
    if (input.files && input.files[0]) { // <-- Corrección aquí
        var reader = new FileReader();
        reader.onload = function (e) {
            // Buscamos el div editable que está arriba en la misma celda
            var descEditable = input.closest('td').querySelector('.desc-editable');
            
            // Creamos el elemento de imagen
            var img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            img.title = "Haz clic para eliminar la imagen";
            
            // Permitir eliminar la imagen si se hace clic sobre ella
            img.onclick = function() {
                if(confirm("¿Deseas eliminar esta imagen de la descripción?")) {
                    this.remove();
                }
            };
            
            // Insertamos la imagen al final del contenido
            descEditable.appendChild(img);
            
            // Limpiamos el input para poder subir la misma imagen de nuevo si se borra
            input.value = "";
        }
        reader.readAsDataURL(input.files[0]); // <-- Corrección aquí
    }
}

function runCalculations() {
    var rows = document.getElementsByClassName('product-row');
    var globalSubtotal = 0;
    for (var i = 0; i < rows.length; i++) {
        var qty = parseFloat(rows[i].querySelector('.row-qty').value.replace(/[^0-9.]/g, '')) || 0;
        var vunit = parseFloat(rows[i].querySelector('.row-vunit').value.replace(/[^0-9.]/g, '')) || 0;
        var rowSub = qty * vunit;
        globalSubtotal += rowSub;
        rows[i].querySelector('.row-total').innerHTML = '\$' + rowSub.toFixed(2);
    }
    var globalIva = globalSubtotal * 0.15;
    var globalTotal = globalSubtotal + globalIva;
    document.getElementById('subtotal').innerHTML = '\$' + globalSubtotal.toFixed(2);
    document.getElementById('iva').innerHTML = '\$' + globalIva.toFixed(2);
    document.getElementById('totalGeneral').innerHTML = '\$' + globalTotal.toFixed(2);
}

// Borra el texto por defecto al hacer clic si el usuario no ha escrito nada propio
function clearPlaceholder(element) {
    if (element.innerText.trim() === "Descripcion del producto..." || element.innerText.trim() === "Descripción del nuevo producto...") {
        element.innerText = "";
    }
}

// Devuelve el texto por defecto si el usuario dejó la celda vacía al salir
function restorePlaceholder(element) {
    if (element.innerText.trim() === "") {
        element.innerText = "Descripcion del producto...";
    }
}
// Sincroniza el nombre desde el encabezado hacia la tabla comercial
function syncName() {
    document.getElementById('commercialClient').value = document.getElementById('clientNameInput').value;
}

// Sincroniza el nombre al revés: desde la tabla comercial hacia el encabezado principal
function syncNameReverse() {
    document.getElementById('clientNameInput').value = document.getElementById('commercialClient').value;
}

// Borra temporalmente el texto guía simulado al hacer clic en el input
function clearInputPlaceholder(input) {
    input.setAttribute('data-placeholder', input.getAttribute('placeholder') || '');
    input.setAttribute('placeholder', '');
}

// Restaura el texto guía si el usuario sale del input y no escribió nada
function restoreInputPlaceholder(input, textDefault) {
    if (input.value.trim() === "") {
        input.setAttribute('placeholder', textDefault);
    }
}
