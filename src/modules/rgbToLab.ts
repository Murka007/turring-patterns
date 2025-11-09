const rgbToLab = (r: number, g: number, b: number) => {
    let rn = r / 255;
    let gn = g / 255;
    let bn = b / 255;

    rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
    gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
    bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

    let x = (rn * 0.4124 + gn * 0.3576 + bn * 0.1805) / 0.95047;
    let y = (rn * 0.2126 + gn * 0.7152 + bn * 0.0722) / 1.0;
    let z = (rn * 0.0193 + gn * 0.1192 + bn * 0.9505) / 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    return {
        l: 116 * y - 16,
        a: 500 * (x - y),
        b: 200 * (y - z),
    } as const;
}

export default rgbToLab;