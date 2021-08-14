export default {
  
  /**
   * Sku 排列演算法
   */
  cartesianProductOf () {
    return Array.prototype.reduce.call(arguments, function (a, b) {
      let ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    }, [[]]);
   },
  
  /**
   * 
   */
  swapArray (arr, idx1, idx2) {
    arr[idx1] = arr.splice(idx2, 1, arr[idx1])[0];
    return arr;
   },
   
  /**
   * 上移
   * 當前數組index索引和後面一個元素互換位置
   * 即 數組向後面移動一位
   */
  moveUp (arr, index) {
    this.swapArray(arr, index, index - 1);
  },

  /**
   * 下移
   * 當前數組index索引和前面一個元素互換位置
   * 即 數組向前面移動一位
   */
  moveDown (arr, index) {
    this.swapArray(arr, index, index + 1);
   },
  
}