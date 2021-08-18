import { convertCSVToArray } from 'convert-csv-to-array'
import axios from 'axios'

const googleSheetEndPoint =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXOroQL8JzGIPGcHnvh4RRD9bP42pKeHmUTM8--BgF9zBQWvGpnr2fIUg-Xqxtq0aEsjI9U4enZdQ0/pub?output=csv'

export const generateObjectFromCSV = async () => {
  const { data } = await axios.get(googleSheetEndPoint)

  const arrayData = convertCSVToArray(data, {
    type: 'array',
    separator: '',
  }).slice(1)

  const objectData = arrayData.map((e) => {
    return {
      type: e[0],
      khmer: e[1],
      english: e[2],
      province_code: Math.floor(e[3] / 10) !== 0 ? `${e[3]}` : `0${e[3]}`,
      district_code: null,
      commune_code: null,
      village_code: null,
      lat: e[7],
      lon: e[8],
      body: e[9],
    }
  })

  return objectData
}
