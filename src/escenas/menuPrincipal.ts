import { Container, Text } from "pixi.js";
import { Keyboard } from "../teclado/keyboard";
import { WIDTH, HEIGHT } from "../index";

export class MenuPrincipal extends Container {
    constructor(private onComenzar: () => void) {
        super();

        const titulo = new Text({
            text: "MI JUEGO ÉPICO",
            style: { fontFamily: "Arial", fontSize: 80, fill: 0xFFFFFF, dropShadow: true }
        });
        titulo.anchor.set(0.5);
        titulo.x = WIDTH / 2;
        titulo.y = HEIGHT / 3;

        const textoPress = new Text({
            text: "Presiona ENTER para jugar",
            style: { fontFamily: "Arial", fontSize: 40, fill: 0xAAAAAA }
        });
        textoPress.anchor.set(0.5);
        textoPress.x = WIDTH / 2;
        textoPress.y = HEIGHT / 1.5;

        this.addChild(titulo, textoPress);
        Keyboard.down.on("Enter", this.avanzar, this);
    }

    private avanzar(): void {
        Keyboard.down.off("Enter", this.avanzar, this);
        this.onComenzar();
    }
}