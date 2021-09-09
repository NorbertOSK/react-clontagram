import Axios from 'axios';

export default async function toggleSiguiendo(usuario){
    let usuarioActualizado;

/*
en caso de estar siguiendo al user, si hacemos click
dejamsos de seguis,
destructuramos usuario y cambiamos el valos de numSeguidores y siguiendo
*/

    if (usuario.siguiendo){
        await Axios.delete(`/api/amistades/${usuario._id}/eliminar`);
        usuarioActualizado = {
            ...usuario,
            numSeguidores: usuario.numSeguidores - 1,
            siguiendo: false
        };
    }else{
        await Axios.post(`/api/amistades/${usuario._id}/seguir`);
        usuarioActualizado = {
            ...usuario,
            numSeguidores: usuario.numSeguidores + 1,
            siguiendo: true
        };
    }
    //console.log(usuarioActualizado)
    return usuarioActualizado;
}