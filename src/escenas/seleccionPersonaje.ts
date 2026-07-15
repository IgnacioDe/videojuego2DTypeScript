import { Container, Text, Sprite, Texture } from "pixi.js";
import { Keyboard } from "../teclado/keyboard";
import { WIDTH, HEIGHT } from "../index";

export class SeleccionPersonaje extends Container {
    constructor(private onSeleccionado: (id: string) => void) {
        super();

        const titulo = new Text({
            text: "SELECCIONA TU PERSONAJE",
            style: { fontFamily: "Arial", fontSize: 60, fill: 0xFFD700 }
        });
        titulo.anchor.set(0.5);
        titulo.x = WIDTH / 2;
        titulo.y = 150;

        const preview = new Sprite(Texture.from("/assets/maili/milei.png"));
        preview.anchor.set(0.5);
        preview.x = WIDTH / 2;
        preview.y = HEIGHT / 2;
        
        const textoPress = new Text({
            text: "Presiona ENTER para confirmar",
            style: { fontFamily: "Arial", fontSize: 30, fill: 0xFFFFFF }
        });
        textoPress.anchor.set(0.5);
        textoPress.x = WIDTH / 2;
        textoPress.y = HEIGHT - 200;

        this.addChild(titulo, preview, textoPress);
        Keyboard.down.on("Enter", this.confirmar, this);
    }

    private confirmar(): void {
        Keyboard.down.off("Enter", this.confirmar, this);
        this.onSeleccionado("milei");
    }
}