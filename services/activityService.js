const axios = require('axios');


const getInfo = async (activity) => {
    const url = `https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}`;
    const API_KEY = 'sFqQ8nUjQGOmqCqY1NqUlQ==XycsoRYDFVs8ZIKi'
    try{
        const response = await axios.get(url,{
            headers : {
                'X-Api-Key': API_KEY
            }
        });
        return response.data;
    }
    catch (error){
        throw new Error(error);
    }
}

module.exports = {
    getInfo
}