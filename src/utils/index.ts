import { message } from 'ant-design-vue';

export default {
  /**格式化地址 */
  formatAddr(value: string) {
    if (!value) return '';
    const index = value.length;
    return value.slice(0, 5) + '...' + value.slice(index - 5, index);
  },

  /**保留小数，向下取整，去掉末尾的0，添加数字千分位 */
  formatNumber(number: number, decimals: number = 4): string {
    if (!number) return '0';
    const roundedNumber = Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    const [integerPart, decimalPart] = roundedNumber.toFixed(decimals).split('.');
    const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (decimalPart) {
      const trimmedDecimalPart = decimalPart.replace(/0+$/, '');
      return `${integerWithCommas}${trimmedDecimalPart !== '' ? '.' + trimmedDecimalPart : ''}`;
    } else {
      return integerWithCommas;
    }
  },

  /**不添加数字千分位 */
  formatNumberNoSeparator(number: number, decimals: number = 2) {
    if (!number) return '0';
    const roundedNumber = Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    const [integerPart, decimalPart] = roundedNumber.toFixed(decimals).split('.');
    if (decimalPart) {
      const trimmedDecimalPart = decimalPart.replace(/0+$/, '');
      return `${integerPart}${trimmedDecimalPart !== '' ? '.' + trimmedDecimalPart : ''}`;
    } else {
      return integerPart;
    }
  },

  /**格式化时间 */
  formatDate(strDate: any, strFormat: string = 'yyyy/MM/dd HH:mm'): any {
    if (!strDate) return;
    if (typeof strDate == 'string') {
      strDate = new Date(strDate.replace(/-/g, '/'));
    } else if (typeof strDate == 'number') {
      strDate = new Date(strDate);
    }
    if (strDate instanceof Date) {
      const dict: any = {
        yyyy: strDate.getFullYear(),
        M: strDate.getMonth() + 1,
        d: strDate.getDate(),
        H: strDate.getHours(),
        m: strDate.getMinutes(),
        s: strDate.getSeconds(),
        MM: ('' + (strDate.getMonth() + 101)).substr(1),
        dd: ('' + (strDate.getDate() + 100)).substr(1),
        HH: ('' + (strDate.getHours() + 100)).substr(1),
        mm: ('' + (strDate.getMinutes() + 100)).substr(1),
        ss: ('' + (strDate.getSeconds() + 100)).substr(1)
      };
      return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function (m: any) {
        return dict[m];
      });
    }
  },

  /**滚动到页面顶部 */
  scrollToTop() {
    let distance = document.documentElement.scrollTop;
    const step = distance / 10;
    (function jump() {
      if (distance > 0) {
        distance -= step;
        window.scrollTo(0, distance);
        setTimeout(jump, 10);
      }
    })();
  },

  /**锚点滚动 */
  scrollToTarget(anchor) {
    const headerElement = document.getElementsByTagName('header')[0];
    const headerHeight = headerElement.clientHeight;
    const anchorElement = document.getElementById(anchor);
    if (anchorElement) {
      const anchorOffset = anchorElement.offsetTop - headerHeight;
      window.scrollTo({ top: anchorOffset, behavior: 'smooth' });
    }
  },

  /**复制 */
  handleCopy(value: string) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand('Copy');
    document.body.removeChild(dummy);
    message.success('Copied');
  },

  isMobile() {
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
    const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
    const isMobile = isIOS || isAndroid;
    return isMobile;
  },

  resetRem() {
    const clientWidth = document.body.clientWidth;
    const rem = clientWidth > 750 ? (clientWidth * 100) / 1920 : (clientWidth * 100) / 750;
    // console.log('rem', rem);
    document.documentElement.style.fontSize = `${rem}px`;
  },

  /**防抖 */
  debounce(fn, delay) {
    let timer: any = null;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    };
  },

  /**节流 */
  throttle(fn, delay) {
    let canUse = true;
    return () => {
      if (canUse) {
        fn.apply(this, arguments);
        canUse = false;
        setTimeout(() => (canUse = true), delay);
      }
    };
  }
};
