<template>
  <div class="px-6 py-2">
    <!-- Composition Items -->
    <div class="border border-gray-200 p-3 rounded">
      <div class="flex flex-col sm:flex-row sm:items-center" v-show="!showForm">
        <h4 class="inline-block w-100 sm:w-5/6 text-2xl font-bold">{{ song.modified_name }}</h4>
        <div class="mt-3 sm:mt-0 w-100 sm:w-1/6 flex flex-row-reverse">
          <button
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
            v-on:click.prevent="showWarningModal = !showWarningModal"
          >
            <i class="fa fa-times"></i>
          </button>
          <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right" @click.prevent="showForm = !showForm">
            <i class="fa fa-pencil-alt"></i>
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
              @input="updateUnsavedFlag(true)"
            />
            <ErrorMessage class="text-red-600" name="modified_name" />
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
              @input="updateUnsavedFlag(true)"
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
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="{ hidden: !showWarningModal }">
    <div
      class="flex items-end justify-center min-h-screenpt-4
    px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
        shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <div class="flex flex-col justify-between items-center pb-4">
            <h4 class="text-2xl font-bold mb-3">Warning &#x26A0;</h4>
            <p>You're going to delete this song permanently, there is no way of to recover it.</p>
          </div>
          <div class="text-white text-center font-bold p-4 mb-4 rounded-sm" v-if="deleting" :class="deleting_variant">
            {{ deleting_message }}
          </div>
          <div class="flex flex-col justify-between items-center pb-4" v-else>
            <p>Delete this song permanently?</p>
            <div class="flex justify-between items-center pb-4">
              <button class="px-4 py-2 mt-3 mx-2 rounded-lg text-white bg-green-500 hover:bg-green-400" @click.prevent="deleteSong">
                Yes <i class="fa fa-check"></i>
              </button>
              <button v-on:click.prevent="closeModal" class="px-4 py-2 mt-3 mx-2 rounded-lg text-white bg-red-500 hover:bg-red-600">
                No <i class="fa fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { songsCollection, storage } from "../includes/firebase";

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
    deleteExistingSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      editSongSchema: {
        modified_name: "required|min:4|max:60",
        genre: "required|min:3|max:60|alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Please wait! Updating song info.",
      showWarningModal: false,
      deleting: false,
      deleting_variant: "bg-yellow-500",
      deleting_message: "Deleting your song...",
    };
  },
  methods: {
    closeModal() {
      this.deleting = false;
      this.showWarningModal = false;
    },
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
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "Success! You have edited the song details.";

      setTimeout(() => {
        this.showForm = false;
      }, 1500);
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      try {
        this.deleting = true;
        this.deleting_variant = "bg-yellow-500";
        this.deleting_message = "Deleting your song...";

        await songRef.delete();
        await songsCollection.doc(this.song.docID).delete();
      } catch (error) {
        this.deleting_variant = "bg-red-500";
        this.deleting_message = "There has been an issue while deleting your song. Please reload the page and retry.";

        return;
      }

      this.deleting_variant = "bg-green-500";
      this.deleting_message = "The song has been successfully deleted!";

      setTimeout(() => {
        this.showWarningModal = false;
        this.deleting = false;
        this.deleteExistingSong(this.index);
      }, 1200);
    },
  },
};
</script>
