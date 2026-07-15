import { Container, Sprite, Text, Texture } from "pixi.js";
import { Button } from "./boton";
import { Keyboard } from "./keyboard";

export class interacts extends Container {

    private buttonPointer : Button;
    private lastKeyPressed : Text;

    constructor() {
        super();
        const dialog = new Container();
        dialog.x = 100;
        dialog.y = 50;

        const background = Sprite.from("/assets/window.png");
        dialog.addChild(background);

        this.buttonPointer = new Button(
            Texture.from("/assets/button_def.png"), 
            Texture.from("/assets/button_down.png"), 
            Texture.from("/assets/button_over.png"), 
            );
        this.buttonPointer.on("buttonClicked", this.onButtonClick, this);
        this.buttonPointer.x = background.width / 2 - this.buttonPointer.width * 0.6;
        this.buttonPointer.y = background.height + 20;
        dialog.addChild(this.buttonPointer);

        // Ajuste para Pixi v8: objeto de configuración
        this.lastKeyPressed = new Text({
            text: "Wait...", 
            style: { fontSize: 48 }
        });
        this.lastKeyPressed.anchor.set(0.5);
        this.lastKeyPressed.x = background.width / 2;
        this.lastKeyPressed.y = this.buttonPointer.y + 175;

        this.addChild(dialog);

        Keyboard.down.on("KeyS", this.onKeyPress, this);
        Keyboard.up.on("KeyW", this.onKeyDespress, this);
    }

    // ... (El resto de la lógica se mantiene igual)
    private onButtonClick(): void{
        console.log("my new button clicked!", Keyboard.state.get("KeyA"));
    }

    private onKeyPress(): void{
        console.log("Down activated");
    }

    private onKeyDespress(): void{
        console.log("Down desactivated");
    }
}