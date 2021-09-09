import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import BotonLike from "./BotonLike";
import Comentar from './Comentar';

import {toggleLike, comentar} from '../Helpers/post-helpers';

export default function Post({ post, actualizarPost, mostrarError, usuario}) {
  //actualizarPost es una funcion

  const {
    //desestructuramos Post (lo que recibimos en el array9)
    numLikes,
    numComentarios,
    comentarios,
    _id,
    caption,
    url,
    usuario: usuarioDelPost,
    estaLike,
  } = post;

  //estado para evitar qe el user le de 10 click al boton de like
  const [enviandoLike, setEnviandoLike] = useState(false)

  async function onSubmitLike(){
    if(enviandoLike){
      return;
    }
    try {
        setEnviandoLike(true);
        const postActualizado = await toggleLike(post);
        actualizarPost(post, postActualizado)
        setEnviandoLike(false);
    } catch (error) {
      setEnviandoLike(false);
      mostrarError('Hubo un problema modificando el like, intenta de nuevo.')
      console.log(error)
    }
  }

  //fucnion comentar
  async function onSubmitComentario(mensaje){
    const postActualizado = await comentar(post, mensaje, usuario);
    actualizarPost(post, postActualizado);
  }


  return (
    <div className="Post-Componente">
      <Avatar usuario={usuarioDelPost} />
      <img src={url} alt={caption} className="Post-Componente__img" />

      <div className="Post-Componente__acciones">
        <div className="Post-Componente__like-container">
          <BotonLike onSubmitLike={onSubmitLike} like={estaLike} />
        </div>
        <p>Liked por {numLikes} personas</p>
        <ul>
          <li>
            <Link to={`/perfil/${usuarioDelPost.username}`}>
              <b>{usuarioDelPost.username}</b>
            </Link>{" "}
            {/*espacio en lanco, truquico */}
            {caption}
          </li>
          <VerTodosLosComentarios _id={_id} numComentarios={numComentarios} />
          <Comentarios comentarios={comentarios} />
        </ul>
      </div>
      <Comentar onSubmitComentario={onSubmitComentario} mostraError={mostrarError}/>
    </div>
  );
}


function VerTodosLosComentarios({_id, numComentarios}) {
    if (numComentarios < 4){
        return null;
    }
    return <li className="text-grey-dark">
        <Link to={`/post/${_id}`}>
            Ver los {numComentarios} comentarios
        </Link>
    </li>
}


function Comentarios({comentarios}) {
    if (comentarios.length === 0){
        return null;
    }

    return comentarios.map((comentario) => {
        return (
            <li key={comentario._id}>
                <Link to={`/perfil/${comentario.usuario.username}`}>
        <b>{comentario.usuario.username}</b>    
                </Link>{' '} 
                {comentario.mensaje}
            </li>
        )
    })
}