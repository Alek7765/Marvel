import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

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

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []) // если пустой массив, то ф-ция вызовится всего 1 раз

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed')) // установить состояние подтверждения, когда лист с персонажами действительно загружен
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const elements = useMemo(() => { // для запоминания значения функции, чтоб 2 раза не рендерилось и персонаж подсвечивался при выборе
        return setContent(process, () => renderItems(charList), newItemLoading)
        // eslint-disable-next-line
    }, [process]); // массив зависимостей, следить когда нужен перерендер

    // const errorMessage = error ? <ErrorMessage /> : null; // за данный код сейчас работает ф-ция setContent
    // const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;