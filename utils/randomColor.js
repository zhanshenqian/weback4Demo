function RandomColor(length) {
  if (length) {
    let arr = []
    for (let i = 0; i < length; i++) {
      arr.push(getColorBetter())
    }
    noRepeat(arr, getColorBetter)
    return arr
  } else {
    return getColorBetter()
  }

}
function getColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16)
}

//排除过灰颜色 排除过亮过暗色 并转成16位
function getColorBetter() {
  let ret = randomHsl()
  ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
  ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色
  ret = ret.map(function (item) {
    return parseFloat(item.toFixed(2));
  });
  // 转成RGB
  ret = hslToRgb(...ret)
  return colorHex(ret)
}


/**
     * HSL颜色值转换为RGB
     * H，S，L 设定在 [0, 1] 之间
     * R，G，B 返回在 [0, 255] 之间
     *
     * @param H 色相
     * @param S 饱和度
     * @param L 亮度
     * @returns Array RGB色值
     */
function hslToRgb(H, S, L) {
  var R, G, B;
  if (+S === 0) {
    R = G = B = L; // 饱和度为0 为灰色
  } else {
    var hue2Rgb = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    var P = 2 * L - Q;
    R = hue2Rgb(P, Q, H + 1 / 3);
    G = hue2Rgb(P, Q, H);
    B = hue2Rgb(P, Q, H - 1 / 3);
  }
  return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
}
// 获取随机HSL
function randomHsl() {
  var H = Math.random();
  var S = Math.random();
  var L = Math.random();
  return [H, S, L];
}

function colorHex(arr) {
  let color = '#'
  arr.map(n => {
    color += Number(n).toString(16)
  })
  return color
}

// 去重
function noRepeat(arr, fn) {
  let arr1 = [...new Set(arr)]
  if (arr1.length < arr.length) {
    for (let i = 0; i < arr.length - arr1.length; i++) {
      arr1.push(fn())
    }
    noRepeat(arr1, fn)
  } else {
    return arr1
  }
}
export default RandomColor
