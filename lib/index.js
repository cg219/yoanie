const crypto = require("crypto");
const ALPHA_UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHA_LO = "abcdefghijklmnopqrstuvwxyz";
const NUMERIC = "1234567890";
const SYMBOL = "!@#$%^&*()-_";

class Yoanie {
  constructor(opts) {
    this.masterKey = opts ? opts.master : "password";
    this.secretKey = opts ? opts.secret : "secret";
  }

  set master(value) {
    this.masterKey = value;
  }

  set secret(value) {
    this.secretKey = value;
  }

  generate(domain, id) {
    let hasher = (salt, phrase) => {
      let hash = crypto.createHash("md5");

      hash.update(`${phrase} ${salt}`);
      return hash.digest("hex");
    }

    let maker = (hash, opts) => {
      let defaults = {
        length: 8,
        alpha: true,
        numeric: true,
        symbol: true,
        uppercase: false
      }
      let finalOpts = {...defaults, ...opts};
      let decimalHash = parseInt(hash, 16);
      let generatedPassword = [];
      let i = 0;
      let key = `${ALPHA_LO}${finalOpts.uppercase ? ALPHA_UP : ""}${finalOpts.numeric ? NUMERIC : ""}${finalOpts.symbol ? SYMBOL : ""}`.split("");

      // console.log(key)
      for(i; i < finalOpts.length; i++) {
        let remainder = decimalHash % key.length;
        
        decimalHash = Math.floor(decimalHash / key.length);
        generatedPassword.push(key[remainder]);
      }

      return generatedPassword.join("");
    }

    let hashme = id ? `${this.masterKey}${id}` : this.masterKey;
    let salt = hasher(this.secretKey, domain);
    let hash = hasher(salt, hashme);

    return maker(hash, {length: 16});
    return hash;
  }
}

let yoan = new Yoanie();
let password = yoan.generate("youtube.com", "kreativemente");

console.log(password);