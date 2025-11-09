const renderImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;

    const scale = Math.max(
        img.width / cw,
        img.height / ch,
    );
    const w = img.width / scale;
    const h = img.height / scale;

    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
}

export default renderImage;