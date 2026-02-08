/* eslint-disable */
(function () {
  const s = document.currentScript;

  if (s) {
    const id = s.getAttribute('data-short');
    const width = s.getAttribute('width');
    const height = s.getAttribute('height');
    const src = s.getAttribute('src');
    const urlObj = new URL(src);

    if (id) {
      // regexp for check valid size values (width/height)
      const regexp = /[0-9]*\.?[0-9]+(px|%)/i;

      const attrs = {
        allowfullscreen: '',
        frameborder: 0,
        allow: 'camera;microphone;vr;accelerometer;gyroscope;fullscreen',
        width: width && regexp.test(width) ? width : '100%',
        height: height && regexp.test(height) ? height : '500px',
      };

      const iframe = document.createElement('iframe');
      const originURL = urlObj.origin;
      const pathnameUrlWithoutScriptPath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/public/shareScript.js'));
      const newPathname = `${originURL}${pathnameUrlWithoutScriptPath}`
      iframe.src = `${newPathname}/${id}`;

      for (const key in attrs) {
        iframe.setAttribute(key, attrs[key]);
      }

      s.parentNode.insertBefore(iframe, s);
    }
  }
}());
