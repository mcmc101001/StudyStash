import { defineConfig } from "cypress";
require("dotenv").config();
const { GoogleSocialLogin } = require("cypress-social-logins").plugins;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        GoogleSocialLogin: GoogleSocialLogin,
      });
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
  },
});
