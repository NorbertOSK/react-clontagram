import React, { useState } from 'react'

export default function Comentar({ onSubmitComentario, mostraError }) {
    //estado mensaje
    const [mensaje, setMensaje] = useState('');

    //entado enviando comentario
    const [enviandoComentario, setEnviadoComentario] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        if(enviandoComentario){
            return;
        }

        try {
            setEnviadoComentario(true);
            await onSubmitComentario(mensaje);
            setMensaje('');
            setEnviadoComentario(false);
        } catch (error) {
            setEnviadoComentario(false);
            mostraError('Hubo un problema guardando el comentario, intenta de nuevo.')
        }

    }

    return (
        <form className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="deja un Comentario..."
                required
                maxLength="180"
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    );
}
