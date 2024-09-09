# uwaterloo exchange program filtering tool

a very rough node script to filter [uwaterloo passport](https://uwaterloo-horizons.symplicity.com/) exchange schools and return summary info.

last updated: 09/2024

## Usage

```cmd
node index.js [flags...]
```

Run `npm ci` to install dependencies.

Flags:
- `-t term` - Fall/Winter/Spring, not case sensitive
- `-f faculty_code` - specify faculty; see [here](./data.js#L28-L34) for faculty codes. Multiple can be specified, i.e. `-f 3 -f 7`
- `-d dest_code` - specify destination; see [here](./data.js#L41-L75) for destination codes. e.g. `-d VN`
- `--louder` - prints any filtered-out programs and their reasoning. defaults to false
- `--courses` - roughly grabs course info for each program as listed on UW Passport

By default, `node index.js` filters for winter term exchanges for the math faculty.
This can be configured, as follows.

### Configuring filters

[data.js](./data.js) configures some filters:
- [`exclude_dest`](./data.js#L1) - destination keywords to exclude as strings, e.g. `France` (not the country codes).
- [`startMonths`/`endMonths`](./data.js#L15-L22) - to check for semester alignment, the listed months are to be included as the start/end month respectively in the program listing. Update or remove these lines as desired.
- [`DEFAULT_PARAMS`](./data.js#L3-L8) - configure the default parameters used by the script


## Sample truncated output
```
[...]
{
  p_name: 'The University of Hong Kong Exchange Program',
  url: 'https://uwaterloo-horizons.symplicity.com/index.php?s=programs&mode=form&id=3f1e30188789cf0a886e68d7a200807c',
  city: 'Hong Kong, Hong Kong SAR China',
  inst_name: 'University of Hong Kong (HKU)',
  language: '',
  months: 'January to May',
  accomodation: 'University managed accommodation is available but not guaranteed. Off campus housing is also available.',
  competitiveness: 'Likeliness - Low - Approximately  20 spots available'
}
total: 9
cities: Hong Kong, Hong Kong SAR China; [...]
```
