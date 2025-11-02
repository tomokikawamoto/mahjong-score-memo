export function calcHan(hand) {
    return hand.yaku.reduce((sum, y) => sum + y.han, 0);
}