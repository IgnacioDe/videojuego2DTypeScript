// jugador.ts
import { AnimatedSprite, Graphics, Texture, Rectangle } from "pixi.js";
import { MovePhysics } from "./fisicasMovimiento";
import { Keyboard } from "../teclado/keyboard";
import { IHitBox } from "./IHitbox";

export class Player extends MovePhysics implements IHitBox {
    private animatedMilei: AnimatedSprite;
    private static readonly GRAVITY = 2500;
    private static readonly JUMP_SPEED = 850;

    public canJump = true;
    private hitBox: Graphics;
    private isAttack: boolean = false;

    constructor(personajeId: string) {
        super();

        let texturas: any[] = [];
        if (personajeId === "milei") {
            texturas = [
                Texture.from("/assets/maili/milei.png"),
                Texture.from("/assets/maili/milei2.png"),
                Texture.from("/assets/maili/milei3.png"),
                Texture.from("/assets/maili/milei4.png"),
                Texture.from("/assets/maili/milei5.png")
            ];
        }

        this.animatedMilei = new AnimatedSprite(texturas)
        
        this.animatedMilei.gotoAndStop(0);
        // this.animatedMilei.play();
        this.animatedMilei.animationSpeed = 0.25;
        this.animatedMilei.width = 250;
        this.animatedMilei.height = 250;

        this.animatedMilei.anchor.set(0.5, 1); // Anclamos al centro para que gire y se mueva desde el centro

        const HITBOX_WIDTH = 150;
        const HITBOX_HEIGHT = 220;

        this.hitBox = new Graphics();
        this.hitBox.rect(0, 0, HITBOX_WIDTH, HITBOX_HEIGHT).fill({ color: 0xFF00FF, alpha: 0 }); // cambiar el valor de alpha para ver los rectangulos de hitbox
        this.hitBox.x = 0;
        this.hitBox.y = 0;
        
        this.animatedMilei.x = HITBOX_WIDTH / 2; // Centrar el sprite en el hitbox
        this.animatedMilei.y = HITBOX_HEIGHT + 15; // Alinear la parte inferior del sprite con la parte inferior del hitbox

        this.addChild(this.animatedMilei);
        this.addChild(this.hitBox);

        this.acceleration.y = Player.GRAVITY;

        // Salto (Tecla W)
        Keyboard.down.on("KeyW", this.jump, this);
        Keyboard.down.on("KeyK", this.startAttack, this);
        Keyboard.up.on("KeyK", this.stopAttack, this);
    }

    // Función para iniciar el ataque
    private startAttack(): void {
        if (!this.isAttack) {
            this.isAttack = true;
            this.animatedMilei.loop = true;
            this.animatedMilei.play();
        }
    }

    // Función para detener el ataque
    private stopAttack(): void {
        if (this.isAttack) {
            this.isAttack = false;
            this.animatedMilei.loop = false;
            this.animatedMilei.gotoAndStop(0);
        }
    }

    // Sobrescribimos el update para el movimiento horizontal
    public override update(deltaSeconds: number): void {
        const WALK_SPEED = 500; // Velocidad de caminata

        // Reseteamos la velocidad X cada frame para que frene si soltamos la tecla
        this.speed.x = 0; 

        // ESCALA: Valor absoluto de la escala actual
        const currentScale = Math.abs(this.animatedMilei.scale.x);
        //const currentScaleBox = Math.abs(this.hitBox.scale.x);

        if (Keyboard.state.get("KeyA") || Keyboard.state.get("ArrowLeft")) {
            this.speed.x = -WALK_SPEED; // Mover a la izquierda
            this.animatedMilei.scale.x = -currentScale; // Mirar a la izquierda
            //this.hitBox.scale.x = -currentScaleBox; // Invertir la escala del hitbox horizontalmente
        }
        if (Keyboard.state.get("KeyD") || Keyboard.state.get("ArrowRight")) {
            this.speed.x = WALK_SPEED; // Mover a la derecha
            this.animatedMilei.scale.x = currentScale; // Mirar a la derecha
            //this.hitBox.scale.x = currentScaleBox; // Restaurar la escala del hitbox horizontalmente
        }

        // Llamamos a las físicas base (MovePhysics) para aplicar velocidad y gravedad
        super.update(deltaSeconds);
    }

    public getHitBox(): Rectangle {
        const b = this.hitBox.getBounds();
        return new Rectangle(b.minX, b.minY, b.width, b.height);
    }

    public jump(): void {
        if (this.canJump) {
            this.speed.y = -Player.JUMP_SPEED;
            this.canJump = false;
        }
    }

    public separate(overlap: Rectangle, targetPosition: any): void {
        if (overlap.width < overlap.height) {
            if (this.x < targetPosition.x) {
                this.x -= overlap.width;
            } else {
                this.x += overlap.width;
            }
            this.speed.x = 0;
        } else {
            if (this.y < targetPosition.y) {
                this.y -= overlap.height;
                this.speed.y = 0;
                this.canJump = true;
            } else {
                this.y += overlap.height;
                this.speed.y = 0;
            }
        }
    }

    public override destroy(options?: any) {
        Keyboard.down.off("KeyW", this.jump);
        Keyboard.down.off("KeyK", this.startAttack);
        Keyboard.up.off("KeyK", this.stopAttack);
        super.destroy(options);
    }
}