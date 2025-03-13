

export function getMatchNumOfIndex(json_obj: any) {
	console.log(json_obj)
    return json_obj.Schedule[0].matchNumber;
}
