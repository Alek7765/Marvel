import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader"; // статические импорты
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/404')); // подгружаем только тогда, когда он действительно появится на стр
const MainPage = lazy(() => import('../pages/MainPage')); // ленивые динамически еимпорты
const ComicsPage = lazy(() => import('../pages/ComicsPage')); // всегда импортируем после статических импортов
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));

// 540кб
const App = () => {



    return (
        <Router>
            <div className="app">
                <AppHeader />
                <main>
                    <Suspense>
                        <Routes fallback={<Spinner />}>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/comics" element={<ComicsPage />} />
                            <Route path="/comics/:comicId" element={<SingleComicPage />} />
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                    </Suspense>

                </main>
            </div>
        </Router>
    )

}

export default App;