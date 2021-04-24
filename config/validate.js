import {Validator} from 'node-input-validator';
import httpErrors from 'http-errors';
import _ from 'lodash';

async function Validate(inputs, rules, customError, messages) {
    let v = new Validator(inputs, rules, messages);
    if (!await v.check()) {
        const errors = {};
        _.forEach(v.errors, (e, k) => {
            errors[k] = e.message || e;
        });
        v.errors = errors;
        if (customError) {
            v = customError(v);
        }
        if (v) {
            throw httpErrors(422, v);
        }
    }
}

export default Validate;
