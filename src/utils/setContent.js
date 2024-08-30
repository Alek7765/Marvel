import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

const setContent = (process, Component, data) => { // состояние, компонент и данные например с персонажем
    switch (process) { // точное сравнение по состоянию
        case 'waiting': // если состояние ожидания
            return <Skeleton />; // отображать изображения компонента скелетона
        case 'loading': // если состояние загрузки
            return <Spinner />; // отобразить спиннер
        case 'confirmed': // если персонаж загружен
            return <Component data={data} />; // отобразить компонент с загруженными данными (персонажем)
        case 'error': // если выйдет ошибка
            return <ErrorMessage />; // отобразить компонент с ошибкой
        default: // если не один кейс не выполнится
            throw new Error('Unexpected process state'); // выкинем новую ошибку с описанием
    }
}

export default setContent;