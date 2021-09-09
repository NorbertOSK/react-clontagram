import React, { useState } from "react";
import {Link} from 'react-router-dom'
//import Axios from "axios"; //librería para hacer llamadas
import Main from "../Componentes/Main"; //componente que envuelve el resto de componentes


export default function Login({login, mostrarError}) {

    const [emailYPassword, setEmailYPassword] = useState({
        email: "",
        password: ""
      });

    function handleInputChange(e) {
        setEmailYPassword({
          //seteo estado (cambio estado)
          ...emailYPassword, //destructurarion de usuario (copio tal cual)
          [e.target.name]: e.target.value, //vas actualziar el estado para el input
        });
      }
    
//funcion para enviar form
async function handleSubmit(e) {
    e.preventDefault(); //no hacer refresh de la pagina

    try {
      await login(emailYPassword.email, emailYPassword.password)
      //const { data } = await Axios.post("/api/usuarios/login", emailYPassword); //destructuramos la infor de lo que nso responde la llamada, siempre responde en un ojeto, y tiene una propiedad llamda data.  le pasamos el estado "usuario"
      //console.log(data);
    } catch (error) {
      mostrarError(error.response.data); //traemos el errro desde data
      console.log(error);
    }
  }

    return (
        <Main center={true}>
            <div className="FormContainer">
                <h1 className="Form__titulo">Clontagram</h1>
                <form onSubmit={handleSubmit}> 
            <input
              type="email"
              name="email"
              placeholder="Email..."
              className="Form__field"
              //required
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={emailYPassword.email}
            />
            
            <input
              type="password"
              name="password"
              placeholder="Contraseña..."
              className="Form__field"
              //required
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={emailYPassword.password}
            />
            <button className="Form__submit" type="submit">
              Login
            </button>
            <p className="FormContainer__info">
              No tienes Cuenta? <Link to="/signup">Signup</Link>
            </p>
          </form>
            </div>
        </Main>
    )
}
