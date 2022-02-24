import validator from 'validator';

export function validarEmail(elemento, setEmailError) {
    const email = elemento.target.value;
    setEmailError(null);
    if (!email)
      return;

    if (!validator.isEmail(email))
      setEmailError('Email inválido!');
}
