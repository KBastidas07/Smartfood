const TOKEN_KEY = 'smartfood_token';
const USER_KEY = 'smartfood_user';

export const sessionStorageService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser: () => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  save: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
