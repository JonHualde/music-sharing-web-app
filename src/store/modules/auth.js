import { auth, usersCollection } from "@/includes/firebase";

export default {
  namespaced: true,
  state: {
    authModalShown: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShown = !state.authModalShown;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit("toggleAuth");
      }
    },
    async register({ commit }, payload) {
      const userCredentials = await auth.createUserWithEmailAndPassword(payload.email, payload.password);

      await usersCollection.doc(userCredentials.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
        userType: payload.userType,
      });

      await userCredentials.user.updateProfile({
        displayName: payload.name,
      });

      commit("toggleAuth");
    },
    async logIn({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit("toggleAuth");
    },
    async signOut(context) {
      await auth.signOut();

      context.commit("toggleAuth");
    },
  },
};
