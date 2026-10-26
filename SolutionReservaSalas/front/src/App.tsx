import fallen from "./assets/fallen.webp";
import { ComponenteModelo } from "./components/ComponenteModelo";

function App() {
    return (
        <>
            <ComponenteModelo />
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
