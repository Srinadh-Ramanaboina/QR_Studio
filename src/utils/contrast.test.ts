import test from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb, getContrastRatio, evaluateScannability } from './contrast';

test('hexToRgb parses 6-digit and 3-digit hex colors', () => {
  assert.deepEqual(hexToRgb('#ffffff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('#000000'), { r: 0, g: 0, b: 0 });
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('123456'), { r: 18, g: 52, b: 86 });
});

test('getContrastRatio computes black on white as 21:1', () => {
  const ratio = getContrastRatio('#000000', '#ffffff');
  assert.ok(ratio >= 20.9 && ratio <= 21.1, `Ratio was ${ratio}`);
});

test('getContrastRatio computes identical colors as 1:1', () => {
  const ratio = getContrastRatio('#336699', '#336699');
  assert.equal(Math.round(ratio), 1);
});

test('evaluateScannability rates standard black on white as excellent', () => {
  const evalResult = evaluateScannability('#000000', '#ffffff', 'M', false);
  assert.equal(evalResult.status, 'excellent');
  assert.ok(evalResult.score >= 90);
});

test('evaluateScannability flags low contrast combinations', () => {
  const evalResult = evaluateScannability('#cccccc', '#ffffff', 'M', false);
  assert.equal(evalResult.status, 'poor');
  assert.ok(evalResult.score < 50);
});
