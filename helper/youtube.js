const fs = require("fs")
const yts = require("yt-search")
const functions = require("./functions")
const axios = require('axios');
const ytdl = require("ytdl-core")
const averageColor = require("./getColor")

const headers = {
  download: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-key': 'de0cfuirtgf67a'
  },
  search: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}


class youtube {

  static async search(query, type) {
    return new Promise(async (resolve) => {

      const result = await yts.search({
        [type]: query,
      })

      if (type == "query") {
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

  static async getRelatedVideos(videoId) {
    return new Promise(async (resolve) => {
      const info = await ytdl.getBasicInfo(videoId)
      resolve(info.related_videos)
    })
  }

  static async getFormats(videoId) {
    return new Promise(async (resolve) => {
      await axios.post(
          'https://yt1s.io/api/ajaxSearch',
          new URLSearchParams({
            'q': 'https://youtu.be/' + videoId,
            'vt': 'home'
          }), {
            headers: headers.search
          }
        ).then(data => {
          resolve(
            functions.parseFormats(data.data)
          )
        })
        .catch(err => {
          return console.log("erro - [youtube.js] - getFormats ", err.data)
        })
    })
  }


  static async download(videoId, type, quality, token, time, video) {
    return new Promise(async (resolve) => {
      if (type == "mp3") {
        
        await axios.post(
          'https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994',
          new URLSearchParams({
            'v_id': videoId,
            'ftype': type,
            'fquality': quality,
            'token': token,
            'timeExpire': time,
            'client': 'yt1s.io'
          }), { headers: headers.download }
        ).then(data => {
          resolve(data.data.d_url)
        }).catch(e => {
          return console.log("erro - static-download ", e.data)
        })


      } else {

        const jobRequest = async (videoId, quality, token, time) => {
            await axios.post(
              'https://dd223.oadadaystaad.xyz/api/json/convert',
              `v_id=${videoId}&ftype=mp4&fquality=${quality}&fname=${video.title}&token=${token}&timeExpire=${time}`, {
                headers: headers.download
              }
            ).then(async data => {
              const status = data.data.statusCode
              if (status == 300) {
                await setTimeout(async () => {
                  await jobRequest(videoId, quality, token, time)
                }, 500);
              } else {

                resolve(data.data.result)
              }
            }).catch(e => {
              return console.log("erro - jobrequest  ", e.data)
            })
          }
          await jobRequest(videoId, quality, token, time)
        }
      })
    }





}

module.exports = youtube