function hasYaku(hand, name) {
    return hand.yaku.some(y => y.name === name);
}

export function calcFu(hand) {
    const isTsumo = hand.state.winType === "ツモ";
    const isMenzen = hand.state.state === "門前";
    const isFuro = hand.state.state === "鳴き手";

    if (hasYaku(hand, "七対子")) return 25;
    else if (hasYaku(hand, "平和")) {
        return isTsumo ? 20 : 30;
    } else if (!isFuro && !isTsumo && isMenzen) return 40;
    else return 30;
}