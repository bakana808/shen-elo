
module.exports = class Elo {

	constructor(options) {

		this.floor = 100;
		this.k = 40;
		if (typeof options === "object") {

			if ("floor" in options) { this.floor = options.floor; }

			if ("k" in options) { this.k = options.k; }
		}
	}

	getK(rating) {

		if (typeof this.k === "number") {

			return this.k;
		}
		if (typeof this.k === "object") {

			var keys = Object.keys(this.k);
			var k = this.k["0"];
			keys.sort((a, b) => { return a - b; });
			keys.forEach((key) => {

				if (+rating >= +key) {

					k = this.k[key];
				}
			});
			return k;
		}
		return 40;
	}

	/**
	 * Calculates the expected score of a player in a match against an opponent
	 * based on the difference in skill rating between them and the opponent.
	 * This will be a number from 0.0 to 1.0 (0% - 100%).
	 *
	 * @example
	 * int a = 1000;
	 * int b = 1000;
	 * elo.expectedScore(a, b);
	 * // => 0.5 (or 50%)
	 *
	 * 1% chance if diff is ~-800
	 * 10% chance if diff ~-400
	 * 25% chance if diff ~-200
	 *
	 * @param {Number} diff The rating difference
	 * @return the expected score of the player
	 */
	static expectedScore(diff) {

		return 1 / (1 + Math.pow(10, diff / 400));
	}

	expectedScore(diff) {

		return Elo.expectedScore(diff);
	}

	/**
	 * Calculates the rating adjustment from the player's
	 * current rating, the opponent's rating, score, and the constant K.
	 *
	 * Score can be any number ranging from 0 to 1, but in most cases it's
	 * either 0 _or_ 1 (did the player win or lose?). Use 0.5 as the score to
	 * signify a draw.
	 *
	 * K is the maximum rating coefficient for any given match. For example, if
	 * K = 40 (the base K of chess rankings) and the rating difference
	 * between two players is great (the expected score for either player is ~1 or 0),
	 * then the most their rating their change will be 40.
	 *
	 * If a floor rating is defined, then the rating adjustment will never drop a player's
	 * rating below that value.
	 *
	 * @param {Number} rating the rating of the player
	 * @param {Number} rc the rating of the opponent
	 * @param {Number} score the score of the player (from 0 to 1)
	 * @param {Number} k the rating coefficient
	 * @param {Number} floor the rating floor
	 */
	static adjust(a, b, score, k) {

		var expected = Elo.expectedScore(b - a);
		return Math.round(k * (score - expected));
	}

	adjust(a, b, score, k = this.getK(a)) {

		return Elo.adjust(a, b, score, k);
	}
}