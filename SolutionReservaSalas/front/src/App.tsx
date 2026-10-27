import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { Blocos } from "./pages/Blocos";
import { Salas } from "./pages/Salas";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                <Route path="blocos" element={<Blocos />} />
                <Route path="salas" element={<Salas />} />

                <Route path="*" element={<Navigate to="/" replace/>} />
            </Route>
        </Routes>
    );
}

export default App;
