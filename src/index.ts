import { Application, Assets, Container } from "pixi.js"; // <-- Importamos Assets para pre cargar las imagenes
// import { interacts } from "./teclado/interacciones";
import { Keyboard } from "./teclado/keyboard";
import { Scene } from "./escenas/escena";
import { MenuPrincipal } from "./escenas/menuPrincipal";
import { SeleccionPersonaje } from "./escenas/seleccionPersonaje";

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const app = new Application();

let escenaActual: any = null;

export async function launchGame(canvas: HTMLCanvasElement): Promise<void> {
    await app.init({
        canvas: canvas,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: 0x6495ed,
        width: WIDTH,
        height: HEIGHT,
    });

    Keyboard.initialize();

    // ---- PRECARGA DE ASSETS ----
    console.log("Cargando texturas del juego...");
    // Añade aquí todas las imágenes que tus clases van a usar.
    // Asegúrate de usar las rutas según dónde las guardes en tu servidor local (ej: /assets/...)
    await Assets.load([
        "/assets/nubes.jpg",
        "/assets/suelo.png",
        "/assets/Presidentes/Milei/milei_spritesheet.json",
        //"/assets/maili/milei.png",
        //"/assets/maili/milei2.png",
        //"/assets/maili/milei3.png",
        //"/assets/maili/milei4.png",
        //"/assets/maili/milei5.png",
        "/assets/window.png",        // <-- NUEVO: Para el fondo del diálogo
        "/assets/button_def.png",    // <-- NUEVO: Estado normal del botón
        "/assets/button_down.png",   // <-- NUEVO: Estado presionado
        "/assets/button_over.png"    // <-- NUEVO: Estado hover
    ]);
    console.log("¡Texturas cargadas con éxito!");
    // ------------------------------------

    window.addEventListener("resize", () => {
        // ... (Tu lógica de resize se mantiene exactamente igual) ...
        const scaleX = window.innerWidth / app.screen.width;
        const scaleY = window.innerHeight / app.screen.height;
        const scale = Math.min(scaleX, scaleY);
        const gameWidth = Math.round(app.screen.width * scale);
        const gameHeight = Math.round(app.screen.height * scale);
        app.canvas.style.width = gameWidth + "px";
        app.canvas.style.height = gameHeight + "px";
    });
    window.dispatchEvent(new Event("resize"));

    function cambiarEscena(nuevaEscena: Container) {
        if (escenaActual) {
            app.stage.removeChild(escenaActual);
            // Opcional: escenaActual.destroy() si quieres limpiar memoria por completo
        }
        escenaActual = nuevaEscena;
        app.stage.addChild(escenaActual);
    }

    const iniciarJuego = (personajeId: string) => {
        const myScene = new Scene(personajeId);
        cambiarEscena(myScene);
    };

    const irASeleccion = () => {
        const seleccion = new SeleccionPersonaje(iniciarJuego);
        cambiarEscena(seleccion);
    };

    // Al arrancar, mostramos el Menú Principal
    const menu = new MenuPrincipal(irASeleccion);
    cambiarEscena(menu);

    // --- El ticker ahora actualiza la escena actual si esta tiene update() ---
    app.ticker.add((ticker) => {
        if (escenaActual && escenaActual.update) {
            escenaActual.update(ticker.deltaMS / 1000, ticker.deltaTime);
        }
    });
}