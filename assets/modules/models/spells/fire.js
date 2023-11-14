const img = new Image();
img.src = 'assets/images/spells/fire.png';

export const Fire = {
    image: img,
    animation: [ // x, y, w, h
        [17, 128, 105, 95],
        [143, 132, 90, 94],
        [270, 130, 105, 85],
        [395, 134, 105, 84],
        [27, 256, 84, 91],
        [154, 256, 78, 86],
    ],
    hitbox: {
        width: 90,
        height: 90
    }
}
