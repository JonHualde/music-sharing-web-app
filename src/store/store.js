import { createStore } from "vuex";
import { auth, usersCollection } from "@/includes/firebase";
import helper from "@/includes/helper";
import { Howl } from "howler";

export default createStore({
  state: {
    authModalShown: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0",
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShown = !state.authModalShown;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong: (state, payload) => {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition: (state) => {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}`;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShown,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
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
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit("newSong", payload);

      state.sound.play();

      state.sound.on("play", () => {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      });
    },
    progress({ commit, state, dispatch }) {
      commit("updatePosition");

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      }
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) return;

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    async updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      // Document width = 2000 ; timeline width = 1000 ; clickX = 500, Distance = 500
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);
      state.sound.once("seek", () => {
        dispatch("progress");
      });
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
