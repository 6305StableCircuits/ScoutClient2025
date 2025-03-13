export function calcAuthHeader(username: string, token: string | undefined){
    let header : string = `${username}:${token}` 
    console.log(header)
    header = btoa(header)
    console.log("Coinerted: " + header)
    return header
}