import React from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCameraRetro} from '@fortawesome/free-solid-svg-icons';
import {faCompass, faUser} from '@fortawesome/free-regular-svg-icons';



export default function Nav({usuario}) { //componente responsable del render de la barra de navegacion (le pasamos un usuario, porque si hay un user logueado, le mostramso las rutas de lso user logueados)
    return (
        <nav className="Nav">
            <ul className="Nav__links">
                   <li>
                       <Link to='/' className="Nav__link">
                           Clontagram
                       </Link>
                    </li>
                    {usuario && <LoginRoutes usuario={usuario} />} {/*si hay un user renderizamos este componente*/}    
            </ul>        
        </nav>
    )
}


function LoginRoutes({usuario}){
    return (
        <>
        <li className="Nav__link-push">
            <Link className="Nav__link" to="/upload">
                <FontAwesomeIcon icon={faCameraRetro} />
            </Link>
        </li>
        <li className="Nav__link-margin-left">
            <Link className="Nav__link" to="/explore">
                <FontAwesomeIcon icon={faCompass} />
            </Link>
        </li>
        <li className="Nav__link-margin-left">
            <Link className="Nav__link" to={`/perfil/${usuario.username}`}>
                <FontAwesomeIcon icon={faUser} />
            </Link>
        </li>
        </>
    )
}