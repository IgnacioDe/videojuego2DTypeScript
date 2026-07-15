import { Container, Graphics, Text } from "pixi.js";

export class HUD extends Container {
    private healthBarFill: Graphics;
    private maxHealth: number = 100;
    private currentHealth: number = 100;

    constructor() {
        super();

        // Fondo de la barra de vida
        const healthBarBg = new Graphics();
        healthBarBg.rect(20, 20, 300, 30).fill({ color: 0x333333 });
        this.addChild(healthBarBg);

        // Relleno de la barra de vida (Rojo)
        this.healthBarFill = new Graphics();
        this.healthBarFill.rect(20, 20, 300, 30).fill({ color: 0xFF0000 });
        this.addChild(this.healthBarFill);

        // Barra de poder/estamina (Azul)
        const powerBarFill = new Graphics();
        powerBarFill.rect(20, 60, 200, 15).fill({ color: 0x0088FF });
        this.addChild(powerBarFill);

        const playerText = new Text({
            text: "JUGADOR 1",
            style: { fontFamily: "Arial", fontSize: 18, fill: 0xFFFFFF, fontWeight: "bold" }
        });
        playerText.x = 20;
        playerText.y = 85;
        this.addChild(playerText);
    }

    public updateHealth(amount: number): void {
        this.currentHealth = Math.max(0, amount);
        const percentage = this.currentHealth / this.maxHealth;
        this.healthBarFill.clear();
        this.healthBarFill.rect(20, 20, 300 * percentage, 30).fill({ color: 0xFF0000 });
    }
}