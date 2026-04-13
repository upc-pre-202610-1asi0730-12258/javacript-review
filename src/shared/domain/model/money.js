import {ValidationError} from "./errors.js";
import {Currency} from "./currency.js";

/**
 * Value Object representing an amount of money with a currency.
 * Immutable and supports basic operations like addition and multiplication.
 */
export class Money {
    #amount;
    #currency;

    /**
     * Creates a new Money instance
     * @param {Object} params               -   Parameters for creating Money
     * @param {number} params.amount        -   The amount of money (non-negative number)
     * @param {Currency} params.currency    -   The currency of the money (must be a valid Currency object)
     * @throws {ValidationError}            -   If amount is not a non-negative number or if currency is not a valid Currency object.
     */
    constructor({ amount, currency }) {
        if (!Number.isFinite(amount) || amount < 0)
            throw new ValidationError("Amount must be a non-negative number");
        if (!(currency instanceof Currency))
            throw new ValidationError('Currency must be a valid Currency object.');
        this.#amount = Number(amount.toFixed(2));
        this.#currency = currency;
    }

    get amount() {
        return this.#amount;
    }

    get currency() {
        return this.#currency;
    }

    /**
     * Adds another Money instance to this one, returning a new Money instance with the sum.
     * @param other {Money} - The other Money instance to add (must have the same currency)
     * @returns {Money} - A new Money instance representing the sum of this and the other
     */
    add(other) {
        if (!(other instanceof Money) || !this.#currency.equals(other.currency))
            throw new ValidationError('Cannot add Money with different currencies.');
        return new Money({
            amount: this.#amount + other.amount,
            currency: this.#currency});
    }

    /**
     * Multiplies this Money instance by a non-negative number, returning a new Money instance with the product.
     * @param multiplier {number}   - The non-negative number to multiply by
     * @returns {Money}             - A new Money instance representing the product of this and the multiplier
     */
    multiply(multiplier) {
        if (!(Number.isFinite(multiplier)) || multiplier < 0)
            throw new ValidationError('Multiplier must be a non-negative number');
        return new Money({
            amount: this.#amount * multiplier,
            currency: this.#currency});
    }

    toString() {
        return `${this.#currency.code} ${this.#amount.toFixed(2)}`;
    }

    /**
     * Checks if this Money instance is equal to another, based on amount and currency.
     * @param other {Money} - The other Money instance to compare with
     * @returns {false|*|boolean}   - True if both Money instances have the same amount and currency, false otherwise
     */
    equals(other) {
        return(other instanceof Money
            && this.#amount === other.amount
            && this.#currency.equals(other.currency));
    }
}