import Config from '@/config';

const Validate = {
  required: (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = 'Fylla þarf út reitinn';
    }
    return errorMessage;
  },

  optional: () => {
    return undefined;
  },

  email: (value) => {
    let errorMessage;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      errorMessage = 'Vinsamlegast sláið inn gilt netfang (T.d. jonjons@domain.com)';
    }
    return errorMessage;
  },

  parseNumber: (value) => {
    if (value === '' || value === undefined || value == null) return null;
    const valString = `${value}`;
    const val = valString.trim().replace('-', '').replace(' ', '');
    if (Number.isNaN(val)) {
      return null;
    }
    return parseInt(val, 10);
  },

  minMax: (minValue, maxValue, { message = null } = {}) => {
    return (value) => {
      const parsed = Validate.parseNumber(value);
      if (parsed === null) return 'Invalid';
      if (minValue !== null && parsed < minValue) {
        return message || `Must be greater than ${minValue}`;
      }

      if (maxValue !== undefined && parsed > maxValue) {
        return message || `Must be less than ${maxValue}`;
      }

      return undefined;
    };
  },

  lengthMinMax: (minValue, maxValue, { message = null } = {}) => {
    return (value) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (minValue !== null && value.length < minValue) {
        return message || 'Of stutt lykilorð';
      }

      // eslint-disable-next-line react/destructuring-assignment
      if (maxValue !== undefined && value.length > maxValue) {
        return message || 'Of langt lykilorð';
      }

      return undefined;
    };
  },

  number: (value) => {
    let errorMessage;
    if (!/^[0-9]+$/i.test(value)) {
      errorMessage = 'Vinsamlegast sláið inn löglegt símanúmer';
    }
    return errorMessage;
  },

  telephone: (value) => {
    const countryPhoneCode = value.slice(0, Config.DefaultCountryPhoneCode.length);
    let range = 7;
    let regexMobile = /^([0-9]*)$/i;
    if (value.includes('+') && (countryPhoneCode === Config.DefaultCountryPhoneCode)) {
      range += Config.DefaultCountryPhoneCode.length;
      regexMobile = /^\+([0-9]*)$/i; // To support +354XXXXXXX
    }
    const msg = Validate.lengthMinMax(range, range, { message: 'Vinsamlegast sláið inn löglegt símanúmer' })(value);
    let errorMessage;
    if (!regexMobile.test(value)) {
      errorMessage = 'Vinsamlegast sláið inn löglegt símanúmer';
    }
    return msg || errorMessage;
  },

  ssn: (value) => {
    const errorMessage = 'Vinsamlegast sláið inn löglega kennitölu';
    if (value === '' || value === undefined || value == null) return null;
    const parsed = `${value}`;
    // eslint-disable-next-line react/destructuring-assignment
    const ssn = parsed.trim().replace('-', '').replace(' ', '');
    if (ssn.length !== 10) return errorMessage;
    const sSum = (3 * parseInt(ssn.substr(0, 1), 10))
      + (2 * parseInt(ssn.substr(1, 1), 10))
      + (7 * parseInt(ssn.substr(2, 1), 10))
      + (6 * parseInt(ssn.substr(3, 1), 10))
      + (5 * parseInt(ssn.substr(4, 1), 10))
      + (4 * parseInt(ssn.substr(5, 1), 10))
      + (3 * parseInt(ssn.substr(6, 1), 10))
      + (2 * parseInt(ssn.substr(7, 1), 10));

    let modRes = sSum % 11;
    if (modRes > 0) {
      modRes = 11 - modRes;
    }
    if (modRes !== parseInt(ssn.substr(8, 1), 10)) {
      return errorMessage;
    }
    const century = parseInt(ssn.substr(9, 1), 10);
    if (Number.isNaN(century) || (century !== 0 && century !== 9 && century !== 8)) {
      return errorMessage;
    }

    return undefined;
  },

  all: (fns, { message = null } = {}) => {
    return (value) => {
      for (let i = 0; i < fns.length; i += 1) {
        const fn = fns[i];
        const msg = fn(value);
        if (msg) {
          return message || msg;
        }
      }
      return undefined;
    };
  },
};

export default Validate;
