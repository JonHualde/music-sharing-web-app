<template>
  <main>
    <Introduction />
    <!-- Component registered globally in globals.js -->
    <!-- <base-button /> -->
    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon-secondary="{ icon: 'headphones-alt', right: true }">
          <span class="card-title">Songs</span>
          <!-- Icon added here using directives from vue -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="(song, i) in songs" :key="song.docID" :song="song" :index="i" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
// @ is an alias to /src
/* eslint-disable */
import Introduction from "@/components/Introduction.vue";
import { songsCollection, auth } from "@/includes/firebase";
import SongItem from "@/components/SongItem.vue";
import IconSecondary from "@/directives/icon-secondary";

export default {
  name: "Home",
  components: { Introduction, SongItem },
  directives: {
    "icon-secondary": IconSecondary,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 15,
      pendingRequest: false,
    };
  },
  async created() {
    this.getSongs();

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) return;

      this.pendingRequest = true;

      let snapshot;

      if (this.songs.length) {
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get();

        snapshot = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get();
      } else {
        snapshot = await songsCollection
          .orderBy("modified_name")
          .limit(this.maxPerPage)
          .get();
      }

      snapshot.forEach((document) => {
        const song = {
          ...document.data(),
          docID: document.id,
        };

        this.songs.push(song);
      });

      this.pendingRequest = false;
    },
  },
};
</script>
