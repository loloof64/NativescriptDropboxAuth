<template>
  <Page>
    <ActionBar title="Dropbox Auth" />

    <GridLayout columns="*" rows="auto, *">
      <Button
        class="actionButton"
        :text="loginMsg"
        col="0"
        row="0"
        @touch="login"
        v-if="!tokenValid"
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
      <DropboxRootFiles :items="dropboxItems" v-else col="0" row="1" />
    </GridLayout>
  </Page>
</template>

<script>
import DropboxAuth from "@/components/dropbox_auth/DropboxAuth";
import DropboxRootFiles from "@/components/DropBoxRootFiles";
const dayjs = require("dayjs");
const appSettings = require("tns-core-modules/application-settings");
const httpModule = require("tns-core-modules/http");

export default {
  components: {
    DropboxAuth,
    DropboxRootFiles,
  },
  data: function() {
    return {
      loginMsg: "Dropbox auth",
      logoutMsg: "Logout",
      webviewOpen: false,
      dropboxItems: [],
      token: appSettings.getString("accessToken"),
    };
  },
  methods: {
    openWebview: function() {
      this.webviewOpen = true;
    },
    closeWebview: function() {
      this.webviewOpen = false;
    },
    login: function() {
      this.openWebview();
    },
    loadDropboxItems: function() {
      const token = this.token;
      if (!token) return;
      httpModule
        .request({
          url: "https://api.dropboxapi.com/2/files/list_folder",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          content: JSON.stringify({
            path: "",
            recursive: false,
          }),
        })
        .then(
          (response) => {
            try {
              const content = response.content;
              const contentAsJSON = JSON.parse(content);
              const items = contentAsJSON.entries
                .filter((item) => {
                  const isFile = item[".tag"] === "file";
                  const isFolder = item[".tag"] === "folder";

                  const isNotDeleted = isFile || isFolder;
                  return isNotDeleted;
                })
                .map((item) => {
                  const isFolder = item[".tag"] === "folder";

                  const name = item.name;

                  return {
                    isFolder,
                    name,
                  };
                })
                .sort((fst, snd) => {
                  const firstIsFolder = fst.isFolder;
                  const secondIsFolder = snd.isFolder;

                  const firstItemNameLower = fst["name"].toLowerCase();
                  const secondItemNameLower = snd["name"].toLowerCase();

                  if (firstIsFolder !== secondIsFolder) return firstIsFolder ? -1 : 1;
                  return firstItemNameLower.localeCompare(secondItemNameLower);
                });

              this.dropboxItems = items;
            } catch (err) {
              console.error(err);
              alert("Failed to get items from your Dropbox root folder !");
            }
          },
          (err) => {
            console.error(err);
            alert("Failed to get items from your Dropbox root folder !");
          }
        );
    },
    handleTokenReady: function({ token, expirationTimeISO }) {
      this.token = token;
      appSettings.setString("accessToken", token);
      appSettings.setString("expirationTime", expirationTimeISO);
      this.closeWebview();
      this.loadDropboxItems();
    },
    handleAuthError: function({ type, message }) {
      this.closeWebview();
      if (type === "cancelation") {
        alert("Canceled connection.");
      } else if (message) {
        alert("Could not connect to Dropbox ! " + message);
      } else {
        alert("Could not connect to Dropbox !");
      }
    },
    logout: function() {
      const token = appSettings.getString("accessToken");
      httpModule
        .request({
          url: "https://api.dropboxapi.com/2/auth/token/revoke",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(
          (response) => {
            this.token = null;
            appSettings.remove("accessToken");
          },
          (err) => {
            console.error(err);
          }
        );
    },
  },
  computed: {
    tokenValid: function() {
      const token = this.token;
      if (!token) return false;

      const expirationTime = appSettings.getString("expirationTime");
      if (!expirationTime) return false;

      const expirationDate = dayjs(expirationTime);
      const now = dayjs();

      const valid = expirationDate.isAfter(now);
      return valid;
    },
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
