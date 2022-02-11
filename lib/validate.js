// NOT USED ANY MORE
///

const Validate = {
  required: (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = 'Required';
    }
    return errorMessage;
  },

  optional: () => {
    return undefined;
  },

  email: (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      errorMessage = 'Invalid email address';
    }
    return errorMessage;
  },
};

export default Validate;
