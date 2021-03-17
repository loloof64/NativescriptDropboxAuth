import {
  TnsOAuthClient,
  configureTnsOAuth,
  ITnsOAuthTokenResult,
} from "nativescript-oauth2";
import { TnsOaProvider } from "nativescript-oauth2/providers";
import {
  TnsOaDropboxProviderOptions,
  TnsOaProviderDropboxProvider,
} from "./dropbox-providers";
import dropboxSecrets from './dropbox-secrets.json';

let client: TnsOAuthClient = null;

export function configureOAuthProviders() {
  const dropboxProvider = configureOAuthProviderDropboxProvider();
  configureTnsOAuth([dropboxProvider]);
}

function configureOAuthProviderDropboxProvider(): TnsOaProvider {
  const dropboxProviderOptions: TnsOaDropboxProviderOptions = {
    openIdSupport: "oid-none",
    clientId: dropboxSecrets.clientId,
    clientSecret: dropboxSecrets.clientSecret,
    redirectUri: dropboxSecrets.redirectUri,
    scopes: dropboxSecrets.scopes,
  };
  const dropboxProvider = new TnsOaProviderDropboxProvider(
    dropboxProviderOptions
  );
  return dropboxProvider;
}

export function tnsOauthLogin(providerType) {
  client = new TnsOAuthClient(providerType);

  client.loginWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
    if (error) {
      console.error("back to main page with error: ");
      console.error(error);
    } else {
      console.log("back to main page with access token: ");
      console.log(tokenResult);
    }
  });
}

export function tnsOauthLogout() {
  if (client) {
    client.logout();
  }
}
