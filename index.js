import puppeteer from "puppeteer"
import chalk from 'chalk';
import { parseArgs } from "node:util"
import { DEFAULT_PARAMS, QUERY_OPTIONS, filters } from "./data.js"

const ROOT = 'https://uwaterloo-horizons.symplicity.com/index.php'
const START = `${ROOT}?s=programs`

const toTitleCase = s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();

async function setupForm(page, params) {
  let type = QUERY_OPTIONS.Type.Exchange

  // show more
  await Promise.all([
    page.waitForNavigation(),
    page.select('[id^=showing]', '250')
  ]);
  await page.waitForSelector("table.filters")

  // form elements
  await Promise.all([
    ...params.faculty.map(f => page.click(`#so_formfield_dnf_class_values_program__faculty___ #dnf_class_values_program__faculty___${f}_check`)),
    page.select('#dnf_class_values_program__type_', type),
    params.destination ? page.select('#dnf_class_values_program__country_', params.destination) : Promise.resolve(),
  ])

  // submit
  await Promise.all([
    page.click("input.btn_search_nav6up"),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector("#lst_index_phpprogram")
}

async function getInitialData(page, term) {
  return await page.evaluate((term) => {
    const rows = document.querySelectorAll("#lst_index_phpprogram tbody > tr[id^=row]");

    return Array.from(rows)
      .filter(r =>
        r.querySelector('td.lst-cl-_term_list > div').className.includes(term)
        // && !exclude_dest.some(d => r.querySelector('.lst-cl-p_name i').textContent.includes(d))
      )
      .map(r => {
        let obj = {}
        obj.p_name    = r.querySelector('.lst-cl-p_name strong').textContent
        obj.url       = r.querySelector('.lst-cl-p_name a').href
        obj.city      = r.querySelector('.lst-cl-p_name i').textContent
        obj.inst_name = r.querySelector('.lst-cl-inst_name').textContent
        // obj.term_list = r.querySelector('.lst-cl-_term_list > div').className
        obj.language  = r.querySelector('.lst-cl-language').textContent
        // return Object.fromEntries(Array.from(r.children).map(i => [i.classList[1], i.textContent]))
        return obj
      })
  }, term.toLowerCase());
}

async function getFurtherInfo(page, term, params) {
  return await page.evaluate(({term, params, filters}) => {
    const errors = []
    const dest = document.querySelector('.program__top_detail .pfield.summary:last-child').textContent.replace('(Map)','').trim()
    if (filters?.exclude?.dest?.some(d => dest.includes(d))) {
      errors.push(`location: ${dest}`)
    }

    const dates = Array.from(document.querySelectorAll('#so_formfield_dnf_class_values_program__dates_ table tr'))
      .find(r => r.querySelector('td:last-child > span') && r.querySelector('td:last-child > span').textContent == term)

    if (!dates) return null

    let data = {}

    try {
      const months = dates.children[1].textContent.trim()
      const monthsSplit = months.split(/ ?- ?| to /)
      if (filters?.include[term.toLowerCase()] && (
        (filters?.include[term.toLowerCase()].endMonths && !(filters.include[term.toLowerCase()].endMonths.some(m => monthsSplit[1].includes(m)))) ||
        (filters?.include[term.toLowerCase()].startMonths && !(filters.include[term.toLowerCase()].startMonths.some(m => monthsSplit[0].includes(m))))
      )) {
        // out of range
        errors.push(`months: ${months}`)
      }
      data.months = months
    } catch (e) {return null}

    if (errors.length) return { errors }

    // const accomodation_url = document.querySelector('#so_formfield_dnf_class_values_program__housing_ #dnf_class_values_program__housing__widget a').href
    data.accomodation = document.querySelector('#so_formfield_dnf_class_values_program__housing_ #dnf_class_values_program__housing__widget p')?.textContent
    data.competitiveness = document.querySelector('#dnf_class_values_program__gen_instructions__widget')?.textContent?.trim()
    if (params.courses) data.courses = document.querySelector('#so_formfield_dnf_class_values_program__academic_information_ .widgetcol')?.textContent?.trim()
    return data
  }, {term, params, filters})
}

const runScript = async (params) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  /*
  page.on('console', (msg) => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });
  */

  await page.goto(START, {
    waitUntil: "domcontentloaded",
  });

  await setupForm(page, params)

  const TERM = toTitleCase(params.term)

  // total # results
  // console.log(await page.evaluate(() => document.querySelector('.ListHeadResultInfo').textContent.trim()));

  // data
  const initial_data = await getInitialData(page, TERM)

  let count = 0;
  let cities = new Set();

  for (let inst of initial_data) {
    await Promise.all([
      page.waitForNavigation(),
      page.goto(inst.url),
    ])
    await page.waitForSelector('#so_formfield_dnf_class_values_program__gen_instructions_')

    const info = await getFurtherInfo(page, TERM, params)
    if (info) {
      // errors
      if (info.errors) {
        if (!params.louder) continue
        console.log(chalk.red(`no ${inst.p_name}`))
        info.errors.forEach((e) => {
          console.log(chalk.red(` - ${e}`))
        })
      } else {
        // accepted
        console.log({
          ...inst,
          ...info
        })
        count++
        cities.add(inst.city)
      }
    }
  }

  await browser.close();

  console.log(`total: ${count}`)
  console.log(`cities: ${new Array(...cities).sort((a,b) => a.split(',')[1].trim().localeCompare(b.split(',')[1].trim())).join('; ')}`)
};

const { values } = parseArgs({
  options: {
    faculty: {
      type: 'string',
      short: 'f',
      multiple: true,
      default: DEFAULT_PARAMS.faculty
    },
    destination: {
      type: 'string',
      short: 'd',
    },
    term: {
      type: 'string',
      short: 't',
      default: DEFAULT_PARAMS.term
    },
    louder: {
      type: 'boolean',
      default: DEFAULT_PARAMS.louder
    },
    courses: {
      type: 'boolean',
      default: DEFAULT_PARAMS.courses
    },
  }
})

runScript(values);
