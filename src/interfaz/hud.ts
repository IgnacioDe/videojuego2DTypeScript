import { Container, Graphics, Text, Sprite, Assets } from "pixi.js";
import { WIDTH } from "../index"; // Importamos el ancho de la pantalla para posicionarlo

export class HUD extends Container {
    private healthBarFill: Graphics;
    private retrato: Sprite;
    private maxHealth: number = 100;
    private currentHealth: number = 100;

    // Guardaremos las 4 texturas del retrato aquí
    private texturasRetrato: Record<string, any>;

    constructor() {
        super();

        // 1. Cargar las texturas de las caras desde el spritesheet
        const sheet = Assets.get("/assets/Presidentes/Milei/milei_spritesheet.json");
        
        // NOTA: Los nombres entre corchetes deben coincidir EXACTAMENTE con 
        // los nombres de los archivos originales que usaste para armar el spritesheet
        this.texturasRetrato = {
            100: sheet.textures["retrato_100.png"], // Cara normal
            75:  sheet.textures["retrato_75.png"],  // Cara un poco golpeada
            50:  sheet.textures["retrato_50.png"],  // Cara muy golpeada
            25:  sheet.textures["retrato_25.png"]   // Cara destruida
        };

        // 2. Crear el sprite del retrato con la cara al 100%
        this.retrato = new Sprite(this.texturasRetrato[100]);
        // Ajusta la escala si el retrato es muy grande/chico
        // this.retrato.scale.set(0.8); 
        this.addChild(this.retrato);

        // Definimos un margen para que las barras empiecen a la derecha del retrato
        const offsetBarrasX = 110; 

        // 3. Fondo de la barra de vida
        const healthBarBg = new Graphics();
        healthBarBg.rect(offsetBarrasX, 10, 300, 30).fill({ color: 0x333333 });
        this.addChild(healthBarBg);

        // 4. Relleno de la barra de vida (Rojo)
        this.healthBarFill = new Graphics();
        this.healthBarFill.rect(offsetBarrasX, 10, 300, 30).fill({ color: 0xFF0000 });
        this.addChild(this.healthBarFill);

        // 5. Barra de poder/estamina (Azul)
        const powerBarFill = new Graphics();
        powerBarFill.rect(offsetBarrasX, 50, 200, 15).fill({ color: 0x0088FF });
        this.addChild(powerBarFill);

        // 6. Texto del jugador
        const playerText = new Text({
            text: "JUGADOR 1",
            style: { fontFamily: "Arial", fontSize: 18, fill: 0xFFFFFF, fontWeight: "bold" }
        });
        playerText.x = offsetBarrasX;
        playerText.y = 75;
        this.addChild(playerText);

        // 7. Posicionar TODO el HUD arriba a la derecha.
        // Restamos el ancho aproximado del HUD entero (ej. 450px) y le damos un margen de 20px
        this.x = WIDTH - 450; 
        this.y = 20;
    }

    public updateHealth(amount: number): void {
        this.currentHealth = Math.max(0, amount);
        const percentage = this.currentHealth / this.maxHealth;
        
        // Actualizamos el largo de la barra roja
        this.healthBarFill.clear();
        
        // Mantenemos la misma posición X (offsetBarrasX) y Y (10) al redibujar
        this.healthBarFill.rect(110, 10, 300 * percentage, 30).fill({ color: 0xFF0000 });

        // Evaluamos el porcentaje para cambiar la cara del HUD
        if (percentage > 0.75) {
            this.retrato.texture = this.texturasRetrato[100];
        } else if (percentage > 0.50) {
            this.retrato.texture = this.texturasRetrato[75];
        } else if (percentage > 0.25) {
            this.retrato.texture = this.texturasRetrato[50];
        } else {
            this.retrato.texture = this.texturasRetrato[25]; // Al 25% o muerto
        }
    }
}