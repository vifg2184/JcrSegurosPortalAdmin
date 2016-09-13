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

        /*Proxy Poliza*/
        PROXY_URL_POLIZA_WITH_PAGINATE:environment + "Poliza/allPolizaWithPagination",
        PROXY_URL_POLIZA_BY_ID:environment + "Poliza/searchPolizaById",
        PROXY_URL_CREATE_POLIZA:environment + "Poliza/crearPoliza",
        PROXY_URL_GET_POLIZA_BY_ID:environment + "Poliza/searchPolizaById",
        PROXY_URL_DELETE_POLIZA:environment + "Poliza/borrarPoliza",

        /*Proxy Siniestro*/
        PROXY_URL_SINIESTRO_WITH_PAGINATE: environment + "Siniestro/allSiniestrosWithPagination",

        /*Proxy Vehiculo*/
        PROXY_URL_VEHICULO_WITH_PAGINATE:environment + "Vehiculo/allVehiculosInfoWithPagination",

        /*Proxy Aseguradoras*/
        PROXY_URL_ASEGURADORAS_WITH_PAGINATE:environment +"Aseguradora/allAseguradorasWithPagination",

        /*Proxy Cobertura*/
        PROXY_URL_COBERTURA_WITH_PAGINATE:environment +"Cobertura/allCoberturasInfoWithPagination",

        /*Proxy Access*/
        PROXY_URL_LOGIN: environment + "SystemList/accessUserLogin",

        /*Proxy System*/
        PROXY_URL_MENU_SHOW: environment + "SystemList/getMenuJCR"


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
        USER_ROL_ADMIN:4,
        TOMADOR:1,
        TITULAR:2,
        BENEFICIARIO:3
    })

    .constant('MENU_JCR_SEGUROS_ACTIVE',{
        CODE_USER_MENU:1,
        CODE_POLIZAS_MENU:2,
        CODE_VEHICULO_MENU:3,
        CODE_SINIESTRO_MENU:4,
        CODE_COBERTURA_MENU:5,
        CODE_ASEGURADORA:6,
        CODE_OPC_ADMIN_MENU:7

    })

    .constant("GLOBAL_MESSAGE",{
        MESSAGE_CONFIRM_ACTION:"Estas seguro que quieres borrar?",
        MESSAGE_ERROR_FATAL:"Error Internal Plataform",
        MESSAGE_SERVICE_ERROR:"Servicio No Disponible Intente de nuevo más tarde.",
        MESSAGE_SAVE_USER_SUCCESS:"Usuario creado con exito.",
        MESSAGE_SAVE_POLIZA_SUCCCESS:"Poliza creada con exito."
    });