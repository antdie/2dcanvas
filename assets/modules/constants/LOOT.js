const loot = [];
const imgHeal = new Image();
const imgUnknown = new Image();
const imgWeapon = new Image();
const imgArmor = new Image();

imgHeal.src = 'assets/images/loots/heart.png';
imgUnknown.src = 'assets/images/loots/unknown.png';
imgWeapon.src = 'assets/images/loots/weapon.png';
imgArmor.src = 'assets/images/loots/armor.png';

loot['heal'] = imgHeal;
loot['unknown'] = imgUnknown;
loot['weapon'] = imgWeapon;
loot['armor'] = imgArmor;

export const LOOT = loot;
