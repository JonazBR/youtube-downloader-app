var videoInfo;
var token;
const infoSvg = `<svg class="info-svg" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path fill-rule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.7-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.3 28.66 185.31 0 256 0zm17.75 342.25h29.15v29.32h-93.79v-29.32h28.76v-92.34h-28.76v-29.32h64.64v121.66zm-27.94-150.37c-7.08-.05-13.12-2.53-18.2-7.56-5.08-5.01-7.56-11.11-7.56-18.25 0-7.01 2.48-13.06 7.56-18.08 5.08-5.02 11.12-7.55 18.2-7.55 6.95 0 12.99 2.53 18.08 7.55 5.13 5.02 7.67 11.07 7.67 18.08 0 4.72-1.2 9.07-3.56 12.94-2.36 3.93-5.45 7.07-9.31 9.37-3.87 2.3-8.17 3.45-12.88 3.5zm171.9-97.59C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.33 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.38 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/></svg>`

const getVideo = async () => {
    const result = await fetch("/getVideoById?id=" + videoId)
    const data   = await result.json()
    console.log(data);
    const { formats } = data.download
    const {average, title, author, timestamp, thumbnail} = data.video
    let mp4   = ""
    let mp3   = ""
    token     = data.download.token
    videoInfo = data.video

  

    Object.keys(formats.mp4).map(quality => {
        const format = formats.mp4[quality]
        mp4 += `<option id="mp4" value="${format.k}"> ${format.q} (${format.size != undefined ? format.size : '' } ) </option> `
    })
    Object.keys(formats.mp3).map(quality => {       
        const format = formats.mp3[quality]
        mp3 += `<option id="mp3" value="${format.k}"> ${format.q} (${format.size != undefined ? format.size : '' }) </option> `
    })
   
    document.querySelector(".loading").style.display = "none"

    const color = {
        r: average.r,
        g: average.g,
        b: average.b,
    }

    const gradient = `linear-gradient(rgb(${color.r},${color.g}, ${color.b}), rgb(0,0,0,0.3))`

    document.querySelector("#convert").innerHTML = `<div id="search-result">
    <div class="detail">
        <div style="background-image: ${gradient};" class="thumbnail">
            <img class="thumb" src="${thumbnail}">
            <div class="content">
                <div class="clearfix">
                    <h3>${title}</h3>
                    <p>${author.name}</p>
                    <p class="mag0">${timestamp}</p>
                    <div class="magT10">
                        <div class="flex"><select class="form-control form-control-small" id="formatSelect">
                                <optgroup id="mp4-group" label="mp4"> ${mp4} </optgroup>
                                <optgroup id="mp3-group" label="mp3"> ${mp3} </optgroup> 

                                </select>
                                <button onclick="download()" id="btn-action" class="btn-blue-small form-control btn-ads"type="button">Download</button>
                        </div>
                        <di class="mp3-options">
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</div>
`

    $("select").change((opt) => {
        const selected = $("select").val()
        const divOptions = document.querySelector(".mp3-options")
        const inputTags = document.querySelector(".check-tags")

        if(selected == "128") {
            divOptions.innerHTML = `<div  class="check-tags" > <input type="checkbox" checked> Baixar música com tags </input>  <a href="/sexo"> ${infoSvg} </a> </div> `
            console.log(
  
                $('.check-tags :checkbox:checked').length > 0
              )
            } else {
            if(inputTags != null) {
                divOptions.removeChild(inputTags)
            }
        }

    })
    
 
}
getVideo()


const download = async () => {
    const selected = $("select").val()

    const info = {
        video:   videoInfo,
        token:   token.token,
        time:    token.time,
        quality: selected,
        videoId: videoId,
        type:    selected.includes("p") ? "mp4" : "mp3"
        
    }

    const download = fetch("/download", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({info})
    })
    const data = await (await download).json()
    console.log(data.source);

    if(data.type == "buffer") {
        const base64 = Buffer.from(data.source).toString("base64")
      
    } else {

    }



}