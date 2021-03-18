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
        v-if="isTokenValid"
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
      if (! expirationTime) return false;

      const expirationDate = dayjs(expirationTime);
      const now = dayjs();

      return expirationDate.isAfter(now);
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

    const handleTokenReady = function({token, expirationTimeISO}) {
      appSettings.setString("accessToken", token);
      appSettings.setString("expirationTime", expirationTimeISO);
      closeWebview();
    };

    const handleAuthError = function(error) {
      console.error(error);
      closeWebview();
      alert('Could not connect to Dropbox !');
    }

    const logout = function() {};

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
