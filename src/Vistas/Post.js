import React, { useState, useEffect } from "react";
import Main from "../Componentes/Main";
import Loaing from "../Componentes/Loading";
import Avatar from "../Componentes/Avatar";
import Comentar from "../Componentes/Comentar";
import BotonLike from "../Componentes/BotonLike";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";
import { Link } from "react-router-dom";
import Axios from "axios";

import { toggleLike, comentar } from '../Helpers/post-helpers';


export default function PostVista({ mostrarError, match, usuario }) {
  const postId = match.params.id;

  //estado con al data del psot
  const [post, setPost] = useState(null);

  //stado loading
  const [loading, setLoading] = useState(true);

  //estado post no existe
  const [postNoExiste, setPostNoExiste] = useState(false);

  //estado para evitar qe el user le de 10 click al boton de like
  const [enviandoLike, setEnviandoLike] = useState(false)


  useEffect(() => {
    async function cargarPoat() {
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`);
        setPost(post);
        setLoading(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setPostNoExiste(true);
        } else {
          mostrarError("Hubo un problema cargando este psot");
        }
        setLoading(false);
      }
    }
    cargarPoat();
  }, [postId]); //la dependencia de useEffec, limpiamos, porque queremos volve a ajecutar useEffect si cambia el id



  //funcion para dejar comentario
  //fucnion comentar
  async function onSubmitComentario(mensaje) {
    const postActualizado = await comentar(post, mensaje, usuario);
    setPost(postActualizado);
  }

  //fncion like (duplicado?)
  async function onSubmitLike() {
    if (enviandoLike) {
      return;
    }
    try {
      setEnviandoLike(true);
      const postActualizado = await toggleLike(post);
      setPost(postActualizado)
      setEnviandoLike(false);
    } catch (error) {
      setEnviandoLike(false);
      mostrarError('Hubo un problema modificando el like, intenta de nuevo.')
      console.log(error)
    }
  }

  if (loading) {
    return (
      <Main center>
        <Loaing />
      </Main>
    );
  }

  if (postNoExiste) {
    return (
      <RecursoNoExiste mensaje="El mensaje que intenas ver no existe"></RecursoNoExiste>
    );
  }

  //si el error es otro de los que condiciono mostramos este error
  if (post == null) {
    return null;
  }

  return (
    <Main center>
      <Post {...post} onSubmitComentario={onSubmitComentario} onSubmitLike={onSubmitLike} />
    </Main>
  );
}

function Post({
  comentarios,
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubmitComentario,
}) {
  return (
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt="{caption}" />
      </div>
      <div className="Post__side-bar">
        <Avatar usuario={usuario}></Avatar>

        <div className="Post__comentarios-y-like">
          <Comentarios
            usuario={usuario}
            caption={caption}
            comentarios={comentarios}
          ></Comentarios>
          <div className="Post__like">
            <BotonLike onSubmitLike={onSubmitLike} like={estaLike}></BotonLike>
          </div>
          <Comentar onSubmitComentario={onSubmitComentario} />
        </div>
      </div>
    </div>
  );
}

function Comentarios({ usuario, caption, comentarios }) {
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario">
        <Link
          to={`/perfil/${usuario.username}`}
          className="Post__autor-comentario"
        >
          <b>{usuario.username}</b>
        </Link>{' '}
        {caption}
      </li>
      {comentarios.map(comentario => (
        <li className="Post__comentario" key={comentario._id}>
          <Link
            to={`/perfil/${comentario.usuario.username}`}
            className="Post__autor-comentario"
          >
            <b>{comentario.usuario.username}</b>
          </Link>{' '}
          {comentario.mensaje}
        </li>
      ))}
    </ul>
  );
}
