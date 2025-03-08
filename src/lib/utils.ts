export function calcAuthHeader(username: string, token: string){
    let header : string = `${username}:${token}` 
    header = Buffer.from(header, 'base64').toString()
    return header
}