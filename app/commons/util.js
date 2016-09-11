/**
 * Created by VladimirIlich on 6/4/2016.
 * Metodos utilitarios
 * */

var numeros="0123456789";
var letras="abcdefghyjklmnñopqrstuvwxyz";

/**
 * Search object inside of array
 * @param obj
 * @returns {boolean}
 */
Array.prototype.containsObj = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


function searchObjGeo(latitude_key, longitude_key, myArray) {
    var resp = true;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].latitude === latitude_key && myArray[i].longitude === longitude_key) {
            resp = false;
        }
    }

    return resp;
}


/**
 * Empty string
 * @param str
 * @returns {boolean}
 */
function isEmptyString(str) {
    return (!str || 0 === str.length);
}

/**
 * Empty array
 * @param array
 * @returns {boolean}
 */
function isEmptyArray(array) {

    if (array.length > 0) {
        return true;
    } else {
        return false;
    }
}


/**
 * Compare two objects
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */

function compareObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}


function isDaysClass(dateSelect, daysActivity) {
    var flag = false;
    var daySelect = dateSelect.split(".");

    daysActivity.forEach(function (entry) {
        if (parseInt(entry) === parseInt(daySelect[0])) {
            flag = true;
        }

    });

    return flag;
}

/***
 *
 * @param phone
 * @returns {*}
 */
function cleanMaskPhone(phone) {

    return phone.replace("(", "").replace(")", "").replace("-", "");
}

/**
 *
 * @param date
 * @returns {*}
 */
function formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
}



/**
 * validar el request para creacion de usuario
 * @param obj
 * @param mode
 * @returns {boolean}
 */
function validateParamNewUser(obj) {

    var response = {
        isValidate: true,
        message: ""
    };

    var expRegEmail = new RegExp("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$");
    var objUsers = obj.JcrParameters.Users;
    var arrayPhones = obj.JcrParameters.Phones;
    //var objAddress = obj.JcrParameters.address;


    //validar datos del usuario
    if (objUsers.nombre == undefined || isEmptyString(objUsers.nombre)) {
        response.isValidate = false;
        response.message = "El campo nombre no debe estar vacio.";

    } else if (objUsers.apellido == undefined || isEmptyString(objUsers.apellido)) {
        response.isValidate = false;
        response.message = "El campo apellido no debe estar vacio.";

    }  else if (objUsers.tipo_usuario_id == undefined || isEmptyString(objUsers.tipo_usuario_id)) {
        response.isValidate = false;
        response.message = "Debe seleccionar un tipo de usuario.";

    }
    else if(objUsers.documento_id == undefined || isEmptyString(objUsers.documento_id)){
        response.isValidate = false;
        response.message = "El campo Documento de Identidad no debe estar vacio.";
    }
    else if (objUsers.fecha_nacimiento == undefined || isEmptyString(objUsers.fecha_nacimiento) ||
        objUsers.fecha_nacimiento.trim().toLowerCase() === "Invalid date".trim().toLowerCase()) {

            response.isValidate = false;
            response.message = "Fecha de nacimiento invalida";

    }else if(!validateDateBirthDate(objUsers.fecha_nacimiento,true)){

        response.isValidate = false;
        response.message = "Formato de Fecha Invalido. Verifique que sea este formato mm/dd/yyyy.";
    }
    else if (objUsers.correo == undefined || isEmptyString(objUsers.correo) || !objUsers.correo.match(expRegEmail)) {
        response.isValidate = false;
        response.message = "Correo invalido";
    }

    //validar que el usuario tenga por lo menos un phone
    if (response.isValidate) {
        var cont = 0;
        if (isEmptyArray(arrayPhones)) {
            arrayPhones.forEach(function (entry) {
                if (isEmptyString(entry.telefono_numero)) {
                    cont++;
                }
            });

            if (cont == 3) {
                response.isValidate = false;
                response.message = "Debe ingresar al menos un telefono de usuario.";
            }
        } else {
            response.isValidate = false;
            response.message = "Debe ingresar al menos un telefono de usuario.";
        }
    }





    return response;
}





function isUndefined(obj) {

    if (obj == undefined) {
        return true;
    }
    return false;
}


function addActiveClassMenu(arrayMenuOriginal,id_menu){

    var arrayMenu = arrayMenuOriginal;

    //active options menu
    for(var i=0; i < arrayMenu.length;i++){
        if(arrayMenu[i].id == id_menu){
            arrayMenu[i].class_active_menu = true;
        }else{
            arrayMenu[i].class_active_menu = false;
        }
    }

    return arrayMenu;
}


/**
 * Generar un numero random aleatorio
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Saber si un string contiene numeros
 * @param texto
 * @returns {number}
 */
function has_number(texto){
    for(var i=0; i<texto.length; i++){
        if (numeros.indexOf(texto.charAt(i),0)!=-1){
            return 1;
        }
    }
    return 0;
}

/**
 * Saber si un string contiene letras
 * @param texto
 * @returns {number}
 */
function has_letters(texto){
    texto = texto.toLowerCase();
    for(var i=0; i<texto.length; i++){
        if (letras.indexOf(texto.charAt(i),0)!=-1){
            return 1;
        }
    }
    return 0;
}


function validateDateBirthDate(fecha){

    var validate = true;

    if(validarFormatoFecha(fecha)){
        if(existeFecha(fecha)){
            if(!validarFechaMenorActual(fecha)){
                validate=false;
                console.log("Fecha es mayor a la actual");
            }
        }else{
            validate=false;
            console.log("Fecha es no existe es incorrecta");
        }
    }else{
        validate=false;
        console.log("Fecha tiene un formato desconocido");
    }

    return validate;
}

/**
 *
 * @param campo
 * @returns {boolean}
 */
function validarFormatoFecha(campo) {
    var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    if ((campo.match(RegExPattern)) && (campo!='')) {
        return true;
    } else {
        return false;
    }
}


/**
 *
 * @param fecha
 * @returns {boolean}
 */
function existeFecha(fecha){
    var fechaf = fecha.split("/");
    var day = fechaf[0];
    var month = fechaf[1];
    var year = fechaf[2];
    var date = new Date(year,month,'0');
    if((day-0)>(date.getDate()-0)){
        return false;
    }
    return true;
}

/**
 *
 * @param fecha
 * @returns {boolean}
 */
function existeFecha2 (fecha) {
    var fechaf = fecha.split("/");
    var d = fechaf[0];
    var m = fechaf[1];
    var y = fechaf[2];
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
}


function validarFechaMenorActual(date){
    var x=new Date();
    var fecha = date.split("/");
    x.setFullYear(fecha[2],fecha[1]-1,fecha[0]);
    var today = new Date();

    if (x >= today)
        return false;
    else
        return true;
}

function compararDosHoras(starTimep,endTimep){

    var startTime = moment(starTimep,'HH:mm:ss');
    var endTime = moment(endTimep,'HH:mm:ss');

    if(startTime.isBefore(endTime)){
        return true;
    }
    else{
        return false;
    }

}


function randomColorFactor () {
    return Math.round(Math.random() * 255);
}

function randomColor(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}