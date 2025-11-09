const downloadImage = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const data = ctx.getImageData(0, 0, width, height).data;
    
    let top = -1, bottom = -1, left = width, right = -1;
    for (let y = 0; y < height && top === -1; y++) {
        for (let x = 0; x < width; x++) {
            if (data[(y * width + x) * 4 + 3] !== 0) {
                top = y;
                break;
            }
        }
    }
    if (top === -1) return;

    for (let y = height - 1; y >= top && bottom === -1; y--) {
        for (let x = 0; x < width; x++) {
            if (data[(y * width + x) * 4 + 3] !== 0) {
                bottom = y;
                break;
            }
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = top; y <= bottom; y++) {
            if (data[(y * width + x) * 4 + 3] !== 0) {
                left = x;
                break;
            }
        }
        if (left < width) break;
    }

    for (let x = width - 1; x >= left; x--) {
        for (let y = top; y <= bottom; y++) {
            if (data[(y * width + x) * 4 + 3] !== 0) {
                right = x;
                break;
            }
        }
        if (right >= left) break;
    }

    const cw = right - left + 1;
    const ch = bottom - top + 1;
    const cropped = document.createElement("canvas");
    cropped.width = cw;
    cropped.height = ch;
    cropped.getContext("2d")!.drawImage(ctx.canvas, -left, -top);

    const a = document.createElement("a");
    a.href = cropped.toDataURL("image/png");
    a.download = "TuringPatternResult.png";
    a.click();
}

export default downloadImage;