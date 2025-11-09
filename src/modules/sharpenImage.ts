import labToRgb from "./labToRgb";
import rgbToLab from "./rgbToLab";

const sharpenImage = (imageData: ImageData, strength: number): ImageData => {
    const w = imageData.width;
    const h = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    const labData = new Float32Array(w * h * 3);
    for (let i = 0; i < w * h; i++) {
        const r = data[i * 4 + 0];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const lab = rgbToLab(r, g, b);
        labData[i * 3 + 0] = lab.l;
        labData[i * 3 + 1] = lab.a;
        labData[i * 3 + 2] = lab.b;
    }

    const center = 1 + 4 * strength;
    const edge = -strength;
    const labOutput = new Float32Array(labData);

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 3;
            const value =
                labData[idx] * center +
                labData[((y - 1) * w + x) * 3] * edge +
                labData[((y + 1) * w + x) * 3] * edge +
                labData[(y * w + (x - 1)) * 3] * edge +
                labData[(y * w + (x + 1)) * 3] * edge;
            labOutput[idx] = Math.max(0, Math.min(100, value));
        }
    }

    for (let i = 0; i < w * h; i++) {
        const l = labOutput[i * 3 + 0];
        const a = labOutput[i * 3 + 1];
        const b = labOutput[i * 3 + 2];
        const rgb = labToRgb(l, a, b);
        output[i * 4 + 0] = rgb.r;
        output[i * 4 + 1] = rgb.g;
        output[i * 4 + 2] = rgb.b;
    }

    return new ImageData(output, w, h);
}

export default sharpenImage;