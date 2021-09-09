import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import Post from '../Componentes/Post';


//funcion que carga post
async function cargarPosts(fechaUltimoPost) { //recibe una fecha para los query
    const query = fechaUltimoPost ? `?fecha=${fechaUltimoPost}` : ''; //si existe una "fechaUltimoPost" agrega la fecha al query, sino hay, no hay query
    const { data: nuevosPosts } = await Axios.get(`/api/posts/feed${query}`)

    return nuevosPosts;
}

const NUMERO_DE_POSTS_POR_LLAMADA = 3;

export default function Feed({ mostraError, usuario }) {
    //estado de componentes feed post
    const [posts, setPosts] = useState([]);
    //estado loading
    const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true) //apenas el componente se carga, se muestra el loading (true)
    //estado cargando mas post
    const [cargandoMasPosts, setCargandoMasPosts] = useState(false);
    //ya cargamos todos lso post?
    const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);



    useEffect(() => {
        async function cargarPostIniciales() {
            try {
                const nuevosPosts = await cargarPosts(); //cargamos los primeros post que van aparecer
                setPosts(nuevosPosts); //agrego nuevos post al estado del componente
                console.log(nuevosPosts)
                setCargandoPostIniciales(false); //una vez cargamos los post inicilaes,ponemos el estado en false
                revisarSiHayMasPosts(nuevosPosts);
            } catch (error) {
                mostraError('Hubo un problema al cargar el feed')
                console.log(error)
            }
        }

        cargarPostIniciales()
    }, []);


    //funcion actualizar post para hacer nuevo render (luego del like)
    function actualizarPost(postOriginal, postActualizado) {
        setPosts((posts) => { //le pasamos una fucnion a setPost
            const postsActualizados = posts.map(post => {
                if (post !== postOriginal) { //si el post es difertente al post original no hacemos nada
                    return post;
                }
                return postActualizado;
            })
            return postsActualizados;
        })
    }

    //fucnion para el boton ver más
    async function cargarMasPost() {
        if (cargandoMasPosts) {
            return;
        }
        try {
            setCargandoMasPosts(true);
            const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;
            const nuevosPosts = await cargarPosts(fechaDelUltimoPost)
            setPosts(viejosPosts => [...viejosPosts, ...nuevosPosts])   //construimos un neuvo aray con los viejos y neuvos psots
            setCargandoMasPosts(false);
            revisarSiHayMasPosts(nuevosPosts);
        } catch (error) {
            mostraError('huo un prolema cargando los siguientes problemas')
            setCargandoMasPosts(false);
            console.log(error)
        }
    }

    //revisar si hay más post
    function revisarSiHayMasPosts(nuevosPosts) {
        if (nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA) {
            setTodosLosPostsCargados(true);
        }
    }

    if (cargandoPostIniciales) { //si estamso cargando post inciiales, mostramso loading
        return (
            <Main center>
                <Loading />
            </Main>
        )
    }

    if (!cargandoPostIniciales && posts.length === 0) { //si terminamos de cargar los post yniciale sy nuestro array esta vacio:
        return <Main>
            <NoSiguesANadie />
        </Main>
    }


    return (
        <Main center>
            <div className="Feed">
                { //iteramos sobre post y renderizamos el componente Post importado con la data que iteramos
                    posts.map(post => (<Post key={post._id} post={post} actualizarPost={actualizarPost} mostraError={mostraError} usuario={usuario} />))
                }
                <CargarMasPosts onClick={cargarMasPost} todosLosPostsCargados={todosLosPostsCargados} />
            </div>
        </Main>
    );
}

//componente que muestar mensaje si recibe un array vacios
//lo creamos aquí mismo, porque se utiliza solo aquí

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                Tu feed no tiene fotos porque no sigues a andie o proque no han publicado fotos.
            </p>
            <div className="text-center">
                <Link to='/explore' className="NoSiguesANadie__boton">
                    Explora Clontagram
                </Link>
            </div>
        </div>
    );
}


function CargarMasPosts({ onClick, todosLosPostsCargados }) { //todosLosPostsCargados (boolean)
    if (todosLosPostsCargados) {
        return <div className="Feed__no-hay-mas-posts">No hay más posts</div>
    }

    return (
        <button className="Feed__cargar-mas" onClick={onClick}>
            Ver más
        </button>
    );
}