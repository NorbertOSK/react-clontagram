import Axios from 'axios';

//se encarga de guardar, leer, elimianr el token y de asegurar que se añada a la llamada privada
const TOKEN_KEY = 'CLONTAGRAM_TOKEN';

//Guardamos el toke
export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
    //local storage, recibe el key y el valor, en este caso el token_key y el token
}

//leer el token
export function getoken() {
    return localStorage.getItem(TOKEN_KEY);
}

//eliminar token de localstorage
export function deleteToken(){
    localStorage.removeItem(TOKEN_KEY)
}


//funcion para interceptar axios
//antes de cada llamada, se agrega el token a la llamada
export function initAxiosInterceptors(){
    Axios.interceptors.request.use(function(config) {
        const token = getoken(); //leermo el token

        if(token) {//si el token existe lo agregamos a la llamada
            config.headers.Authorization = `bearer ${token}`
        }
        return config;
    });

    Axios.interceptors.response.use( //si la llamada al servidor es exitosa, que pase
        function(response) {
            return response;
        },
        function(error){
            if (error.response.status === 401){ //si nuestro token estamamlo, vencido, lo borramos de lcoalstorage
                deleteToken();
                window.location = '/login' //manadmos al user a al pantalla de inicio de sesion para que haga login
            } else { //si el error es otro
                return Promise.reject(error);
            }
        }
    )
}

