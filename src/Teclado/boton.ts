import { Container, Sprite, Texture } from "pixi.js"

export class Button extends Container 
{

    private def: Texture;
    private down: Texture;
    private over: Texture;
    private spr:Sprite;

    constructor (def:Texture, down:Texture, over:Texture) 
    {
        super();
        this.def = def;
        this.down = down;
        this.over = over;

        this.spr = new Sprite(def);
        this.spr.anchor.set(0.5)
        this.addChild(this.spr);

        this.spr.interactive = true;
        this.spr.on("pointerdown", this.onPointerDown, this);
        this.spr.on("pointerup", this.onPointerUp, this);
        this.spr.on("pointerover", this.onPointerOver, this);
        this.spr.on("pointerout", this.onPointerOut, this);
    }

    private onPointerDown(): void {
        console.log("mouse down");
        this.spr.texture = this.down;
    }

    private onPointerUp(): void {
        this.emit("buttonClicked");
        this.spr.texture = this.over;
    }

    private onPointerOver(): void {
        console.log("mouse Enter");
        this.spr.texture = this.over;
    }

    private onPointerOut(): void {
        console.log("mouse Exit");
        this.spr.texture = this.def;
    }
}