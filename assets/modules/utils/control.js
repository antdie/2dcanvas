import { CONTROL, GAMEPADTHUMBSTICK, CONTROLS } from '../constants/CONTROL.js';

const heldKeys = new Set();
const gamePads = new Map();
const mappedKeys = Object.values(CONTROLS.KEYBOARD);

function handleKeyDown(e) {
    if (!mappedKeys.includes(e.code)) return;

    e.preventDefault();

    heldKeys.add(e.code);
}

function handleKeyUp(e) {
    if (!mappedKeys.includes(e.code)) return;

    e.preventDefault();

    heldKeys.delete(e.code);
}

export function registerKeyboardEvents() {
    onkeydown = handleKeyDown;
    onkeyup = handleKeyUp;
}

function handleControllerConnected(e) {
    const { gamepad: { index, axes, buttons } } = e;

    gamePads.set(index, { axes, buttons });
}

function handleControllerDisconnected(e) {
    const { gamepad: { index } } = e;

    gamePads.delete(index);
}

export function registerControllerEvents() {
    window.ongamepadconnected = handleControllerConnected;
    window.ongamepaddisconnected = handleControllerDisconnected;
}

export function pollControllers() {
    for (const gamePad of navigator.getGamepads()) {
        if (!gamePad) continue;

        if (gamePads.has(gamePad.index)) {
            const { index, axes, buttons } = gamePad;

            gamePads.set(index, { axes, buttons });
        }
    }
}

export const isKeyDown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);
export const isButtonDown = (button) => gamePads.get(gamePads.size - 1)?.buttons[button].pressed; // ?. Optional Chaining
export const isButtonUp = (button) => !gamePads.get(gamePads.size - 1)?.buttons[button].pressed;
export const isAxeGreater = (axeId, value) => gamePads.get(gamePads.size - 1)?.axes[axeId] >= value;
export const isAxeLower = (axeId, value) => gamePads.get(gamePads.size - 1)?.axes[axeId] <= value;

export const isUp = () => isKeyDown(CONTROLS.KEYBOARD[CONTROL.UP])
    || isButtonDown(CONTROLS.GAMEPAD[CONTROL.UP])
    || isAxeLower(
        CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.VERTICAL_AXE_ID],
        -CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.DEAD_ZONE]
    );
export const isLeft = () => isKeyDown(CONTROLS.KEYBOARD[CONTROL.LEFT])
    || isButtonDown(CONTROLS.GAMEPAD[CONTROL.LEFT])
    || isAxeLower(
        CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.HORIZONTAL_AXE_ID],
        -CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.DEAD_ZONE]
    );
export const isRight = () => isKeyDown(CONTROLS.KEYBOARD[CONTROL.RIGHT])
    || isButtonDown(CONTROLS.GAMEPAD[CONTROL.RIGHT])
    || isAxeGreater(
        CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.HORIZONTAL_AXE_ID],
        CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.DEAD_ZONE]
    );
export const isDown = () => isKeyDown(CONTROLS.KEYBOARD[CONTROL.DOWN])
    || isButtonDown(CONTROLS.GAMEPAD[CONTROL.DOWN])
    || isAxeGreater(
        CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.VERTICAL_AXE_ID],
        CONTROLS.GAMEPAD[GAMEPADTHUMBSTICK.DEAD_ZONE]
    );
export const isDownRight = () => isDown() && isRight();
export const isDownLeft = () => isDown() && isLeft();
export const isUpRight = () => isUp() && isRight();
export const isUpLeft = () => isUp() && isLeft();
export const isSprint = () => isKeyDown(CONTROLS.KEYBOARD[CONTROL.SPRINT])
    || isButtonDown(CONTROLS.GAMEPAD[CONTROL.SPRINT])
;
