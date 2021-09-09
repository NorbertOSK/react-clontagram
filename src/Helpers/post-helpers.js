//nos ayuda con operacione sque realizamos sobre el objeto post
import Axios from 'axios';

/*
tenemos un helper que hace una llamada al serverser y nos retorna un post con datos actualiados
nos trae la info sobre si el post esta like o no eta like
luego avisamos al componente feed, para ue haga el ri-render

*/

//toogle en ingles significa cambiar de prendio a apagado, o de prendido a apagado
export async function toggleLike(post){

    const url = `/api/posts/${post._id}/likes`;
    let postConLikeActualizado;

    if (post.estaLike) { //eliminamso el like
        await Axios.delete(url, {});
        postConLikeActualizado = { //destructuro el post, excepto estaLike y numLikes
            ...post,
            estaLike: false, //ponemos en  falso y restamos uno
            numLikes: post.numLikes - 1
        }

    } else { //si no le di like
        await Axios.post(url, {})
        postConLikeActualizado = {
            ...post,
            estaLike: true, //ponemos en true y sumamos uno
            numLikes: post.numLikes + 1
        }
    }

    return postConLikeActualizado; //retorna version actualizada del post, queda renderzar la nueva data
}

//funcion para dejar comentarios en el post
export async function comentar(post, mensaje, usuario){
    const {data: nuevoComentario} = await Axios.post(
        `/api/posts/${post._id}/comentarios`,
        {mensaje}
    );

    nuevoComentario.usuario = usuario;
    const postConComentariosActualizados = {
        ...post,
        comentarios: [...post.comentarios, nuevoComentario],
        numComentarios: post.numComentarios + 1
    }

    return postConComentariosActualizados;
}