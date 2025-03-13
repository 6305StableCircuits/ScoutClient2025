import { PUBLIC_AUTH_TOKEN, PUBLIC_FRC_API_TOKEN } from '$env/static/public';
import { calcAuthHeader } from '$lib/utils';
import {  type RequestHandler } from '@sveltejs/kit';
import { getMatchNumOfIndex } from '$lib/frc_api';




let auth = calcAuthHeader('lotuscss', PUBLIC_FRC_API_TOKEN)

let requestHeaders = new Headers();
requestHeaders.append('Authorization', "Basic " + auth);
console.log(requestHeaders.get("Authorization"))
requestHeaders.append('Accept', 'application/json');


const getData = async (event_code: string) => {
    const request_options = {
        headers: requestHeaders,
        method: 'GET',
        redirect: 'follow' as RequestRedirect
    };
    const URL = `https://frc-api.firstinspires.org/v3.0/2024/schedule/${event_code}?tournamentLevel=qual&teamNumber=&start=&end=`;
    const response = await fetch(URL, request_options);
    
    const json = await response.json();
    console.log(json)
    return { response, json};
};




export const GET: RequestHandler = async ({ params}) => {
    if (params.eventCode == undefined){
        return new Response("Event code undefined", {status: 400})
    }
    let data;
    try{
        data = await getData(params.eventCode)
    }
    catch (e: any){
        console.error(e.message)
        return new Response(e.message, {status: 500})
    }

    console.log(data.json)
    return new Response(JSON.stringify(data.json), {status: 200})
};


