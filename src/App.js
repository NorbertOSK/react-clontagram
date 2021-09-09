import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "axios";

import {
  setToken,
  deleteToken,
  getoken,
  initAxiosInterceptors,
} from "./Helpers/auth-helpers";
import Nav from "./Componentes/Nav";
import Loading from "./Componentes/Loading";
import Error from './Componentes/Error'

import Signup from "./Vistas/Signup";
import Login from "./Vistas/Login";
import Feed from './Vistas/Feed'
import Post from './Vistas/Post'
import Perfil from './Vistas/Perfil'
import Explore from './Vistas/Explore'
import Upload from './Vistas/Upload'
import Main from "./Componentes/Main";

initAxiosInterceptors();

export default function App() {
  //Estado de usuario
  const [usuario, setUsuario] = useState(null); //estado incial de usuario es null porque no sabemo si hay un user autenticado

  //Estado cargando usuario
  const [cargandousuario, setCargandoUsuario] = useState(true); //boolean, inicialmente esta en true.N.

  //estado de que cntienen errores
  const [error, setError]  = useState(null);

  useEffect(() => {
    async function cargarUsuario() {
      //priemro revisamos si hay un token
      if (!getoken()) {
        setCargandoUsuario(false);
        return;
      }
      try {
        const { data: usuario } = await Axios.get("/api/usuarios/whoami");
        setUsuario(usuario);
        setCargandoUsuario(false);
      } catch (error) {
        console.log(error);
      }
    }
    cargarUsuario();
  }, []); //array ara que no se ejcute infinitamente

  //funcion para login y manejo de token
  async function login(email, password) {
    const { data } = await Axios.post("/api/usuarios/login", {
      email,
      password,
    }); //retorna data.usuario y data.token
    setUsuario(data.usuario);
    setToken(data.token); //guardamos el token con la funcion que importamos desde Helpers
  }

  //funcion para signup y manejo de token
  async function signup(usuario) {
    const { data } = await Axios.post("/api/usuarios/signup", usuario); //retorna data.usuario y data.token
    setUsuario(data.usuario);
    setToken(data.token); //guardamos el token con la funcion que importamos desde Helpers
  }

  //logout, devolver el usuario a null y borrar token
  function logout() {
    setUsuario(null);
    deleteToken();
  }

  //funcionan mostrar error
  
  /*function mostrarError(mensaje){
    setError(mensaje);
  }*/  
  //funcionan mostrar error (da error de string en contraseña?)
  function mostrarError(mensaje){
    if (mensaje && mensaje.message) {
    setError(mensaje.message);
    } else {
    setError(mensaje);
    }
    }
  

  //esconder error
  function esconderError(){
    setError(null);
  }

  //antes de retornar, comprobamos si estamos cargando la info del usuario
  if (cargandousuario) {
    return (
      <Main center={true}>
        <Loading />
      </Main>
    );
  }

  return (
    <Fragment>
      <Router>
        <Nav usuario={usuario}/>
        <Error mensaje={error} esconderError={esconderError}/>
        {usuario ? (//si tengo un usuario, rederizo LoginRoutes, sino tengo un usaurio, renderizo Logoutroutes 
        <LoginRoutes mostrarError={mostrarError} usuario={usuario} logout={logout}/>
         ) : (
         <LogoutRoutes login={login} signup={signup} mostrarError={mostrarError}/>
         )} 
      </Router>
    </Fragment>
  );
}

//cuando hay usuario logueado
function LoginRoutes({mostrarError, usuario, logout}) {//renderiza las rutas que el usuario puede acceder una vez que este autenticado
  return (
    <Switch>
      <Route
        path="/upload"
        render={(props) => <Upload {...props} mostrarError={mostrarError}/>}
      />
      <Route
        path="/post/:id"
        render={(props) => <Post {...props} mostrarError={mostrarError} usuario={usuario}/>}
      />
      <Route
        path="/perfil/:username"
        render={(props) => <Perfil {...props} mostrarError={mostrarError} usuario={usuario} logout={logout}/>}
      />
      <Route
        path="/explore"
        render={(props) => <Explore {...props} mostrarError={mostrarError}/>}
      />
      <Route path="/" 
      render={(props) => <Feed {...props} mostrarError={mostrarError} usuario={usuario}/>}
      />
      {/*funcon en linea para mostrar un feed*/}
     
    </Switch>
  );
}

//cuando no ay usuario logueado
function LogoutRoutes({ login, signup, mostrarError }) {
  //renderiza las rutas que el usuario puede acceder SINOeste autenticado
  return (
    <Switch>
      <Route
        path="/login"
        render={(props) => <Login {...props} login={login} mostrarError={mostrarError}/>}
      />
      <Route render={(props) => <Signup {...props} signup={signup} mostrarError={mostrarError}/>} default />
    </Switch>
  );
}
