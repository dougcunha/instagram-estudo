import validator from 'validator';

export function checkEmail(element, setEmailError) {
    const email = element.target.value;
    setEmailError(null);
    if (!email)
      return;

    if (!validator.isEmail(email))
      setEmailError('Email inválido!');
}
