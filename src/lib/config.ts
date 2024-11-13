let amps = 0;
let charged = false;
let chargeStart = 0;
export default {
    primaryScore: {
        name: "speaker",
        auto: {
            points: 5,
        },
        teleop: {
            get points(){
                return charged ? 5 : 2;
            }
        },
        score(){
            if(charged && (Date.now()-chargeStart)/1000 > 15){
                charged = false;
            }
        }
    },
    secondaryScore: {
        name: "amp",
        auto: {
            points: 2,
        },
        teleop: {
            points: 1,
        },
        score(){
            amps++;
            if(amps === 2){
                charged = true;
                chargeStart = Date.now();
            }
        },
    },
    endGoal: "climb",
    secondaryEndGoal: "park",
} as const;