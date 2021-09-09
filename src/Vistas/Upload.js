import React, { useState } from "react";
import Main from "../Componentes/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Componentes/Loading";
import Axios from "axios";

export default function Upload({ history, mostrarError }) {
  //estado de la url de l aimagen
  const [imagenUrl, setImagenUrl] = useState("");
  //estado loading mientars se sube l aimagen en el server
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  //estado para saber si se esta enviando post
  const [enviandoPost, setEnviandoPost] = useState(false);
  //estado guardar caption en estado
  const [caption, setCaption] = useState('');

  //funcion al seleccionar una imagen
  async function handleImagenSeleccionada(evento) {
    try {
      setSubiendoImagen(true); //cambiamos el estado a true de subir imagen
      const file = evento.target.files[0]; //agarramos el archivo que el suario selecciono

      //configuracion tipo de archivo
      const config = {
        headers: {
        'Content-Type': file.type
        },
      };

      const { data } = await Axios.post('/api/posts/upload', file, config); //destructuramos la info y hacemos el psot pasando el file y la config
      setImagenUrl(data.url); //seteamos la url de la imagen //viene de data
      setSubiendoImagen(false);
    } catch (error) {
      setSubiendoImagen(false);
      mostrarError(error.response.data);
      console.log(error);
    }
  }

  //funcion para envair post
  async function handleSubmit(evento){
    evento.preventDefault();

    if(enviandoPost) { //si estamso enviando psot retornamos y no hacemos nada
        return;
    }

    if (subiendoImagen){ //si estamos subeindo imagen
        mostrarError('No se ha terminado de subir la imagem');
        return;
    }

    if(!imagenUrl){ //si no existe url de imagen
        mostrarError('Primero selecciona una imagen');
        return;
    }

    try {
        setEnviandoPost(true);
        
        const body = {
            caption,
            url: imagenUrl
        };

        await Axios.post('/api/posts', body);
        setEnviandoPost(false);
        history.push('/')

    } catch (error) {
        mostrarError(error.response.data);
    }

  }

  return (
    <Main center>
      <div className="Upload">
        <form onSubmit={handleSubmit}>
          <div className="Upload__image-section">
            <SeccionSubirImagen
              imagenUrl={imagenUrl}
              subiendoImagen={subiendoImagen}
              handleImagenSeleccionada={handleImagenSeleccionada}
            />
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            required
            maxLength="180"
            placeholder="Información sobre tu post"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
}

//Componente para subir imagen
//lo creamos acá msimo porque es el único componente que lo utiliza

function SeccionSubirImagen({
  subiendoImagen,
  imagenUrl,
  handleImagenSeleccionada,
}) {
  if (subiendoImagen) {
    //si estamos subiendo imagen
    return <Loading />;
  } else if (imagenUrl) {
    //si el user ya selecciono imagen, revisamos si tenemos url
    return <img src={imagenUrl} alt="" />;
  } else {
    return (
      //forulario que permite escoger imagen y mostrarlo
      <label className="Upload__image-label">
        <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
        <span>Publica una foto</span>
        <input
          type="file"
          className="hidden"
          name="imagen"
          onChange={handleImagenSeleccionada}
        />
      </label>
    );
  }
}
