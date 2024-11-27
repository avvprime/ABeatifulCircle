export function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileUserAgent = /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isMobileScreenSize = window.matchMedia("(max-width: 767px)").matches;
  
    return isMobileUserAgent || isMobileScreenSize;
}