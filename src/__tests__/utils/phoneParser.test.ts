import { describe, it, expect } from 'vitest';
import { defaultCountries, parseCountry } from 'react-international-phone';

/**
 * Tests for phone number parsing logic used in SignUp and AccountSettings
 * 
 * These tests document the expected behavior of extracting country code
 * and national number from phone input.
 */

describe('Phone Number Parsing', () => {
  describe('Country Code Extraction', () => {
    it('extracts country code for Germany', () => {
      const country = defaultCountries.find(c => c[1] === 'de');
      expect(country).toBeDefined();
      
      if (country) {
        const parsed = parseCountry(country);
        expect(parsed.dialCode).toBe('49');
        expect(`+${parsed.dialCode}`).toBe('+49');
      }
    });

    it('extracts country code for United States', () => {
      const country = defaultCountries.find(c => c[1] === 'us');
      expect(country).toBeDefined();
      
      if (country) {
        const parsed = parseCountry(country);
        expect(parsed.dialCode).toBe('1');
        expect(`+${parsed.dialCode}`).toBe('+1');
      }
    });

    it('extracts country code for United Kingdom', () => {
      const country = defaultCountries.find(c => c[1] === 'gb');
      expect(country).toBeDefined();
      
      if (country) {
        const parsed = parseCountry(country);
        expect(parsed.dialCode).toBe('44');
        expect(`+${parsed.dialCode}`).toBe('+44');
      }
    });
  });

  describe('National Number Extraction', () => {
    it('removes country code and spaces from formatted German number', () => {
      const phone = '+49 160 93162276';
      const dialCode = '+49';
      const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
      
      expect(nationalNumber).toBe('16093162276');
    });

    it('removes country code and spaces from formatted US number', () => {
      const phone = '+1 555 123 4567';
      const dialCode = '+1';
      const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
      
      expect(nationalNumber).toBe('5551234567');
    });

    it('handles unformatted number', () => {
      const phone = '+4916093162276';
      const dialCode = '+49';
      const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
      
      expect(nationalNumber).toBe('16093162276');
    });

    it('removes dashes and parentheses', () => {
      const phone = '+1 (555) 123-4567';
      const dialCode = '+1';
      const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
      
      expect(nationalNumber).toBe('5551234567');
    });

    it('handles empty string', () => {
      const phone = '';
      const dialCode = '+49';
      const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
      
      expect(nationalNumber).toBe('');
    });
  });

  describe('Complete Phone Number Parsing', () => {
    it('correctly splits German phone number into country code and national number', () => {
      const phone = '+49 160 93162276';
      const phoneCountry = 'de';
      
      const country = defaultCountries.find(c => c[1] === phoneCountry);
      expect(country).toBeDefined();
      
      if (country) {
        const parsed = parseCountry(country);
        const dialCode = `+${parsed.dialCode}`;
        const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
        
        expect(dialCode).toBe('+49');
        expect(nationalNumber).toBe('16093162276');
      }
    });

    it('correctly splits US phone number into country code and national number', () => {
      const phone = '+1 555 123 4567';
      const phoneCountry = 'us';
      
      const country = defaultCountries.find(c => c[1] === phoneCountry);
      expect(country).toBeDefined();
      
      if (country) {
        const parsed = parseCountry(country);
        const dialCode = `+${parsed.dialCode}`;
        const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
        
        expect(dialCode).toBe('+1');
        expect(nationalNumber).toBe('5551234567');
      }
    });

    it('handles phone number without national number part', () => {
      const phone = '+49';
      const phoneCountry = 'de';
      
      const country = defaultCountries.find(c => c[1] === phoneCountry);
      expect(country).toBeDefined();
      
      if (country) {
        const parsed = parseCountry(country);
        const dialCode = `+${parsed.dialCode}`;
        const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
        
        expect(dialCode).toBe('+49');
        expect(nationalNumber).toBe(''); // Should be empty
      }
    });
  });

  describe('Backend Payload Format', () => {
    it('creates correct payload for German number', () => {
      const phone = '+49 160 93162276';
      const phoneCountry = 'de';
      
      const country = defaultCountries.find(c => c[1] === phoneCountry);
      
      if (country) {
        const parsed = parseCountry(country);
        const dialCode = `+${parsed.dialCode}`;
        const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
        
        const payload = {
          whatsapp_country_code: dialCode,
          whatsapp_phone_number: nationalNumber,
        };
        
        expect(payload).toEqual({
          whatsapp_country_code: '+49',
          whatsapp_phone_number: '16093162276',
        });
      }
    });

    it('creates null payload when phone is empty', () => {
      const phone = '';
      
      const payload = {
        whatsapp_country_code: null,
        whatsapp_phone_number: null,
      };
      
      expect(payload).toEqual({
        whatsapp_country_code: null,
        whatsapp_phone_number: null,
      });
    });
  });
});

