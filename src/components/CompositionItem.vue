<template>
  <div class="px-6 py-2">
    <!-- Composition Items -->
    <div class="border border-gray-200 p-3 rounded">
      <div class="flex flex-col sm:flex-row sm:items-center" v-show="!showForm">
        <h4 class="inline-block w-100 sm:w-5/6 text-2xl font-bold">{{ song.modified_name }}</h4>
        <div class="mt-3 sm:mt-0 w-100 sm:w-1/6 flex justify-end">
          <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
            <i class="fa fa-times"></i>
          </button>
          <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
            <i class="fa fa-pencil-alt" @click.prevent="showForm = !showForm"></i>
          </button>
        </div>
      </div>
      <div v-show="showForm">
        <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert" :class="alert_variant">{{ alert_message }}</div>
        <vee-form @submit="updateSongDetails" :validation-schema="editSongSchema">
          <div class="mb-3">
            <label class="inline-block mb-2">Song Title</label>
            <vee-field
              type="text"
              name="modified_name"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
              placeholder="Enter Song Title"
              :value="song.modified_name"
            />
            <ErrorMessage class="text-red-600" name="songTitle" />
          </div>
          <div class="mb-3">
            <label class="inline-block mb-2">Genre</label>
            <vee-field
              type="text"
              name="genre"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
              placeholder="Enter Genre"
              :value="song.genre"
            />
            <ErrorMessage class="text-red-600" name="genre" />
          </div>
          <button type="submit" class="py-1.5 px-3 mr-2 rounded text-white bg-green-600" :disabled="in_submission">
            Submit
          </button>
          <button
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            :disabled="in_submission"
            @click.prevent="showForm = !showForm"
          >
            Go Back
          </button>
        </vee-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { songsCollection } from "../includes/firebase";

export default {
  name: "CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
      editSongSchema: {
        modified_name: "required|min:4|max:60",
        genre: "required|min:3|max:30|alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Please wait! Updating song info.",
    };
  },
  methods: {
    async updateSongDetails(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "Please wait! Updating song info.";

      try {
        await songsCollection.doc(this.song.docID).update({
          modified_name: values.modified_name,
          genre: values.genre,
        });
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "Something went wrong. Try again later.";

        return;
      }

      this.updateSong(this.index, {
        modified_name: values.modified_name,
        genre: values.genre,
      });

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "Success! You have edited the song details.";
    },
  },
};
</script>
