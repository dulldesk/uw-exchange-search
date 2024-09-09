# uwaterloo exchange program filtering tool

a very rough node script to filter [uwaterloo passport](https://uwaterloo-horizons.symplicity.com/) exchange schools and return summary info.

last updated: 09/2024

## Usage

```cmd
node index.js [flags...]
```

Flags:
- `-t term` - Fall/Winter/Spring, not case sensitive
- `-f faculty_code` - specify faculty; see [here] for faculty codes. Multiple can be specified, i.e. `-f 3 -f 7`
- `-d dest_code` - specify destination; see [here] for destination codes. e.g. `-d VN`
- `--louder` - prints any filtered-out programs and their reasoning. defaults to false
- `--courses` - roughly grabs course info for each program as listed on UW Passport

By default, `node index.js` filters for winter term exchanges for the math faculty.
This can be configured, as follows.

### Configuring filters

[data.js](./data.js) configures some filters:
- [`exclude_dest`]() - destination keywords to exclude as strings, e.g. `France` (not the country codes).
- [`startMonths`/`endMonths`]() - to check for semester alignment, the listed months are to be included as the start/end month respectively in the program listing. Update or remove these lines as desired.
- [`DEFAULT_PARAMS`]() - configure the default parameters used by the script


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
