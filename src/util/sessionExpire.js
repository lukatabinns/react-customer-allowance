import axios from "axios";
import sessionExp from "./sessionExpire";

export default function sanctumToken(apiCall) {
    try{
        return axios.get( "/sanctum/csrf-cookie").then(
            (response) => {
                return apiCall();
            },
            (error) => {
                sessionExp(error);
                throw Error(error.message)
            }
        )
    }catch(error) {
        sessionExp(error);
        throw Error(error.message);
    }
}
