import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; //iconos
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons"; //de aca vienen loz iconos

export default function Error({ mensaje, esconderError }) {
  if (!mensaje) {
    //si no hay mensaje (error) no pasa nada
    return null;
  }
  //si hay error
  return (
    <div className="ErrorContainer" role="alert">
      <div className="Error__inner">
        <span className="block">{mensaje}</span>
        <button className="Error__button" onClick={esconderError}>
          <FontAwesomeIcon className="Error__icon" icon={faTimesCircle} />
        </button>
      </div>
    </div>
  );
}
