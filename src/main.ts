import { launchGame } from "./index"; // Importamos la lógica centralizada

function bootstrap() {
    const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;
    
    if (!canvas) {
        console.error("No se pudo iniciar el juego: Falta el elemento #pixi-canvas en el HTML");
        return;
    }

    // Le pasamos el canvas a nuestro puente y arrancamos el juego
    launchGame(canvas)
        .then(() => console.log("Juego corriendo con éxito."))
        .catch((error) => console.error("Error crítico durante el arranque del juego:", error));
}

// Aseguramos la carga del DOM
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => bootstrap());
} else {
    bootstrap();
}