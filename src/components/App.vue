<template>
  <Page
    navigatingTo="onNavigatingTo" 
  >
    <ActionBar title="Dropbox Auth" />
    <GridLayout columns="*" rows="*, *">
      <Button class="message" :text="loginMsg" col="0" row="0" @touch="login" />
      <Button
        class="message"
        :text="logoutMsg"
        col="0"
        row="1"
        @touch="logout"
      />
      <WebView
        col="0"
        row="0"
        rowSpan="2"
        v-if="webviewOpen"
        class="webview"
        @loadStarted="onNavigatingTo"
        @loadFinished="onNavigatingTo"
        :src="dropboxAuthUrl"
      />
    </GridLayout>
  </Page>
</template>

<script>
import { ref } from "@vue/composition-api";
import dropboxSecrets from "@/services/dropbox-secrets.json";
export default {
  setup() {
    const loginMsg = ref("Dropbox auth");
    const logoutMsg = ref("Logout");
    const webviewOpen = ref(false);

    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxSecrets.clientId}&token_access_type=offline&response_type=code`;

    const openWebview = function() {
      webviewOpen.value = true;
    };

    const onNavigatingTo = function(args) {
      const page = args.object;
      console.log('Got page: '+page);
    };

    const login = function() {
      openWebview();
    };

    const logout = function() {};

    return { loginMsg, logoutMsg, login, logout, webviewOpen, dropboxAuthUrl, onNavigatingTo };
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}

.webview {
  z-index: 10;
}
</style>
