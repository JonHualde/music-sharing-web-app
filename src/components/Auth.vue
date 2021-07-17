<template>
  <!-- Auth Modal -->
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="{ hidden: !authModalShown }">
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
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold ">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50">
              <i class="fas fa-times" @click.prevent="toggleAuthModal"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center" @click.prevent="tab = 'login'">
              <a
                class="block rounded py-3 px-4 transition  "
                href="#"
                :class="{ 'bg-blue-600 text-white hover:text-white': tab === 'login', 'hover:text-blue-600': tab === 'register' }"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center" @click.prevent="tab = 'register'">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                :class="{ 'bg-blue-600 text-white hover:text-white': tab === 'register', 'hover:text-blue-600': tab === 'login' }"
                >Register</a
              >
            </li>
          </ul>
          <AppLogInForm v-if="tab === 'login'" />
          <AppRegisterForm v-if="tab === 'register'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import AppLogInForm from "./LogInForm.vue";
import AppRegisterForm from "./RegisterForm.vue";

export default {
  components: { AppLogInForm, AppRegisterForm },
  name: "Auth",
  data() {
    return {
      tab: "login",
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:110",
        password: "required|min:6|max:60",
        confirm_password: "passwords_mismatch:@password|required|min:6|max:40",
        country: "required|country_excluded:Antartica",
        tos: "tos",
      },
      logInSchema: {
        email: "required|min:3|max:100|email",
        password: "required|min:6|max:60",
      },
      userData: {
        country: "USA",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "Please wait, your account is being created..",
      log_in_submission: false,
      log_show_alert: false,
      log_alert_variant: "bg-blue-500",
      log_alert_msg: "We are logging you in, please wait..",
    };
  },
  computed: {
    // authModalShow() {
    //   return this.$store.getters.authModalShow;
    // },
    // -------------------- GETTERS --------------------
    // Better for performing a calculation on a state property
    // ...mapGetters(["authModalShow", "showLogInForm", "showRegistrationForm"]),
    // -------------------- STATES --------------------
    // Better for retrieving a state property
    ...mapState(["authModalShown"]),
    // -------------------- STATES with ALIASES --------------------
    // ...mapState({ modal: "authModalShow" }),
  },
  methods: {
    ...mapMutations(["toggleAuthModal", "toggleLogIn", "toggleRegistration"]),
    register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-blue-500";
      this.reg_alert_msg = "Please wait, your account is being created..";

      this.reg_alert_variant = "bg-green-500";
      this.reg_alert_msg = "Success! Your account has been created.";
      console.log(values);
    },
    logIn(values) {
      this.log_show_alert = true;
      this.log_in_submission = true;
      this.log_alert_variant = "bg-blue-500";
      this.log_alert_msg = "We are logging you in, please wait";

      this.log_alert_variant = "bg-green-500";
      this.log_alert_msg = "Success! You are now logged in.";

      console.log(values);
    },
  },
};
</script>

<style></style>
