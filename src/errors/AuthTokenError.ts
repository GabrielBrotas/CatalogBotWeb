// assim podemos identificar o tipo de erro que foi lancado ao inves de utilizar um generico
export class AuthTokenError extends Error {
  constructor() {
    super("Authorization Token Error");
  }
}
