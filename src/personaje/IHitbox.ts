import { Rectangle } from "pixi.js";

export interface IHitBox {
    getHitBox(): Rectangle;
}

export function checkCollision(objA: IHitBox, objB: IHitBox): Rectangle | null {
    const rA = objA.getHitBox();
    const rB = objB.getHitBox();

    const rightmostLeft = Math.max(rA.left, rB.left);
    const leftmostRight = Math.min(rA.right, rB.right);
    const bottommostTop = Math.max(rA.top, rB.top);
    const topmostBottom = Math.min(rA.bottom, rB.bottom);

    const makeSenseHorizontal = rightmostLeft < leftmostRight;
    const makeSenseVertical = bottommostTop < topmostBottom;

    if (makeSenseHorizontal && makeSenseVertical) {
        const rec = new Rectangle();
        rec.x = rightmostLeft;
        rec.y = bottommostTop;
        rec.width = leftmostRight - rightmostLeft;
        rec.height = topmostBottom - bottommostTop;
        return rec;
    } else {
        return null;
    }
}