import Croppie from 'croppie';
import 'croppie/croppie.css';
import { useEffect, useState } from 'react';

export function CropImage({
  src,
  setResult,
  resultType='Base64',
  type,
  btnResultId,
  maxWidth=300,
  maxHeight=300
}) {
  const [resize, setResize] = useState(null);

  useEffect(() => {
    if (!resize && src) {
      const el = document.getElementById('img-container');

      function getSize() {
        const wm = maxWidth === 0 ? 0 : el.naturalWidth / maxWidth;
        const hm = maxHeight === 0 ? 0 : el.naturalHeight / maxHeight;

        if (wm > hm) {
          const wp = maxWidth / el.naturalWidth;
          return {width: el.naturalWidth * wp, height: el.naturalHeight * wp }
        }

        const hp = maxHeight / el.naturalHeight;
        return {width: el.naturalWidth * hp, height: el.naturalHeight * hp};
      }

      function getResult(e) {
        e?.preventDefault?.();
        resize?.result(resultType)
          .then(result => {
            setResult?.(result);
          });
      }

      const { width, height } = getSize();
      console.log(`${width}x${height}`);

      const resize = new Croppie(el, {
          viewport: { width: width, height: height, type: type },
          boundary: { width: width, height: height },
          showZoomer: true,
          enableResize: false,
          enableOrientation: true,
          mouseWheelZoom: 'ctrl',
          minZoom: 0.1
      });
      resize.bind({
          url: src,
      });
      setResize(resize);

      const btn = document.getElementById(btnResultId);
      btn.onclick = getResult;
    }
  }, [
    src,
    resize,
    type,
    maxWidth,
    maxHeight,
    btnResultId,
    resultType,
    setResult
  ]);

  return src && (
    <div className="crop-container">
      <img id="img-container" src={src} alt=''/>
    </div>
  );
}