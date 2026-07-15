import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { IHitBox } from "./IHitbox";

export class Platform extends Container implements IHitBox {
    private hitBox: Graphics;
    private spr: Sprite;

    constructor() {
        super();

        this.spr = Sprite.from("/assets/suelo.png");
        this.spr.scale.set(0.5, 0.5);
        
        this.hitBox = new Graphics();

        this.hitBox.rect(0, 0, 540, 122).fill({ color: 0x00FFFF, alpha: 0 }); // cambiar el valor de alpha para ver los rectangulos de hitbox

        this.addChild(this.spr);
        this.addChild(this.hitBox);
    }

    public getHitBox(): Rectangle {
        const b = this.hitBox.getBounds();
        // Creamos un nuevo rectángulo con las propiedades del objeto b (Bounds)
        return new Rectangle(b.minX, b.minY, b.width, b.height);
    }
}