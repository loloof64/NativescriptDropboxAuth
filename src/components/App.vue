<template>
  <Page>
    <ActionBar title="Dropbox Auth" />

    <GridLayout columns="*" rows="*, *">
      <Button
        class="actionButton"
        :text="loginMsg"
        col="0"
        row="0"
        @touch="login"
        v-if="!isTokenValid"
      />
      <Button
        v-else
        class="actionButton"
        :text="logoutMsg"
        col="0"
        row="0"
        @touch="logout"
      />
      <Frame col="0" row="0" rowSpan="2" class="dropboxAuth" v-if="webviewOpen">
        <DropboxAuth @tokenReady="handleTokenReady" @error="handleAuthError" />
      </Frame>
    </GridLayout>
  </Page>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import DropboxAuth from "@/components/dropbox_auth/DropboxAuth";
const dayjs = require("dayjs");
const appSettings = require("tns-core-modules/application-settings");
const httpModule = require("tns-core-modules/http");
const frameModule = require("ui/frame");

export default {
  components: {
    DropboxAuth,
  },
  setup() {
    const loginMsg = ref("Dropbox auth");
    const logoutMsg = ref("Logout");
    const webviewOpen = ref(false);

    const isTokenValid = computed(() => {
      const token = appSettings.getString("accessToken");
      if (!token) return false;

      const expirationTime = appSettings.getString("expirationTime");
      if (!expirationTime) return false;

      const expirationDate = dayjs(expirationTime);
      const now = dayjs();

      const valid = expirationDate.isAfter(now);
      return valid;
    });

    const openWebview = function() {
      webviewOpen.value = true;
    };

    const closeWebview = function() {
      webviewOpen.value = false;
    };

    const login = function() {
      openWebview();
    };

    const forcePageRefresh = function() {
      frameModule.reloadPage();
    };

    const handleTokenReady = function({ token, expirationTimeISO }) {
      appSettings.setString("accessToken", token);
      appSettings.setString("expirationTime", expirationTimeISO);
      closeWebview();
      forcePageRefresh();
    };

    const handleAuthError = function({type, message}) {
      closeWebview();
      if (type === 'cancelation') {
        alert("Canceled connection.");
      }
      else if (message) {
        alert("Could not connect to Dropbox ! "+message);
      }
      else {
        alert("Could not connect to Dropbox !");
      }
    };

    const logout = function() {
      const token = appSettings.getString("accessToken");
      httpModule
        .request({
          url: "https://api.dropboxapi.com/2/auth/token/revoke",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(
          (resp) => {
            appSettings.remove("accessToken");
            forcePageRefresh();
          },
          (err) => {}
        );
    };

    return {
      loginMsg,
      logoutMsg,
      login,
      logout,
      webviewOpen,
      handleTokenReady,
      handleAuthError,
      isTokenValid,
    };
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.actionButton {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}

.dropboxAuth {
  z-index: 10;
}
</style>
