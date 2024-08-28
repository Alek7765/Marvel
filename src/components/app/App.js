import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader"; // статические импорты
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/404')); // подгружаем только тогда, когда он действительно появится на стр
const MainPage = lazy(() => import('../pages/MainPage')); // ленивые динамически импорты
const ComicsPage = lazy(() => import('../pages/ComicsPage')); // всегда импортируем после статических импортов
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharacterLayout = lazy(() => import('../pages/singleCharacterLayout/SingleCharacterLayout'));
const SinglePage = lazy(() => import('../pages/SinglePage'));


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
                            <Route path="/comics/:id" element={<SinglePage />} Component={SingleComicLayout} dataType='comic'/>
                            <Route path="/character/:id" element={<SinglePage />} Component={SingleCharacterLayout} dataType='character'/>
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                    </Suspense>

                </main>
            </div>
        </Router>
    )

}

export default App;