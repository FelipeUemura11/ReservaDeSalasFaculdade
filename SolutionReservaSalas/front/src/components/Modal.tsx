import { ReactNode } from "react";

interface ModalProps {
    titulo: string;
    onFechar: () => void;
    children: ReactNode;
}

// Janela sobreposta à página; fecha ao clicar fora dela
export function Modal({ titulo, onFechar, children }: ModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={titulo}
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl font-bold text-primary">{titulo}</h2>
                {children}
            </div>
        </div>
    );
}
