import {test} from 'node:test';
import assert from 'node:assert';
import {generateShortCode} from './shortcode.mjs';

test("returns a string", () => {
    const code = generateShortCode();
    assert.strictEqual(typeof code, "string");
});

test("contains only lowercase letter and numbers", () => {
    const code = generateShortCode();
    assert.match(code, /^[a-z0-9]+$/);
});
test("always returns exactly 6 characters", () => {
    for (let i = 0; i < 1000000; i++) {
        const code = generateShortCode();
        assert.strictEqual(code.length, 6, `Bad code: "${code}" (length ${code.length})`);
    }
});
