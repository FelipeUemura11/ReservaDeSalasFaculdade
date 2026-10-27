import { Route, Routes } from "react-router";
import { Layout } from "./layout/Layout";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/"/>
                <Route path="/"/>
                <Route path="/"/>
                <Route path="/"/>
            </Route>
        </Routes>
    );
}

export default App;
