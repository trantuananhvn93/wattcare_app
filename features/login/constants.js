const PASSWORD_MIN = 3;
const PASSWORD_MAX = 30;
const PASSWORD_MAX_ERROR = `La taille du mot de passe doit être inférieur ou égal à ${PASSWORD_MAX} caractères.`;
const PASSWORD_MIN_ERROR = `La taille du mot de passe doit être au moins de ${PASSWORD_MIN} caractères.`;
const USERNAME_EMAIL_ERROR = `L'adresse e-mail doit être valide.`;
const USERNAME_PASSWORD_COMBINATION_ERROR = `L'adresse e-mail doit être valide.`;
const INTERNAL_SERVER_ERROR = `Un problème est survenu ! Veuillez réessayer.`;
const SUCCESSFULLY_LOGGED_IN = `Vous vous êtes connecté avec succès.`;
const FETCH_INFO_ERROR_MESSAGE = `Impossible de récupérer les informations de votre compte.`;
// const PASSWORD_MAX_ERROR = `Password length must be less than or equal to ${PASSWORD_MAX} characters long`;
// const PASSWORD_MIN_ERROR = `Password length must be at least ${PASSWORD_MIN} characters long`;
// const USERNAME_EMAIL_ERROR = 'Email must be a valid email address';
// const USERNAME_PASSWORD_COMBINATION_ERROR = 'These credentials do not match our records.';
// const INTERNAL_SERVER_ERROR = 'Something went wrong! Please try again.';
// const SUCCESSFULLY_LOGGED_IN = 'You have successfully logged in.';
// const FETCH_INFO_ERROR_MESSAGE = 'Could not fetch your account information';

module.exports = {
  PASSWORD_MAX,
  PASSWORD_MIN,
  PASSWORD_MAX_ERROR,
  PASSWORD_MIN_ERROR,
  USERNAME_EMAIL_ERROR,
  USERNAME_PASSWORD_COMBINATION_ERROR,
  INTERNAL_SERVER_ERROR,
  SUCCESSFULLY_LOGGED_IN,
  FETCH_INFO_ERROR_MESSAGE,
};
