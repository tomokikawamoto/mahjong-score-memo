
const POINT_TABLE_20FU_KO = {
    "ツモ": {
        1: null,
        2: "400-700",
        3: "700-1300",
        4: "1300-2600",
    },
    "ロン": null
}

const POINT_TABLE_25FU_KO = {
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

const POINT_TABLE_30FU_KO = {
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

const POINT_TABLE_40FU_KO = {
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

const POINT_TABLE_20FU_OYA = {
    "ツモ": {
        1: null,
        2: "700all",
        3: "1300all",
        4: "2600all",
    },
    "ロン": null
}

const POINT_TABLE_25FU_OYA = {
    "ツモ": {
        1: null,
        2: null,
        3: "1600all",
        4: "3200all",
    },
    "ロン": {
        1: null,
        2: "2400",
        3: "4800",
        4: "9600",
    }
}

const POINT_TABLE_30FU_OYA = {
    "ツモ": {
        1: "500all",
        2: "1000all",
        3: "2000all",
        4: "4000all",
    },
    "ロン": {
        1: "1500",
        2: "2900",
        3: "5800",
        4: "12000",
    },
}

const POINT_TABLE_40FU_OYA = {
    "ツモ": {
        1: "700all",
        2: "1300all",
        3: "2600all",
        4: "4000all",
    },
    "ロン": {
        1: "2000",
        2: "3900",
        3: "7700",
        4: "12000",
    },
}


// 参照テーブルを親/子で切替
const TABLES = {
    "子": {
        20: POINT_TABLE_20FU_KO,
        25: POINT_TABLE_25FU_KO,
        30: POINT_TABLE_30FU_KO,
        40: POINT_TABLE_40FU_KO,
    },
    "親": {
        20: POINT_TABLE_20FU_OYA,
        25: POINT_TABLE_25FU_OYA,
        30: POINT_TABLE_30FU_OYA,
        40: POINT_TABLE_40FU_OYA,
    },
};

export function calculatePoint(han, fu, winType, seat) {
    let pointTable;
    let point;

    if (han === 5) {
        if (winType === "ツモ") {
            if (seat === "親") {
                point = "4000all";
            } else {
                point = "2000-4000";
            }
        } else {
            if (seat === "親") {
                point = "12000";
            } else {
                point = "8000";
            }
        }
    }
    else if (han === 6 || han === 7) {
        if (winType === "ツモ") {
            if (seat === "親") {
                point = "6000all";
            } else {
                point = "3000-6000";
            }
        } else {
            if (seat === "親") {
                point = "18000";
            } else {
                point = "12000";
            }
        }
    }
    else if (han >= 8 && han <= 10
    ) {
        if (winType === "ツモ") {
            if (seat === "親") {
                point = "8000all";
            } else {
                point = "4000-8000";
            }
        } else {
            if (seat === "親") {
                point = "24000";
            } else {
                point = "16000";
            }
        }
    }

    else if (han >= 11
    ) {
        if (winType === "ツモ") {
            if (seat === "親") {
                point = "12000all";
            } else {
                point = "6000-12000";
            }
        } else {
            if (seat === "親") {
                point = "32000";
            } else {
                point = "24000";
            }
        }
    }

    else {
        if (fu === 20) pointTable = TABLES[seat === "親" ? "親" : "子"][20];
        else if (fu === 25) pointTable = TABLES[seat === "親" ? "親" : "子"][25];
        else if (fu === 30) pointTable = TABLES[seat === "親" ? "親" : "子"][30];
        else pointTable = TABLES[seat === "親" ? "親" : "子"][40];
        point = pointTable[winType][han];
    }
    return {
        point: point,
        fu: fu,
        han: han
    };
}   