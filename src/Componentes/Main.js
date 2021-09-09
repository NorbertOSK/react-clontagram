//main.js vista general para envolver el conenido de todas nuestars vistas
import React from 'react';

export default function Main({children, center}) { //destructuro los props que recibo

    let classes = `Main ${center ? 'Main--center' : ''}`
    //variable para guaradr clase
    // Siempre vamos a tener la clase Main y opcionalmente
    //una clase que depende del prop "center"
    //si "center" es true, aplicamos "Main--Center"  sino dejamos en blanco

    return <main className={classes}>{children}</main>
        //Cualquier componente que envolvamos dentro de Main, nos llega como children

}
