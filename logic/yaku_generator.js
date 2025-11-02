
import { pickOne, chance } from "./utils.js";

export const YAKU_POOL = {
    "リーチ": { name: "リーチ", han: 1 },
    "役牌": { name: "役牌", han: 1 },
    "ツモ": { name: "ツモ", han: 1 },
    "平和": { name: "平和", han: 1 },
    "タンヤオ": { name: "タンヤオ", han: 1 },
    "一発": { name: "一発", han: 1 },
    "三色同順": { name: "三色同順", han: 2 },
    "三色同順(鳴き)": { name: "三色同順", han: 1 },
    "混一色": { name: "混一色", han: 3 },
    "混一色(鳴き)": { name: "混一色", han: 3 },
    "一気通貫": { name: "一気通貫", han: 2 },
    "一気通貫(鳴き)": { name: "一気通貫", han: 1 },
    "七対子": { name: "七対子", han: 2 },
    "ドラ0": { name: "ドラなし", han: 0 },
    "ドラ1": { name: "ドラ1", han: 1 },
    "ドラ2": { name: "ドラ2", han: 2 },
    "ドラ3": { name: "ドラ3", han: 3 },
};


export function makeHand() {
    const winType = pickOne(["ロン", "ツモ"]);
    const state = pickOne(["門前", "鳴き手"]);

    const dora = pickOne([
        YAKU_POOL["ドラ0"],
        YAKU_POOL["ドラ1"],
        YAKU_POOL["ドラ2"],
        YAKU_POOL["ドラ3"]]);

    const list = [];
    if (state === "鳴き手") {
        if (chance(0.5)) {
            list.push(YAKU_POOL["タンヤオ"]);
            if (chance(1 / 5)) list.push(YAKU_POOL["三色同順(鳴き)"]);
        }
        else {
            if (chance(1 / 5)) {
                list.push(YAKU_POOL["混一色(鳴き)"]);
            }
            list.push(YAKU_POOL["役牌"]);
            if (chance(1 / 5)) list.push(YAKU_POOL["役牌"]);
            if (chance(1 / 5)) list.push(YAKU_POOL["一気通貫(鳴き)"]);
            const dora = pickOne([
                YAKU_POOL["ドラ0"],
                YAKU_POOL["ドラ1"],
                YAKU_POOL["ドラ2"],
                YAKU_POOL["ドラ3"]]);
        }
    } else {
        if (chance(4 / 5)) {
            list.push({ name: "立直", han: 1 });
            if (chance(1 / 5)) list.push({ name: "一発", han: 1 });
        }
        if (state === "門前" && winType === "ツモ") list.push(YAKU_POOL["ツモ"]);
        if (chance(4 / 10)) {
            list.push(YAKU_POOL["平和"]);
            if (chance(1 / 3)) list.push(YAKU_POOL["タンヤオ"]);
            if (chance(1 / 10)) list.push(YAKU_POOL["三色同順"]);
            if (chance(1 / 10)) list.push(YAKU_POOL["一気通貫"]);
        } else if (chance(2 / 10)) {
            list.push(YAKU_POOL["七対子"]);
            if (chance(1 / 5)) list.push(YAKU_POOL["タンヤオ"]);
        }
        if (list.length === 0) {
            list.push({ name: "立直", han: 1 });
            if (chance(1 / 5)) list.push({ name: "一発", han: 1 });
            if (chance(1 / 10)) list.push(YAKU_POOL["三色同順"]);
            if (chance(1 / 10)) list.push(YAKU_POOL["一気通貫"]);
        }
    }
    if (dora !== YAKU_POOL["ドラ0"]) {
        list.push(dora);
    }
    return { state: { winType: winType, state: state }, yaku: list };
}




