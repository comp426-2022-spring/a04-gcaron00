  function coinFlip() {
    if(Math.floor(Math.random() * 2) == 0) {
      return 'heads';
    } else {
      return 'tails';
    }
  }
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
  function coinFlips(flips) {
    let results = new Array(flips);
    for(let i  =  0; i < results.length; i++) {
      results[i] = coinFlip();
    }
    return results
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
  function countFlips(array) {
    let count = {"heads": 0, "tails": 0}
    for(let i = 0; i < array.length; i++) {
      if(array[i] == "heads") {
        count.heads++;
      } else {
        count.tails++;
      }
    }
    return count
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
  function flipACoin(call) {
    let flip = coinFlip()
    let game = {call: call, flip: flip, result: ""}
    if(flip == call) {
      game.result = "win";
    } else {
      game.result = "lose"
    }
    return game
  }
  
  
  module.exports = {coinFlip, coinFlips, countFlips, flipACoin};
  