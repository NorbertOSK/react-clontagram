import React, { useState } from "react";
import {Link} from 'react-router-dom'
//import Axios from "axios"; //librería para hacer llamadas
import Main from "../Componentes/Main"; //componente que envuelve el resto de componentes
import imagenSignup from "../imagenes/signup.png"; //improtamos imagen (react luego lo compila)

export default function Signup({signup, mostrarError}) {
  //declaramos estado
  const [usuario, setUsuario] = useState({
    email: "",
    username: "",
    password: "",
    bio: "",
    nombre: "",
  });

  //variables para guardar el valor de los campos del form
  /*const usuario = {
    email: '',
    username: '',
    password: '',
    bio: '',
    nombre: ''
  }*/

  //funcion que detecta cambio de inpust
  function handleInputChange(e) {
    setUsuario({
      //seteo estado (cambio estado)
      ...usuario, //destructurarion de usuario (copio tal cual)
      [e.target.name]: e.target.value, //vas actualziar el estado para el input
    });
    //usuario[e.target.name] = e.target.value // a usuario en la propiedad que viene del name, le asignamso el valro del input
    //e.persist(); //eevnto por default de react
    //console.log(e.target.name, e.target.value);
    /*console.log({
        ...usuario, 
        [e.target.name] : e.target.value
      })*/
  }

  //funcion para enviar form
  async function handleSubmit(e) {
    e.preventDefault(); //no hacer refresh de la pagina

    try {
      await signup(usuario);
      //const { data } = await Axios.post("/api/usuarios/signup", usuario); //destructuramos la infor de lo que nso responde la llamada, siempre responde en un ojeto, y tiene una propiedad llamda data.  le pasamos el estado "usuario"
      setUsuario({ //codigo mío para volver a limpair el formulario luego de enviarlo
        email: "",
        username: "",
        password: "",
        bio: "",
        nombre: "",
      });
      //console.log(data);
    } catch (error) {
      mostrarError(error.response.data); //traemos el errro desde data
      console.log(error);
    }
  }

  return (
    <Main center={true}>
      <div className="Signup">
        <img src={imagenSignup} alt="" className="Signup__img" />
        <div className="FormContainer">
          <h1 className="Form__titulo">Clontagram</h1>
          <p className="FormContainer__info">
            Registrate para que veas el clon de Instagram
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email..."
              className="Form__field"
              //required
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={usuario.email}
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              className="Form__field"
              //required
              minLength="3"
              maxLength="100"
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={usuario.nombre}
            />
            <input
              type="text"
              name="username"
              placeholder="Username..."
              className="Form__field"
              //required
              minLength="3"
              maxLength="30"
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={usuario.username}
            />
            <input
              type="text"
              name="bio"
              placeholder="Cuéntanos de ti..."
              className="Form__field"
              //required
              minLength="3"
              maxLength="150"
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={usuario.bio}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña..."
              className="Form__field"
              //required
              onChange={handleInputChange} //cuando cambies ejecuta mi funcion
              value={usuario.password}
            />
            <button className="Form__submit" type="submit">
              Sign Up
            </button>
            <p className="FormContainer__info">
              Ya tienes Cuenta? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
