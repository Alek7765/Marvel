import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => { // состояние, компонент и ф-ция загрузки нового листа с персами
    switch (process) { // точное сравнение по состоянию
        case 'waiting': // если состояние ожидания
            return <Spinner />; // отображать спиннер
        case 'loading': // если состояние загрузки
            return newItemLoading ? <Component /> : <Spinner />; //грузится новый лист с персами? рендерим компонент с персами без спиннера : иначе если это 1 загрузка - будет спиннер
        case 'confirmed': // если персонаж загружен
            return <Component />; // отобразить компонент с загруженными данными (персонажем)
        case 'error': // если выйдет ошибка
            return <ErrorMessage />; // отобразить компонент с ошибкой
        default: // если не один кейс не выполнится
            throw new Error('Unexpected process state'); // выкинем новую ошибку с описанием
    }
}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { getAllComics, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed')) // установить состояние подтверждения, когда лист с комиксами действительно загружен
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 4);
        setComicsEnded(ended);
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )


    }

    // const errorMessage = error ? <ErrorMessage /> : null;
    // const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;