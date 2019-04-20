import isValidPath from 'is-valid-path'

const whiteListedAttributes = [
  'artist',
  'album',
  'genre',
  'charter',
  'name',
  'year'
]

const bracketRegex = /:(\w+)([\/\W]|$)/g

const fakeObj = {
  artist: 'artistYeah',
  album: 'albumYeah',
  genre: 'genreYeah',
  charter: 'charterYeah',
  name: 'nameYeah',
  year: 'yearYeah'
}

export const replacer = (string, obj) => {
  return string.replace(bracketRegex, (match, p1, p2) => {
    if (!obj[p1]) return p1 + p2
    return obj[p1] + p2
  })
}

export const parseSaveFormat = (formatString, obj=fakeObj) => {

  const returnObj = {
    error: false,
    errorMsgs: []
  }
  let match
  while ((match = bracketRegex.exec(formatString)) !== null) {
    const songField = match[1]
    if (!whiteListedAttributes.includes(songField)) {
      returnObj.error = true,
      returnObj.errorMsgs.push(`${songField} is not a valid field!`)
    }
  }

  const parsedString = replacer(formatString, obj)

  if (!isValidPath(parsedString)) {
    returnObj.error = true
    returnObj.errorMsgs.push('Invalid filepath format!')
  }

  return {
    ...returnObj,
    results: parsedString
  }
}
