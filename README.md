# netlify-plugin-out-of-minutes

Cancel a build early if you don&#x02bc;t have enough build minutes.

## Usage

In your Netlify user settings, create a [personal access token][a]. Set a site or team environment variable with the
name `NETLIFY_AUTH_TOKEN`. Set the value to the personal access token you created.

[a]: https://app.netlify.com/user/applications#personal-access-tokens

> :warning: Security Warning :warning:
>
> Watch out! If you set this environment variable, any other build plugins you include in your project will be able to
> read your personal access token and will be able to interact with Netlify on your behalf.

![Netlify environment variable][b]

[b]: netlify-environment-variable.jpg

Add the following lines to your `netlify.toml` file:

```toml
[[plugins]]
package = "netlify-plugin-out-of-minutes"

# All inputs are optional
[plugins.inputs]

# The number of available build minutes needed to complete a build.
# If you don't have at least this many build minutes available, the
# build will fail. If you do not specify this input, the default is 5.
buildMinutesRequired = 5

# Instead of looking up the actual value of minutes used for your team,
# use this value. Useful for testing or to force a build to either fail
# or succeed.
overrideMinutesUsed = 0
```
