const axios = require('axios')

const getInfo = async (muscle) => {
    const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;
    try {
        const response = await axios.get(url,{
            headers: {
                'X-Api-Key': 'sFqQ8nUjQGOmqCqY1NqUlQ==XycsoRYDFVs8ZIKi'
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