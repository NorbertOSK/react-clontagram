import React, { useState, useEffect } from "react";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Grid from "../Componentes/Grid";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";
import Axios from "axios";
import stringToColor from "string-to-color";
import { toggleLike } from "../Helpers/post-helpers";
import toggleSiguiendo from "../Helpers/amistad-helpers";
import useEsMobil from "../Hooks/useEsMobil";

export default function Perfil({ mostrarError, usuario, match, logout }) {
  const username = match.params.username; //leemos el username de los paramos de la url

  //estado de info del usuario al perfil que vamos a mostrar
  const [usuarioDueñoDelPerfil, setUsuarioDueñoDelPerfil] = useState(null);
  //posts
  const [posts, setPosts] = useState([]);
  //loading
  const [cargandoPerfil, setCargandoPerfil] = useState(true); //loading
  //perfil no existe
  const [perfilNoExiste, setPerfilNoExiste] = useState(false);
  //subiendo imagen
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  //estado nviando amistad, para seguir dejar de seguir
  const [enviandoAmistad, setEnviandoAmistad] = useState(false);

  const esMobil = useEsMobil();

  useEffect(() => {
    async function cargarPostyUsuario() {
      try {
        setCargandoPerfil(true);
        const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);
        const { data: posts } = await Axios.get(
          `/api/posts/usuario/${usuario._id}`
        ); //no utilizamos un Promise.all porque primero necesitamos saber la data del username, para saber el usuario
        setUsuarioDueñoDelPerfil(usuario);
        setPosts(posts);
        setCargandoPerfil(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setCargandoPerfil(true);
        } else {
          mostrarError("Hubo un prblema cargando el perfil");
        }
        setCargandoPerfil(false);
        console.log(error);
      }
    }
    cargarPostyUsuario();
  }, [username]);

  //Funcion herlper para saber si l perfil que estamos viendo es del user logueado, depende de esto par amostrar ciertas cosas como el boton logout
  function esElPerfilDeLaPersonaLogin() {
    return usuario._id === usuarioDueñoDelPerfil._id;
  }

  //funcion para subir imagen al server
  async function handleImagenSeleccionada(event) {
    try {
      setSubiendoImagen(true);
      const file = event.target.files[0]; //acceso a la foto que el usuario selecciono
      const config = {
        //configuracion de axios
        headers: {
          "Content-Type": file.type,
        },
      };
      const { data } = await Axios.post("/api/usuarios/upload", file, config); //le pasamos el archivo y la configuración
      setUsuarioDueñoDelPerfil({ ...usuarioDueñoDelPerfil, imagen: data.url }); //a la nfo que ya tenemos del usauriodueño del perfile, le cambiamos la propiedad imagen
      setSubiendoImagen(false);
    } catch (error) {
      mostrarError(error.response.data);
      setSubiendoImagen(false);
      console.log(error);
    }
  }

  //funcion seguir dejar de seguir
  async function onToggleSiguiendo() {
    if (enviandoAmistad) {
      return;
    }
    try {
      setEnviandoAmistad(true);
      const usuarioActualizado = await toggleSiguiendo(usuarioDueñoDelPerfil);
      setUsuarioDueñoDelPerfil(usuarioActualizado);
      setEnviandoAmistad(false);
    } catch (error) {
      mostrarError(
        "Hubo un problema siguiendo/dejando de seguir a este usuario"
      );
      setEnviandoAmistad(false);
      console.log(error);
    }
  }

  if (cargandoPerfil) {
    return (
      <Main center>
        <Loading></Loading>
      </Main>
    );
  }

  if (perfilNoExiste) {
    return (
      <RecursoNoExiste mensaje="el perfil que estas intentando ver no existe" />
    );
  }

  //revisamos si user es null = error en servidor o en la llamda ala api
  //imprime error del try catch
  if (usuario == null) {
    return null;
  }

  return (
    <Main>
      <div className="Perfil">
        <ImagenAvatar
          esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin()}
          usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}
          handleImagenSeleccionada={handleImagenSeleccionada}
          subiendoImagen={subiendoImagen}
        />
        <div className="Perfil__bio-container">
          <div className="Perfil__bio-heading">
            <h2 className="capitalize">{usuarioDueñoDelPerfil.username}</h2>
            {
              !esElPerfilDeLaPersonaLogin() && (
                <BotonSeguir
                  siguiendo={usuarioDueñoDelPerfil.siguiendo}
                  toggleSiguiendo={onToggleSiguiendo}
                />
              ) //si no estoy viendo mi perfil, puedo seguir y dejar de seguir a otro
            }
            {esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout} />}
          </div>
          {!esMobil && (
            <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
          )}
        </div>
      </div>
      {esMobil && (
        <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
      )}
      <div className="Perfil__separador" />
      {posts.length > 0 ? <Grid posts={posts} /> : <NoHaPosteadoFotos />}
    </Main>
  );
}

//componente mostrar la imagen y cambiar imagen
function ImagenAvatar({
  esElPerfilDeLaPersonaLogin,
  usuarioDueñoDelPerfil,
  handleImagenSeleccionada,
  subiendoImagen,
}) {
  let contenido;

  if (subiendoImagen) {
    contenido = <Loading />;
  } else if (esElPerfilDeLaPersonaLogin) {
    //preguntamos si vemos nuestro perfil, y nos da un contenido, si tenemsoimagen de perfil; la misma, en caso de que no, un color contruido en base al perfil y me deja subir una imagen de perfil
    contenido = (
      <label
        className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
        style={{
          backgroundImage: usuarioDueñoDelPerfil.imagen
            ? `url(${usuarioDueñoDelPerfil.imagen})`
            : null,
          backgroundColor: stringToColor(usuarioDueñoDelPerfil.username),
        }}
      >
        <input
          type="file"
          onChange={handleImagenSeleccionada}
          className="hidden"
          name="imagen"
        />
      </label>
    );
  } else {
    //si estoy viendo el perfil de otra persona
    contenido = (
      <div
        className="Perfil__img-placeholder"
        style={{
          backgroundImage: usuarioDueñoDelPerfil.imagen
            ? `url(${usuarioDueñoDelPerfil.imagen})`
            : null,
          backgroundColor: stringToColor(usuarioDueñoDelPerfil.username),
        }}
      />
    );
  }

  return <div className="Perfil__img-container">{contenido}</div>;
}

//seguir a usuarios y dejar de seguir
function BotonSeguir({ siguiendo, toggleSiguiendo }) {
  return (
    <button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
      {siguiendo ? "Dejar de Seguir" : "Seguir"}
    </button>
  );
}

//componente logout
function BotonLogout({ logout }) {
  return (
    <button className="Perfil__boton-logout" onClick={logout}>
      Logout
    </button>
  );
}

//componente descripcion perfil
function DescripcionPerfil({ usuarioDueñoDelPerfil }) {
  return (
    <div className="Perfil__descripcion">
      <h2 className="Perfil__nombre">{usuarioDueñoDelPerfil.nombre}</h2>
      <p>{usuarioDueñoDelPerfil.bio}</p>
      <b>{usuarioDueñoDelPerfil.numSiguiendo}</b> following
      <span className="ml-4">
        <b>{usuarioDueñoDelPerfil.numSeguidores}</b> followers
      </span>
    </div>
  );
}

//componente par amostrar que suer no tiene fotos
function NoHaPosteadoFotos(){
  return <p className="text-center">Este Usuario No ha Posteado Fotos</p>
}