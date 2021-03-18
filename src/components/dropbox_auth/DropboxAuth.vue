<template>
  <Page actionBarHidden="true">
    <GridLayout cols="*" rows="*">
      <WebView
        id="oauth-webview"
        col="0"
        row="0"
        :src="dropboxAuthUrl"
        @loadStarted="loadStarted"
      />
    </GridLayout>
  </Page>
</template>

<script>
import dropboxSecrets from "./dropbox-secrets.json";
export default {
  setup(props, ctx) {
    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxSecrets.clientId}&response_type=token&redirect_uri=${dropboxSecrets.redirectUri}`;

    const getValuesFromUrl = function(url, argsBoundary = "?") {
      if (!url.includes(argsBoundary)) return {};
      let argsPart = url.substring(url.indexOf(argsBoundary) + 1);
      let argsStrings = argsPart.split("&");
      const values = argsStrings.reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value;
        return acc;
      }, {});
      return values;
    };

    const loadStarted = function(args) {
      if (args.error) console.error("Error !!! " + args.error);
      else {
        const currentUrl = args.url;
        if (currentUrl.startsWith(dropboxSecrets.redirectUri)) {
          const values = getValuesFromUrl(currentUrl, "#");

          ///////////////////////////
          // console.log(values);
          /////////////////////////////

          const token = values["access_token"];
          ctx.emit('tokenReady', token);
        }
      }
    };

    return { dropboxAuthUrl, loadStarted };
  },
};
</script>

<style scoped></style>
