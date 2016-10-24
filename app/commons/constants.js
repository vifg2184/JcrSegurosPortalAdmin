/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        /*Proxy User*/
        PROXY_URL_ALL_USER_WITH_PAGINATE: environment + "Usuario/allUsersInfoWithPagination",
        PROXY_URL_ALL_USERS_TYPE: environment + "Usuario/typeUser",
        PROXY_URL_CREATE_NEW_USER: environment + "Usuario/crearUsuario",
        PROXY_URL_USER_BY_ID: environment + "Usuario/userInfoById",
        PROXY_URL_USER_FILTER_SEARCH:environment + "Usuario/userFilter",
        PROXY_URL_USER_DELETE:environment + "Usuario/borrarUsuario",

        /*Proxy Clientes*/
        PROXY_URL_CLIENT_BY_DOCUMENT:environment + "Client/clientByDocument",

        /*Proxy Poliza*/
        PROXY_URL_POLIZA_WITH_PAGINATE:environment + "Poliza/allPolizaWithPagination",
        PROXY_URL_CREATE_POLIZA:environment + "Poliza/servicioCrearPoliza",
        PROXY_URL_GET_POLIZA_BY_ID:environment + "Poliza/getPolizaById",
        PROXY_URL_DELETE_POLIZA:environment + "Poliza/borrarPoliza",
        PROXY_URL_GET_POLIZA_BY_SINIESTROS: environment + "Poliza/allPolizaWithPaginationBySiniestro",

        /*Proxy Siniestro*/
        PROXY_URL_SINIESTRO_WITH_PAGINATE: environment + "Siniestro/allSiniestrosWithPagination",
        PROXY_URL_SINIESTRO_CREATE: environment + "Siniestro/crearSiniestro",
        PROXY_URL_SINIESTRO_BY_ID:environment + "Siniestro/searchSiniestroById",
        PROXY_URL_SINIESTRO_DELETE:environment + "Siniestro/borrarSiniestro",


        /*Proxy Vehiculo*/
        PROXY_URL_VEHICULO_WITH_PAGINATE:environment + "Vehiculo/allVehiculosInfoWithPagination",
        PROXY_URL_VEHICULO_BY_ID:environment + "Vehiculo/vehiculoInfoById",
        PROXY_URL_VEHICULO_CREATE: environment + "Vehiculo/crearVehiculo",
        PROXY_URL_VEHICULO_DELETE:environment + "Vehiculo/borrarVehiculo",
        PROXY_URL_LISTA_MARCAS_VEHICULO: environment + "Vehiculo/marcaVehiculoFilter",
        PROXY_URL_SEARCH_VEHICULO_PLACA: environment +"Vehiculo/searchVehiculoByPlaca",

        /*Proxy Aseguradoras*/
        PROXY_URL_ASEGURADORAS_WITH_PAGINATE:environment + "Aseguradora/allAseguradorasWithPagination",
        PROXY_URL_ASEGURADORAS_BY_ID:environment + "Aseguradora/aseguradoraInfoById",
        PROXY_URL_ASEGURADORAS_CREATE:environment + "Aseguradora/crearAseguradora",
        PROXY_URL_ASEGURADORAS_DELETE: environment + "Aseguradora/borrarAseguradora",
        PROXY_URL_ASEGURADORAS_FIND_FILTER:environment + "Aseguradora/aseguradoraFilter",

        /*Proxy Cobertura*/
        PROXY_URL_COBERTURA_WITH_PAGINATE:environment +"Cobertura/allCoberturasInfoWithPagination",

        /*Proxy Access*/
        PROXY_URL_LOGIN: environment + "SystemList/accessUserLogin",

        /*Proxy System*/
        PROXY_URL_MENU_SHOW: environment + "SystemList/getMenuJCR",
        PROXY_URL_MENU_ACCESS_USER:environment + "SystemList/getAccessActiveMenu",
        PROXY_URL_MENU_UPDATE_ACCESS:environment + "SystemList/updateAccessMenuByUserRol",

        /*Proxy Reportes*/
        PROXY_URL_GET_INFO_RENOVACIONES: environment + "Reportes/getInfoRenovacion",
        PROXY_URL_REPORTE_RENOVACIONES: environment + "Reportes/createReportRenovacion",
        PROXY_URL_INFO_SINIESTROS: environment + "Reportes/getInfoSiniestralidad",
        PROXY_URL_REPORTES_SINIESTRALIDAD: environment + "Reportes/createReportSiniestralidad",
        PROXY_URL_INFO_SA: environment + "Reportes/getSumasAsegurasInfo",
        PROXY_URL_REPORT_SA: environment + "Reportes/createReportSA",
        PROXY_URL_INFO_VENTA_CRUZADA:environment + "Reportes/getInfoVentasCruzadas",
        PROXY_URL_REPORT_VENTAS_CRUZADAS:environment +"Reportes/createReportVentasCruzadas",

        /*Proxy Recordatorio*/
        PROXY_URL_RECORDATORIOS: environment + "Recordatorio/sendRecordatorio",

    })
    // configuracion file system imagenes
    .constant('FILE_SYSTEM_ROUTE',{
        FILE_SYSTEM_IMAGES:"http://localhost:8080/reaxium_user_images/",
        IMAGE_DEFAULT_USER:"http://localhost:8080/reaxium_user_images/profile-default.png",
        IMAGE_MARKER_MAP:"http://localhost:8080/reaxium_user_images/Map-Marker.png"
    })
    .constant('GLOBAL_CONSTANT',{
        SUCCESS_RESPONSE_SERVICE:0,
        ID_HOME_MENU:0,
        USER_ROL_ADMIN:1,
        USER_ROL_SUSCRIPCION:2,
        USER_ROL_SINIESTRO:3,
        USER_ROL_COORDINADOR:4,
        TOMADOR:1,
        TITULAR:2,
        BENEFICIARIO:3,
        RAMO_HOSPITALIZACION_COLECTIVO:1,
        RAMO_HOSPITALIZACION_INDIVIDUAL:2,
        RAMO_AUTO_FLOTA:3,
        RAMO_AUTO_INDIVIDUAL:4,
        TIPO_SINIESTRO_AUTO:2,
        TIPO_SINIESTRO_PERSONA:1,
        RAMO_AUTO_INDIVIDUAL:4,
        RAMO_AUTO_FLOTA:3,
        COBERTURA_HC_BASICA:1,
        COBERTURA_HC_EXCEOSO:2,
        COBERTURA_MATERNIDAD_BASICA:3,
        COBERTURA_MATERNIDAD_EXCESO:4,
        COBERTURA_PERDIDA_TOTAL:5,
        COBERTURA_AMPLIA:6,
        COBERTURA_RCV:7,
        COBERTURA_PRODUCTO_ESPECIALES:8,
        COBERTURA_OTROS_COBERTURAS:9,
        SELECCION_NORMAL:0,
        SELECCION_MULTIPLE:1,
    })

    .constant('MENU_JCR_SEGUROS_ACTIVE',{
        CODE_USER_MENU:1,
        CODE_POLIZAS_MENU:2,
        CODE_SINIESTRO_MENU:3,
        CODE_ASEGURADORA:4,
        CODE_OPC_ADMIN_MENU:5,
        CODE_REPORTES_MENU:6

    })

    .constant("GLOBAL_MESSAGE",{
        MESSAGE_CONFIRM_ACTION:"Estas seguro que quieres borrar?",
        MESSAGE_ERROR_FATAL:"Error Internal Plataform",
        MESSAGE_SERVICE_ERROR:"Servicio No Disponible Intente de nuevo más tarde.",
        MESSAGE_SAVE_USER_SUCCESS:"Usuario creado con exito.",
        MESSAGE_SAVE_POLIZA_SUCCCESS:"Poliza creada con exito.",
        MESSAGE_SAVE_ASEGURADORA_SUCCESS:"Aseguradora creada con exito",
        MESSAGE_SAVE_SINIESTRO_SAVE_SUCCESS:"Siniestro creado con exito",
        MESSAGE_SERVICE_ERROR_SINIESTROS:"No se encuentra la cedula o fecha indicada. Intente de nuevo.",
        MESSAGE_SERVICE_ERROR_SA: "Ingrese los datos correctamente."
    });