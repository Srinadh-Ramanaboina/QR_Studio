import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatUrl,
  formatWifi,
  formatVCard,
  formatEmail,
  formatPhone,
  formatSms,
  formatGeo,
  formatCrypto,
  formatSocial
} from './qrPayloads';

test('formatUrl handles standard and bare domains', () => {
  assert.equal(formatUrl('https://example.com'), 'https://example.com');
  assert.equal(formatUrl('google.com'), 'https://google.com');
  assert.equal(formatUrl(''), '');
});

test('formatWifi generates valid WIFI payload with escaping', () => {
  const result = formatWifi({
    ssid: 'Home;Network',
    password: 'p:secret"123',
    encryption: 'WPA',
    hidden: false
  });
  assert.ok(result.startsWith('WIFI:T:WPA;'));
  assert.ok(result.includes('S:Home\\;Network;'));
  assert.ok(result.includes('P:p\\:secret\\"123;'));
  assert.ok(result.endsWith('H:false;;'));
});

test('formatWifi handles open / nopass networks', () => {
  const result = formatWifi({
    ssid: 'Free_Guest',
    password: '',
    encryption: 'nopass',
    hidden: true
  });
  assert.equal(result, 'WIFI:T:nopass;S:Free_Guest;P:;H:true;;');
});

test('formatVCard produces compliant 3.0 vCard', () => {
  const vcard = formatVCard({
    firstName: 'Alex',
    lastName: 'Morgan',
    organization: 'Acme Corp',
    jobTitle: 'Lead Engineer',
    phoneMobile: '+15551234567',
    phoneWork: '',
    email: 'alex@example.com',
    url: 'alex.dev',
    street: '123 Market St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'USA',
    note: 'Met at tech summit'
  });

  assert.ok(vcard.startsWith('BEGIN:VCARD\nVERSION:3.0'));
  assert.ok(vcard.includes('FN:Alex Morgan'));
  assert.ok(vcard.includes('TEL;TYPE=CELL:+15551234567'));
  assert.ok(vcard.includes('EMAIL;TYPE=PREF,INTERNET:alex@example.com'));
  assert.ok(vcard.includes('URL:https://alex.dev'));
  assert.ok(vcard.endsWith('END:VCARD'));
});

test('formatEmail produces valid mailto scheme', () => {
  const email = formatEmail({
    to: 'hello@qrstudio.com',
    subject: 'Feedback & Inquiry',
    body: 'Hi team!'
  });
  assert.ok(email.startsWith('mailto:hello%40qrstudio.com?'));
  assert.ok(email.includes('subject=Feedback%20%26%20Inquiry'));
  assert.ok(email.includes('body=Hi%20team!'));
});

test('formatPhone formats international and local numbers', () => {
  assert.equal(formatPhone('+1 (555) 019-2831'), 'tel:+15550192831');
});

test('formatSms formats smsto payload', () => {
  const sms = formatSms({ phone: '+1234567890', message: 'Hi there' });
  assert.equal(sms, 'smsto:+1234567890:Hi there');
});

test('formatGeo produces geo: URI', () => {
  assert.equal(formatGeo({ latitude: 37.7749, longitude: -122.4194 }), 'geo:37.7749,-122.4194');
});

test('formatCrypto generates bitcoin URI with amount', () => {
  const btc = formatCrypto({
    currency: 'bitcoin',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amount: '0.05',
    label: 'Donation'
  });
  assert.ok(btc.startsWith('bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?'));
  assert.ok(btc.includes('amount=0.05'));
  assert.ok(btc.includes('label=Donation'));
});

test('formatSocial generates clean social URLs', () => {
  assert.equal(formatSocial({ platform: 'github', username: 'torvalds' }), 'https://github.com/torvalds');
  assert.equal(formatSocial({ platform: 'x', username: '@elonmusk' }), 'https://x.com/elonmusk');
  assert.equal(formatSocial({ platform: 'instagram', username: 'design' }), 'https://instagram.com/design');
});
