<template>
  <Introduction />
  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <SongItem v-for="(song, i) in songs" :key="song.docID" :song="song" :index="i" />
        <li
          class="flex justify-between items-center p-3 pl-6 cursor-pointer
        transition duration-300 hover:bg-gray-50"
        >
          <div>
            <a href="#" class="font-bold block text-gray-600">Song Title</a>
            <span class="text-gray-500 text-sm">Artist Name</span>
          </div>

          <div class="text-gray-600 text-lg">
            <span class="comments">
              <i class="fa fa-comments text-gray-600"></i>
              15
            </span>
          </div>
        </li>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
/* eslint-disable */
import Introduction from "@/components/Introduction.vue";
import { songsCollection, auth } from "@/includes/firebase";
import SongItem from "@/components/SongItem.vue";

export default {
  name: "Home",
  components: { Introduction, SongItem },
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
