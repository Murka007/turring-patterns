const blurImage = (imageData: ImageData, radius: number): ImageData => {
    const w = imageData.width;
    const h = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    const kernel: number[] = [];
    let kernelSum = 0;
    const sigma = radius / 3;
    const size = radius * 2 + 1;

    for (let i = 0; i < size; i++) {
        const x = i - radius;
        const value = Math.exp(-(x * x) / (2 * sigma * sigma));
        kernel.push(value);
        kernelSum += value;
    }

    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= kernelSum;
    }

    const temp = new Uint8ClampedArray(data.length);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let r = 0,
                g = 0,
                b = 0;
            for (let k = 0; k < size; k++) {
                const sx = Math.max(0, Math.min(w - 1, x + k - radius));
                const idx = (y * w + sx) * 4;
                r += data[idx] * kernel[k];
                g += data[idx + 1] * kernel[k];
                b += data[idx + 2] * kernel[k];
            }
            const idx = (y * w + x) * 4;
            temp[idx] = r;
            temp[idx + 1] = g;
            temp[idx + 2] = b;
            temp[idx + 3] = data[idx + 3];
        }
    }

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let r = 0,
                g = 0,
                b = 0;
            for (let k = 0; k < size; k++) {
                const sy = Math.max(0, Math.min(h - 1, y + k - radius));
                const idx = (sy * w + x) * 4;
                r += temp[idx] * kernel[k];
                g += temp[idx + 1] * kernel[k];
                b += temp[idx + 2] * kernel[k];
            }
            const idx = (y * w + x) * 4;
            output[idx] = r;
            output[idx + 1] = g;
            output[idx + 2] = b;
            output[idx + 3] = temp[idx + 3];
        }
    }

    return new ImageData(output, w, h);
}

export default blurImage;