import { Container, Text } from "pixi.js";

export class TextScene extends Container {
    private t: Text;

    constructor() {
        super();

        // En v8, Text recibe un objeto de configuración
        this.t = new Text({
            text: "Texto Ejemplo",
            style: {
                fontSize: 48,
                fill: 0xffffff
            }
        });

        this.addChild(this.t);
    }
}