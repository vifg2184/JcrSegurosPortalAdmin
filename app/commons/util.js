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

function formatDateSiniestro(date){
    return moment(date).format("DD-MM-YYYY");
}

function formatEnglish(date){
    return moment(date).format("MM/DD/YYYY");
}


/**
 * Attendnace
 * @param date
 * @returns {*}
 */
function formatDateAttendance(date){
    return moment(date).format("YYYY-MM-DD");
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
    else if (objUsers.correo == undefined || isEmptyString(objUsers.correo) || !objUsers.correo.match(expRegEmail)) {
        response.isValidate = false;
        response.message = "Correo invalido";
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


function existsTomador(listUsers){

    var validate = false;

    listUsers.forEach(function(entry){

        if(entry.type_usuario_poliza == 1){
            validate = true;
        }
    });

    return validate;
}

function existsTitular(listUsers){

    var validate = false;

    listUsers.forEach(function(entry){

        if(entry.type_usuario_poliza == 2){
            validate = true;
        }
    });

    return validate;
}


function randomColorFactor () {
    return Math.round(Math.random() * 255);
}

function randomColor(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}


function getDateFormat(date){

    var dateFinal = null;

    if (date != null || date != "") {

        var birthdate = date.split('-');

        var day = (birthdate[2].length == 1) ? "0" + birthdate[2] : birthdate[2];
        var month = (birthdate[1].length == 1) ? "0" + birthdate[1] : birthdate[1];
        var year = birthdate[0];

        var aux = month + "/" + day + "/" + year;
        dateFinal = new Date(aux);

    }
    else {
        dateFinal = new Date();
    }

    return dateFinal;
}

function confirmPassword(newPassword,confirmPassword){

    var result=true;

    if(newPassword != confirmPassword){
        result=false;
    }

    return result;
}



function validacionRangoFechaFinanciamiento(fechas_validacion){

    var result = {
        isValidate:true,
        numero_coutas:0,
        message:""
    };

    var fecha_inicio_financiamiento = formatDateAttendance(fechas_validacion.fecha_inicio_financiamiento);
    var fecha_fin_financiamiento = formatDateAttendance(fechas_validacion.fecha_fin_financiamiento);
    var fecha_emision = formatDateAttendance(fechas_validacion.fecha_emision);
    var fecha_vigencia = formatDateAttendance(fechas_validacion.fecha_vigencia);


    //primero valido si la fecha de inicio de financiamiento es mayor a la de emision

    if(!moment(fecha_inicio_financiamiento).isAfter(fecha_emision)){
        result.isValidate = false;
        result.message="La fecha de inicio del financiamiento no puedo ser menor que la fecha emision de la poliza";
    }

    if(result.isValidate){

        // valido si la fecha del fin de financiamiento no sea mayor que la de vigencia
        if(!moment(fecha_fin_financiamiento).isBefore(fecha_vigencia)){
            result.isValidate = false;
            result.message="La fecha final del financiamiento no puede ser mayor la fecha de vigencia de la poliza";
        }
    }


   if(result.isValidate){
       var numero_coutas = validacionNumeroCoutasFinanciamiento(fecha_inicio_financiamiento,fecha_vigencia);

       if(numero_coutas > 0 && numero_coutas <= 11){
           result.numero_coutas = numero_coutas;
       }
       else{
           result.isValidate = false;
           result.message = "Coutas calculadas no son validas para el financiamiento";
       }

   }

    return result;
}


function validacionNumeroCoutasFinanciamiento(fecha_inicio_financiamiento,fecha_vigencia_poliza){

    try{

        var a = moment(fecha_vigencia_poliza);
        var b = moment(fecha_inicio_financiamiento);

        var months = a.diff(b,'months');
        b.add(months, 'months');
    }catch (err){
        console.log("Error calculando cuotas: "+err);
        months = 0;
    }


    return months;
}


function validateRequestPoliza(request){

    var response = {
        isValidate: true,
        message: ""
    };


    if(request.numero_poliza == ""){
        response.message="Numero de poliza vacio";
        response.isValidate = false;
    }
    else if(request.ramo == null ){
        response.message="Ramo Invalido";
        response.isValidate = false;
    }
    else if(request.aseguradora_id == ""){
        response.message="Aseguradora no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.numero_recibo == ""){
        response.message="Numero de recibo no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.fecha_emision == ""){
        response.message="Fecha de emision no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.fecha_vencimiento == ""){
        response.message="Fecha de vigencia no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.referencia == ""){
        response.message="Campo Referencia no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.prima_total ==""){
        response.message="Campo Prima no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.agente_helper ==""){
        response.message="Campo Agente no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.asegurado.nombre_cliente == ""){
        response.message="Campo Nombre Cliente no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.asegurado.apellido_cliente == ""){
        response.message="Campo Apellido Cliente no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.asegurado.documento_id_cliente == ""){
        response.message="Campo Cedula ID cliente no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.asegurado.fecha_nacimiento == ""){
        response.message="Campo Fecha de Nacimiento Cliente no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.asegurado.genero_cliente == ""){
        response.message="Campo Genero Cliente no debe estar vacio";
        response.isValidate = false;
    }
    else if(request.asegurado.telefono == ""){
        response.message="Campo Telefonos no debe estar vacio";
        response.isValidate = false;
    }


    if(!request.asegurado.es_tomador){

        if(request.tomador.nombre_cliente == ""){
            response.message="Campo Nombre tomador no debe estar vacio";
            response.isValidate = false;
        }
        else if(request.tomador.apellido_cliente == ""){
            response.message="Campo Apellido Tomador no debe estar vacio";
            response.isValidate = false;
        }else if(request.tomador.documento_id_cliente == ""){
            response.message="Cedula de Identidad del Tomador";
            response.isValidate = false;
        }
    }


    if(request.es_financiado){

        if(request.financiamento.numero_cuotas == ""){
            response.message="Debe Seleccionar Numero de Cuotas en el Financiamiento";
            response.isValidate = false;
        }
        else if(request.financiamento.monto_inicial == ""){
            response.message="El Monto del financiamiento esta vacio";
            response.isValidate = false;
        }
        else if(request.financiamento.numero_financiamiento == ""){
            response.message="El Numero del financiamiento esta vacio";
            response.isValidate = false;
        }
    }


    return response;
}