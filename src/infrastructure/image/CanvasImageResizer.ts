/**
 * 画像を縮小して dataURL を返す（デモ handleImage 相当：最大600px / JPEG 0.8）。
 * ブラウザの canvas に依存するため infrastructure に隔離。
 * 将来は ImageStorage ポートの裏でアップロード実装に差し替え可能。
 */
const MAX_SIZE = 600;
const JPEG_QUALITY = 0.8;

export const resizeImageToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('画像の解析に失敗しました'));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          const r = Math.min(MAX_SIZE / width, MAX_SIZE / height);
          width = width * r;
          height = height * r;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas コンテキストを取得できませんでした'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
