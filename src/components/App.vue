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
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import DropboxAuth from "@/components/dropbox_auth/DropboxAuth";
import DropboxRootFiles from "@/components/DropBoxRootFiles";
const dayjs = require("dayjs");
import { Http, ApplicationSettings } from "@nativescript/core";

export default {
  components: {
    DropboxAuth,
    DropboxRootFiles,
  },
  setup() {
    const loginMsg = "Dropbox auth";
    const logoutMsg = "Logout";
    const webviewOpen = ref(false);
    const dropboxItems = ref(reactive([]));
    const token = ref(ApplicationSettings.getString("accesToken"));

    const loadDropBoxItems = function () {
      const currentToken = token.value;
      if (!currentToken) return;
      Http.request({
        url: "https://api.dropboxapi.com/2/files/list_folder",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        content: JSON.stringify({
          path: "",
          recursive: false,
        }),
      }).then(
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

                if (firstIsFolder !== secondIsFolder)
                  return firstIsFolder ? -1 : 1;
                return firstItemNameLower.localeCompare(secondItemNameLower);
              });

            dropboxItems.value = items;
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
    };

    const openWebview = function () {
      webviewOpen.value = true;
    };
    const closeWebview = function () {
      webviewOpen.value = false;
    };
    const login = function () {
      openWebview();
    };

    const handleTokenReady = function ({ newToken, expirationTimeISO }) {
      token.value = newToken;
      ApplicationSettings.setString("accessToken", newToken);
      ApplicationSettings.setString("expirationTime", expirationTimeISO);
      closeWebview();
      loadDropBoxItems();
    };

    const handleAuthError = function ({ type, message }) {
      closeWebview();
      if (type === "cancelation") {
        alert("Canceled connection.");
      } else if (message) {
        alert("Could not connect to Dropbox ! " + message);
      } else {
        alert("Could not connect to Dropbox !");
      }
    };

    async function logout() {
      const storedToken = ApplicationSettings.getString("accessToken");
      try {
        await Http.request({
          url: "https://api.dropboxapi.com/2/auth/token/revoke",
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        token.value = null;
        dropboxItems.value = [];
        ApplicationSettings.remove("accessToken");
      } catch (err) {
        console.error(err);
      }
    }

    const tokenValid = computed(() => {
      const currentToken = token.value;
      if (!currentToken) return false;

      const expirationTime = ApplicationSettings.getString("expirationTime");
      if (!expirationTime) return false;

      const expirationDate = dayjs(expirationTime);
      const now = dayjs();

      const valid = expirationDate.isAfter(now);
      return valid;
    });

    onMounted(() => loadDropBoxItems());

    return {
      loginMsg,
      logoutMsg,
      webviewOpen,
      dropboxItems,
      token,
      login,
      logout,
      tokenValid,
      handleTokenReady,
      handleAuthError,
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
