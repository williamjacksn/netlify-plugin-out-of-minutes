# netlify-plugin-out-of-minutes

Cancel a build early if you don&#x02bc;t have enough build minutes.

## Usage

To install, add the following lines to your `netlify.toml` file:

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
