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
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var descEditable = input.closest('td').querySelector('.desc-editable');
            
            if (descEditable.innerText.trim() === "Descripcion del producto...") {
                descEditable.innerText = "";
            }
            
            // Contenedor principal de la imagen y sus botones
            var imgContainer = document.createElement('div');
            imgContainer.className = 'img-container-wrapper';
            imgContainer.contentEditable = "false"; // Evita que se borre por error al presionar letras
            
            // Elemento de imagen
            var img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            img.style.maxWidth = "160px"; // Tamaño inicial por defecto
            
            // Barra superior de herramientas (+ , - , X)
            var tools = document.createElement('div');
            tools.className = 'img-tools-bar';
            
            // Botón Agrandar (+)
            var btnZoomIn = document.createElement('button');
            btnZoomIn.innerText = "➕";
            btnZoomIn.title = "Agrandar imagen";
            btnZoomIn.onclick = function() {
                var currentWidth = parseInt(img.style.maxWidth) || 160;
                if (currentWidth < 300) { // Límite máximo para no desarmar la celda
                    img.style.maxWidth = (currentWidth + 20) + "px";
                }
            };
            
            // Botón Achicar (-)
            var btnZoomOut = document.createElement('button');
            btnZoomOut.innerText = "➖";
            btnZoomOut.title = "Achicar imagen";
            btnZoomOut.onclick = function() {
                var currentWidth = parseInt(img.style.maxWidth) || 160;
                if (currentWidth > 60) { // Límite mínimo visible
                    img.style.maxWidth = (currentWidth - 20) + "px";
                }
            };
            
            // Botón Eliminar (🗑️)
            var btnDelete = document.createElement('button');
            btnDelete.innerText = "🗑️";
            btnDelete.title = "Eliminar imagen";
            btnDelete.onclick = function() {
                if(confirm("¿Deseas eliminar esta imagen de la descripción?")) {
                    imgContainer.remove();
                    if (descEditable.innerText.trim() === "") {
                        descEditable.innerText = "Descripcion del producto...";
                    }
                }
            };
            
            // Armamos la barra de herramientas y agregamos todo al div editable
            tools.appendChild(btnZoomIn);
            tools.appendChild(btnZoomOut);
            tools.appendChild(btnDelete);
            
            imgContainer.appendChild(tools);
            imgContainer.appendChild(img);
            descEditable.appendChild(imgContainer);
            
            input.value = "";
        }
        reader.readAsDataURL(input.files[0]);
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
