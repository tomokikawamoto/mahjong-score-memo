function hasYaku(hand, name) {
    return hand.yaku.some(y => y.name === name);
}

function calcFu(hand) {
    const isTsumo = hand.state.winType === "ツモ";
    const isMenzen = hand.state.state === "門前"; // 「門前 or 風露手」
    const isFuro = hand.state.state === "風露手";

    if (hasYaku(hand, "七対子")) return 25;
    else if (hasYaku(hand, "平和")) {
        return isTsumo ? 20 : 30;
    } else if (isFuro) return 30;
    else return 40;
}

export const POINT_TABLE_20FU = {
    "ツモ": {
        1: null,
        2: "400-700",
        3: "700-1300",
        4: "1300-2600",
    },
    "ロン": null
}

export const POINT_TABLE_25FU = {
    "ツモ": {
        1: null,
        2: null,
        3: "800-1600",
        4: "1600-3200",
    },
    "ロン": {
        1: null,
        2: "1600",
        3: "3200",
        4: "6400",
    }
}

export const POINT_TABLE_30FU = {
    "ツモ": {
        1: "300-500",
        2: "500-1000",
        3: "1000-2000",
        4: "2000-4000",
    },
    "ロン": {
        1: "1000",
        2: "2000",
        3: "3900",
        4: "8000",
    },
}

export const POINT_TABLE_40FU = {
    "ツモ": {
        1: "400-700",
        2: "700-1300",
        3: "1300-2600",
        4: "2000-4000",
    },
    "ロン": {
        1: "1300",
        2: "2600",
        3: "5200",
        4: "8000",
    },
}

export function calculatePoint(hand) {
    const fu = calcFu(hand);
    const han = hand.yaku.reduce((sum, y) => sum + y.han, 0);
    const winType = hand.state.winType;

    let pointTable;
    if (han === 5) {
        if (winType === "ツモ") {
            return "2000-4000";
        } else {
            return "8000";
        }
    }
    else if (han === 6 || han === 7) {
        if (winType === "ツモ") {
            return "3000-6000";
        } else {
            return "12000";
        }
    }
    else if (han >= 8 && han <= 10
    ) {
        if (winType === "ツモ") {
            return "4000-8000";
        } else {
            return "16000";
        }
    }
    else {
        if (fu === 20) pointTable = POINT_TABLE_20FU;
        else if (fu === 25) pointTable = POINT_TABLE_25FU;
        else if (fu === 30) pointTable = POINT_TABLE_30FU;
        else if (fu === 40) pointTable = POINT_TABLE_40FU;
        else return null;

        if (pointTable[winType] && pointTable[winType][han]) {
            return pointTable[winType][han];
        } else {
            return null;
        }
    }
}   