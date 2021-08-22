<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments (15)</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert" :class="comment_alert_variant">
          {{ comment_alert_message }}
        </div>
        <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
          <vee-field
            as="textarea"
            class="block w-full pt-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
            name="songComment"
          ></vee-field>
          <ErrorMessage class="text-red-600 mb-2" name="songComment" />
          <button type="submit" class="mt-3 py-1.5 px-3 rounded text-white bg-green-600 block" :disabled="comment_in_submission">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          v-model="sort"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <ul class="container mx-auto">
          <li v-for="comment in sortedComments" :key="comment.docID" class="p-6 bg-gray-50 border border-gray-200">
            <!-- Comment Author -->
            <div class="mb-5">
              <div class="font-bold">{{ comment.userName }}</div>
              <time>{{ comment.datePosted }}</time>
            </div>

            <p>
              {{ comment.content }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import { mapState } from "vuex";

export default {
  name: "Song",
  data() {
    return {
      song: {},
      comments: [],
      sort: "1",
      schema: {
        songComment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait, your comment is being submitted...",
    };
  },
  computed: {
    ...mapState(["userLoggedIn"]),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        // Latest to oldest
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        // Oldest to latest
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapshot.exists) {
      this.$router.push({ name: "home" });
      return;
    }

    this.song = docSnapshot.data();
    this.getComments();
  },
  methods: {
    async addComment(values, context) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_message = "Please wait, your comment is being submitted...";

      const comment = {
        content: values.songComment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        userName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_message = "Your comment has been submitted!";

      context.resetForm();

      this.getComments();
    },
    async getComments() {
      const snapshots = await commentsCollection.where("songId", "==", this.$route.params.id).get();
      console.log("snapshots: ", snapshots);

      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sort(newVal) {
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>

<style></style>
