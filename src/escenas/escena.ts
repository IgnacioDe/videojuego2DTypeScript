import { Container, TilingSprite } from "pixi.js";
import { IScene } from "../escenas/iEscena";
import { Player } from "../personaje/jugador";
import { Platform } from "../personaje/plataforma";
import { checkCollision } from "../personaje/IHitbox";
import { HEIGHT, WIDTH } from "..";
import { HUD } from "../interfaz/hud";

export class Scene extends Container implements IScene {
    private pj: Player;
    private suelo: Platform[];
    private world: Container;
    private background: TilingSprite;
    private miHud: HUD;
    private currentPersonajeId: string;
    // private timePass: number = 0;

    constructor(personajeId: string) {
        super();
        this.currentPersonajeId = personajeId;

        // 1. El mundo contendrá las plataformas y al jugador para que la cámara los mueva juntos
        this.world = new Container();

        // 2. El fondo de nubes va directo a la escena (no se mueve con la física)
        this.background = TilingSprite.from("/assets/nubes.jpg", { width: WIDTH, height: HEIGHT });
        this.addChild(this.background);
        this.addChild(this.world);

        this.suelo = [];

        // 3. Generar el suelo inicial a una altura visible (HEIGHT - 200)
        for (let i = -3; i < 7; i++) {
            const suelo = new Platform();
            suelo.position.set(i * 500, HEIGHT - 200);
            this.world.addChild(suelo); // Aseguramos que solo viva en 'world'
            this.suelo.push(suelo);
        }

        // 4. Creamos al jugador y lo soltamos justo por encima del suelo
        this.pj = new Player(this.currentPersonajeId);
        this.pj.position.set(200, HEIGHT - 500); 
        this.world.addChild(this.pj); // El jugador debe pertenecer a 'world'

        // Lo añadimos a 'this' y no a 'world', para que no se mueva con la cámara
        this.miHud = new HUD();
        this.addChild(this.miHud);
    }

    public update(deltaTime: number, _deltaFrame: number) {
        // this.timePass += deltaTime;

        // Físicas de gravedad del jugador
        this.pj.update(deltaTime);

        // Chequeo de colisiones para que no atraviese el suelo
        for (let camino of this.suelo) {
            const overlap = checkCollision(this.pj, camino);
            if (overlap != null) {
                this.pj.separate(overlap, camino.position);
            }
        }

        // 5. Cámara: Centramos el mundo basándonos en la posición del jugador
        this.world.x = -this.pj.x + WIDTH / 4;
        this.world.y = -this.pj.y + HEIGHT / 2;

        // Efecto Parallax para el fondo de nubes
        this.background.tilePosition.x = this.world.x * 0.5;

        // 6. Reciclaje infinito de plataformas
        this.suelo.sort((a, b) => a.x - b.x);

        const primerSuelo = this.suelo[0]; // La más a la izquierda
        const ultimoSuelo = this.suelo[this.suelo.length - 1]; // La más a la derecha

        // A) Si caminamos hacia la DERECHA y la primera plataforma queda fuera de cámara a la izq
        if (primerSuelo.x + 500 < this.pj.x - WIDTH / 2) {
            primerSuelo.destroy({ children: true }); 
            
            const nuevoSuelo = new Platform();
            nuevoSuelo.position.set(ultimoSuelo.x + 500, HEIGHT - 200);
            this.world.addChild(nuevoSuelo);
            this.suelo.push(nuevoSuelo);
        }
        // B) Si caminamos hacia la IZQUIERDA y la última plataforma queda fuera de cámara a la der
        else if (ultimoSuelo.x - 500 > this.pj.x + WIDTH / 2) {
            ultimoSuelo.destroy({ children: true });
            
            const nuevoSuelo = new Platform();
            // La creamos a la izquierda de la primera
            nuevoSuelo.position.set(primerSuelo.x - 500, HEIGHT - 200); 
            this.world.addChild(nuevoSuelo);
            this.suelo.push(nuevoSuelo); 
        }
        
        // Limpiar el arreglo de las plataformas destruidas
        this.suelo = this.suelo.filter((elem) => !elem.destroyed);
    }
}