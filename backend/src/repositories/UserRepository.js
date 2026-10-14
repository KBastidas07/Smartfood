class UserRepository {
  constructor(store) {
    this.store = store;
  }

  add(newUser) {
    const users = this.store.users;
    newUser.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push(newUser);
    return newUser;
  }

  findByEmail(email) {
    return this.store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
}

module.exports = UserRepository;
