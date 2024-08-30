import { useState, useCallback } from "react";

export const useHttp = () => { // собственный хук
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-Type': 'aplication/json' }) => { // создали запрос

        //setLoading(true); // пока идет запрос, будет идти загрука в виде спиннера
        setProcess('loading');

        try {
            const response = await fetch(url, { method, body, headers });//ответ от запроса будет помещаться response

            if (!response.ok) { // если св-во будет не ок, тогда будем перемещаться в блок с ошибкой в catch
                throw new Error(`Could not fetch ${url}, status: ${response.status}`); // выкидыаем ошибку
            }

            const data = await response.json();// ответ записываем в data преобразуя сразу в формат json

            //setLoading(false);// когда ответ загрузится, тогда спиннер убираем
            return data; // после загрузки наш request вернет данные полученные от сервера
        } catch (e) {
            //setLoading(false); // загрузка прекратится, т.к. вышла ошибка
            //setError(e.message);// получим текст ошибки
            setProcess('error');
            throw e; // выкидываем ошибку
        }

    }, []);

    const clearError = useCallback(() => {
        //setError(null);
        setProcess('loading');
        // eslint-disable-next-line
    }, []);

    return { request, clearError, process, setProcess } // возвращаем объекты 
}