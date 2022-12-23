const Canvas = require("canvas")


const averageColor = async (image) => {
    const img = await Canvas.loadImage(image)
    const canvas = Canvas.createCanvas(img.width, img.height)
    const ctx = await canvas.getContext("2d")
    var blockSize = 5
    let defaultRGB = {
        r: 0,
        g: 0,
        b: 0
    }
    let i = -4
    let rgb = {
        r: 0,
        g: 0,
        b: 0
    }
    let count = 0

    if (!ctx) {
        return defaultRGB;
    }
    ctx.drawImage(img, 0, 0);

    try {
        data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
        return defaultRGB;
    }

    let length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb
}

const average = async () => {
    const img = await Canvas.loadImage("https://i.ytimg.com/vi/TwXfCAtctEs/hq720.jpg")
    const canvas = Canvas.createCanvas(img.width, img.height)
    const ctx = await canvas.getContext("2d")
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            let lightColors = "";
            let darkColors = ''
            let rgb = ""

            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                const gray = (r + g + b) / 3;

                rgb = [r, g, b]
                if (gray < 128 && gray != r,g,b) {
                    lightColors = [r, g, b];
                } else {
                    darkColors = [r, g, b];
                }
            }
          

            console.log(lightColors, darkColors, rgb);




}

module.exports = averageColor