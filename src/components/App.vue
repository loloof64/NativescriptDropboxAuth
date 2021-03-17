<template>
  <Page>
    <ActionBar title="Welcome to NativeScript-Vue!" />
    <GridLayout columns="*" rows="*, *">
      <Button class="message" :text="loginMsg" col="0" row="0" @touch="login" />
      <Button
        class="message"
        :text="logoutMsg"
        col="0"
        row="1"
        @touch="logout"
      />
    </GridLayout>
  </Page>
</template>

<script>
import { ref } from "@vue/composition-api";
import { tnsOauthLogin, tnsOauthLogout } from "@/services/auth-service";
export default {
  setup() {
    const loginMsg = ref("Dropbox auth");
    const logoutMsg = ref("Logout");
    const login = function() {
      tnsOauthLogin("dropboxProvider");
    };
    const logout = function() {
      tnsOauthLogout();
    };
    return { loginMsg, logoutMsg, login, logout };
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
</style>
