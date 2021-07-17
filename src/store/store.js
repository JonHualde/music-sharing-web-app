import { createStore } from "vuex";
import { auth, usersCollection } from "@/includes/firebase";

export default createStore({
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
  getters: {
    // authModalShow: (state) => state.authModalShown,
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

      // $store object is accessible from any component
      commit("toggleAuth");
    },
    async logIn({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit("toggleAuth");
    },
    async signOut(context) {
      await auth.signOut();

      context.commit("toggleAuth");

      // if (payload.route.meta.requiresAuth) {
      //   payload.router.push({ name: "home" });
      // }
    },
  },
});

/**
FIREBASE - UPDATE PROFILE
const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: "Jane Q. User",
  photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(() => {
  // Update successful
  // ...
}).catch((error) => {
  // An error occurred
  // ...
});
 */
