# Dropbox Auth

> Access your Dropbox account from your device.

## Developers

### Dropbox settings

1. You need to register the application on your Dropbox developer console.
2. You need to create a file `src/services/dropbox-secrets.json`:

```
{
    "clientId": "<CLIENT-ID>",
    "clientSecret": "<CLIENT-SECRET>",
    "redirectUri": "<REDIRECT-URI>",
    "scopes": <SCOPES-ARRAY>
}
```