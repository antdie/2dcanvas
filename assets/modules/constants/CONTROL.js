// TODO ALL OBJECTS TO ARRAYS FOR MAX PERF ?

export const CONTROL = {
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    SPRINT: 'sprint'
};

export const GAMEPADTHUMBSTICK = {
    HORIZONTAL_AXE_ID: 'horizontalAxeId',
    VERTICAL_AXE_ID: 'verticalAxeId',
    DEAD_ZONE: 'deadZone'
}

export const CONTROLS = {
    KEYBOARD: {
        [CONTROL.DOWN]: 'KeyS',
        [CONTROL.LEFT]: 'KeyA',
        [CONTROL.RIGHT]: 'KeyD',
        [CONTROL.UP]: 'KeyW',
        [CONTROL.SPRINT]: 'Space'
    },
    GAMEPAD: {
        [CONTROL.DOWN]: 13,
        [CONTROL.LEFT]: 14,
        [CONTROL.RIGHT]: 15,
        [CONTROL.UP]: 12,
        [CONTROL.SPRINT]: 0,

        [GAMEPADTHUMBSTICK.HORIZONTAL_AXE_ID]: 0,
        [GAMEPADTHUMBSTICK.VERTICAL_AXE_ID]: 1,
        [GAMEPADTHUMBSTICK.DEAD_ZONE]: 0.25
    }
}

export const PLAYERSTATE = {
    IDLE: 'idle',
    MOVE_S: 'moveS',
    MOVE_W: 'moveW',
    MOVE_E: 'moveE',
    MOVE_N: 'moveN',
    MOVE_SE: 'moveSE',
    MOVE_SW: 'moveSW',
    MOVE_NW: 'moveNW',
    MOVE_NE: 'moveNE',
};

export const ANIMATION_4STEPS = {
    [PLAYERSTATE.IDLE]: ['s-1'],
    [PLAYERSTATE.MOVE_S]: ['s-1', 's-2', 's-3', 's-4'],
    [PLAYERSTATE.MOVE_W]: ['w-1', 'w-2', 'w-3', 'w-4'],
    [PLAYERSTATE.MOVE_E]: ['e-1', 'e-2', 'e-3', 'e-4'],
    [PLAYERSTATE.MOVE_N]: ['n-1', 'n-2', 'n-3', 'n-4'],
    [PLAYERSTATE.MOVE_SE]: ['se-1', 'se-2', 'se-3', 'se-4'],
    [PLAYERSTATE.MOVE_SW]: ['sw-1', 'sw-2', 'sw-3', 'sw-4'],
    [PLAYERSTATE.MOVE_NW]: ['nw-1', 'nw-2', 'nw-3', 'nw-4'],
    [PLAYERSTATE.MOVE_NE]: ['ne-1', 'ne-2', 'ne-3', 'ne-4'],
};

export const DIAGONAL_MULTIPLIER = 0.7071 // https://gamedev.stackexchange.com/a/189973
