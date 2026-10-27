import { useEffect } from "react";
import "./ListarBlocos.css";

export function ListarBlocos() {
    useEffect(() => {
        fetch("https://viacep.com.br/ws/01001000/json/").then((resposta) => {
            console.log(resposta);
        });
    }, []);

    return (
        <div>
            <h1>teste</h1>
        </div>
    );
}
