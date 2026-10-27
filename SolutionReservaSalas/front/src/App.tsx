import fallen from "./assets/fallen.webp";
import { ListarBlocos } from "./components/ListarBlocos";

function App() {
    return (
        <>
            <ListarBlocos />
            <div className="App">
                <div>
                    <img src={fallen} className="App-logo" alt="logo" />
                    <p>CRIANDO REACT</p>
                </div>
            </div>
        </>
    );
}

export default App;
