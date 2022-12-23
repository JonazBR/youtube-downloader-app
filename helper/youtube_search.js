const axios = require('axios').default;
const yts = require("yt-search")
const averageColor = require("./getColor")

const suggestion = async (query) => {
    return new Promise(async (resolve) => {
        const response = await axios.get('https://suggestqueries.google.com/complete/search', {
            params: {
                'jsonp': 'jQuery340044189569622646485_1671070359493',
                'q': query,
                'hl': 'en',
                'ds': 'yt',
                'client': 'youtube',
                '_': '1671070359501'
            },
            headers: {
                'authority': 'suggestqueries.google.com',
                'accept': '*/*',
                'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'cookie': '__Secure-3PAPISID=jIL3MWMgUFQgQjU_/A30qUanENHYTIylWK; __Secure-3PSID=RAjcu-VGy4SoH0dSl3sRVoNpG3tV1SwHUajBaTE6QQNC0NZbkbLwWxoxhaqECdIG2mafJA.; NID=511=oOLcaccBMkKGfQoqfrkScaFWz0l2Ugk08VxBoSgfNStP-EZFylH1n2juDebDN6Pk9RXze4Ss3nK-odvLib_FAyArTn8JzfroSo3m2WGb0wJ-ntlQS5ryrnRJlXBgLl8zxZeZfh2NzIYFgrc2rCIrWbli_72_vS1Gum301l93LdV7x2v6TVbwRcvGPnfrotRFyPtfuhAIyJwp9Fak1-GG7hrUnhIqbcsqMBlS3LUmNVXvUqRUU0VNBkTapQtJZiLHoGDVF4q4lJ1qKL_k5877QlvLSSEemIvSS_DH5CxkQ4ttmwcx3RZKm4-ALhx_UHb8LlLuUQsvHP07BbM2T5xUyAYuzXBz-3KAZjgTocZy5Ovi7uTPWCXp6cY2DBoSUnO-fNq7_EDAPsTAG30hc78Xb_ALLP3Ymqdj9ffla2DdYVzSS1cGuTxgzAN0aIiout7Hj2GXMtu5RIGmLMnK2a1HnJ62R8OkkeAbtopIQYV_5w; 1P_JAR=2022-12-15-02; __Secure-3PSIDCC=AIKkIs3TkzcXChB0WPzTujIvWfWwgxvu1yECqFGlAKT652KTsZTwbu1qJxjPcaPadJdAI8tp4ro',
                'referer': 'https://y2mate.bz/',
                'sec-ch-ua': '"Chromium";v="108", "Not?A_Brand";v="8"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'script',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            }
        });
        const data = response.data
        const parse = JSON.parse(data.split("(")[1].split(")")[0])
        const titles = []
        parse[1].map(title => {
            titles.push(title[0])
        })
        resolve(titles)
    })
}


const search = async (query, type) => {
    return new Promise(async (resolve) => {
        const result = await yts.search(
            {
                [type]: query
            }
        )
        if(type == "query") {
            let videos = result.videos
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];
                const rgb = await averageColor(video.thumbnail)
                videos[i].average = rgb
            }
            resolve(videos)
        } else {
            let video = result
            const rgb = await averageColor(video.thumbnail)
            video.average = rgb
            resolve(video)
        }
       
    })

}

module.exports = {
    suggestion,
    search
}