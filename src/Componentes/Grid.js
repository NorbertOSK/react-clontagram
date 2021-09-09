import React from 'react'
import { Link } from 'react-router-dom'

export default function Grid({ posts }) {
    /*[1,2,3,4,5] -> [[1,2,3], [,4,5]] convertimos un array de 5 elementos en 2 array de 3 elementos
    empezamos con un array en blanco que reduce lo recibe
    revisamos si tenemos espacio en al ultima columna par aponer ese psot

    si existe y tiene mens sde 3 elemenso, le empujo el post
    en caso contrario, creo una nueva columna y le paso ese array

*/
    const columnas = posts.reduce((columnas, post) => {
        const ultimaColumna = columnas[columnas.length - 1];

        if (ultimaColumna && ultimaColumna.length < 3) {
            ultimaColumna.push(post)
        } else {
            columnas.push([post])
        }

        return columnas;

    }, []);

    console.log('Lista de posts', posts);
    console.log('columnas', columnas);

    return (
        <div>
            {
                columnas.map((columna, index) => {
                    return (
                        <div key={index} className="Grid__row">
                            {
                                columna.map(post => (
                                    <GridFoto key={post._id} {...post} />
                                ))
                            }
                        </div>
                    )
                })
            }
        </div>
    );
}


function GridFoto({ _id, url, caption }) {
    return (
        <Link to={`/post/${_id}`} className="Grid__post">
            <img src={url} alt={caption} className="Grid__post-img"/>
        </Link>
    );
}