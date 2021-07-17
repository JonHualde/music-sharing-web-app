/* eslint-disable */
import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import {
  required,
  min,
  max,
  email,
  confirmed,
  min_value as minVal,
  max_value as maxVal,
  alpha_spaces as alphaSpaces,
  not_one_of as excluded,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", Form);
    app.component("VeeField", Field);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("email", email);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("passwords_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);

    configure({
      generateMessage: (context) => {
        const messages = {
          required: `The field ${context.field} is required.`,
          min: `The field ${context.field} is too short.`,
          max: `The field ${context.field} is too long.`,
          email: `The field ${context.field} must be a valid email.`,
          alpha_spaces: `The field ${context.field} may only contain alphabetical characters and spaces.`,
          max_value: `The field ${context.field} is too high.`,
          min_value: `The field ${context.field} is too low.`,
          excluded: `You are not allowed to use this value for ${context.field}.`,
          country_excluded: `Due to restrictions, we do not accept users from this destination.`,
          passwords_mismatch: `The passwords do not match.`,
          tos: `You must accept the Terms of service.`,
        };

        const message = messages[context.rule.name] ? messages[context.rule.name] : `The field ${context.field} is invalid.`;

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
