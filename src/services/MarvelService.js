import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp(); // вытаскиваем наши объекты из хука с помощ деструктуризации

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey ='apikey=01fb73c6eb03fc99d4525f617ab7db7f';
    const _baseOfset = 210;

    const getAllCharacters = async (offset = _baseOfset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter} // возвращаем сущности, т.е. экспортируем их когда будет вызываться наш хук
}

export default useMarvelService;