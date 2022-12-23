const axios = require("axios")
const NodeID3 = require('node-id3');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const { Readable } = require('stream');


class functions {
  /**
   * @param binary Buffer
   * returns readableInstanceStream Readable
   */
  static bufferToStream(binary) {

    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });
    return readableInstanceStream;
  }

    static parseFormats = (array) => {
        const formats = array.links
        const keys = Object.keys(formats)
        const parsedFormats = []

        keys.map(key => {
            parsedFormats[key] = []

            Object.keys(formats[key]).map(porra => {
                const format = formats[key][porra]

                parsedFormats[key].push({
                    type: format.f,
                    quality: format.q,
                    key: format.key,
                    size: format.size

                })

            })
        })
        array.likns = parsedFormats
        return array
    }
      
      static addTags = async (Buffer, title, thumbnail) => {
        return NodeID3.update({
            title: title,
            artist: "insta: @jonaz_dev",
            album: title,
            APIC: await this.getBuffer(thumbnail),
            TRCK: "27",
            artistUrl: 'https://www.instagram.com/jonaz_dev/',
          },
          Buffer
          )
      }
    
      static formatSizeUnits(bytes){
        if      (bytes >= 1073741824) { bytes = {size: (bytes / 1073741824).toFixed(2), unity: "GB" } }
        else if (bytes >= 1048576)    { bytes = {size: (bytes / 1048576).toFixed(2), unity: "MB" } }
        else if (bytes >= 1024)       { bytes = {size: (bytes / 1024).toFixed(2), unity: "KB" } }
        else if (bytes > 1)           { bytes = {size: 2, unity: "BYTES"} }
        else if (bytes == 1)          { bytes = {size: 1, unity: "BYTE" } }
        else                          { bytes = {size: 0, unity: ""} }
        return bytes;
      }
    
      static async getBuffer(url) {
        return axios
          .get(url, {
            httpsAgent,
            responseType: 'arraybuffer'
          })
          .then((response) => {
            return response.data
          })
          .catch('error', error => console.log(error))
      }
    }
    
    
    
    module.exports = functions