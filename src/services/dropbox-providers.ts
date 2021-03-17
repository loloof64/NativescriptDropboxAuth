import { TnsOaProvider, TnsOaProviderOptions, OpenIdSupportNone, TnsOaUnsafeProviderOptions } from "nativescript-oauth2/providers";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";

export interface TnsOaDropboxProviderOptions extends TnsOaUnsafeProviderOptions { }

export class TnsOaProviderDropboxProvider implements TnsOaProvider {
    public options: TnsOaProviderOptions;
    public openIdSupport: OpenIdSupportNone = "oid-none";
    public providerType = "dropboxProvider";
    public authority = "";
    public tokenEndpointBase = "https://www.dropbox.com";
    public authorizeEndpoint = "/oauth2/authorize";
    public tokenEndpoint = "";
    public cookieDomains = [];

    constructor(options: TnsOaDropboxProviderOptions) {
        this.options = options;
    }

    public parseTokenResult(jsonData): ITnsOAuthTokenResult {
        return jsonData;
    }
}