/*
 * Simple Context (v2.0.0-alpha)
 */

// Preset data that can be loaded at the start of an adventure
const SC_DEFAULT_DATA = {
  note: "",
  title: "",
  author: "",
  genre: "",
  setting: "",
  theme: "",
  subject: "",
  style: "",
  rating: "",
  you: "",
  at: "",
  with: "",
  scene: "",
  think: "",
  focus: ""
}

// HUD and UI labels and colors
const SC_LABEL = {
  // HUD
  TRACK: " ",
  NOTES: "✒️",
  POV: "🕹️",
  SCENE: "🎬",
  THINK: "💭",
  FOCUS: "🧠",

  // Entry UI
  LABEL: "🏷️",
  KEYS: "🔍",
  MAIN: "📑",
  SEEN: "👁️",
  HEARD: "🔉",
  TOPIC: "💬",

  // Relationship UI
  PARENTS: "🤱",
  CHILDREN: "🧸",
  KNOWN: "👋",

  // Relationship Disposition UI: 1-5
  HATE: "🖤",
  DISLIKE: "🤎",
  NEUTRAL: "💛",
  LIKE: "🧡",
  LOVE: "❤️",

  // Relationship Type UI: CAFE
  CONTACT: "👋",
  ALLY: "🤝",
  FRIEND: "🙌",
  ENEMY: "🤬",

  // Relationship Trait UI: SIX
  SPOUSE: "💍",
  INTIMATE: "✨",
  EX: "💔",

  // Pronoun UI
  YOU: "🎭",
  HER: "👩",
  HIM: "🧔",
  UNKNOWN: "🔰",

  // General UI
  CONFIRM: "✔️",
  ERROR: "💥",
  SEPARATOR: " ∙ ",
  SELECTED: "🔅 "
}
const SC_COLOR = {
  // HUD
  TRACK: "chocolate",
  NOTES: "dimgrey",
  POV: "slategrey",
  SCENE: "steelblue",
  THINK: "seagreen",
  FOCUS: "indianred",

  // Relationship UI
  PARENTS: "seagreen",
  CHILDREN: "steelblue",
  KNOWN: "slategrey",

  // Entry UI
  LABEL: "indianred",
  KEYS: "seagreen",
  MAIN: "steelblue",
  SEEN: "slategrey",
  HEARD: "slategrey",
  TOPIC: "slategrey"
}

/*
 * DO NOT EDIT PAST THIS POINT
 */
const SC_SECTION = { FOCUS: "focus", THINK: "think", SCENE: "scene", POV: "pov", NOTES: "notes" }
const SC_SECTION_SIZES = { FOCUS: 150, THINK: 500, SCENE: 1000 }
const SC_CMD = { BACK: "<", BACK_ALL: "<<", SKIP: ">", SKIP_ALL: ">>", CANCEL: "!", DELETE: "^", HINTS: "?" }
const SC_PRONOUN = { YOU: "YOU", HIM: "HIM", HER: "HER", UNKNOWN: "UNKNOWN" }
const SC_DATA = { MAIN: "main", SEEN: "seen", HEARD: "heard", TOPIC: "topic", PARENTS: "parents", CHILDREN: "children", CONTACTS: "contacts" }

/* Relationship disposition, modifier and type

  DISPOSITION
  1 hate
  2 dislike
  3 neutral
  4 like
  5 love

  MODIFIER
  x ex

  TYPE
  F friends/extended family
  L lovers
  A allies
  M married
  E enemies

  [1-5] x FLAME

  eg: Jill [1] Jack [4F], Mary [2xL], John [3A]

 */
const SC_REL_DISP = { HATE: 1, DISLIKE: 2, NEUTRAL: 3, LIKE: 4, LOVE: 5 }
const SC_REL_MOD = { EX: "x" }
const SC_REL_TYPE = { FRIENDS: "F", LOVERS: "L", ALLIES: "A", MARRIED: "M", ENEMIES: "E" }
const SC_REL_SCOPE = { PARENTS: "parents", CHILDREN: "children", SIBLINGS: "siblings", GRANDPARENTS: "grandparents", GRANDCHILDREN: "grandchildren", PARENTS_SIBLINGS: "parents_siblings", SIBLINGS_CHILDREN: "siblings_children" }
const SC_REL_SCOPE_OPP = { PARENTS: "children", CHILDREN: "parents", CONTACTS: "contacts" }

// Regular expressions used for everything
const SC_RE = {
  // Matches against sentences to detect whether to inject the SEEN entry
  DESCRIBE_PERSON: /(^|[^\w])(describ|display|examin|expos|frown|gaz|glanc|glar|glimps|image|leer|look|notic|observ|ogl|peek|see|smil|spot|star(e|ing)|view|vision|watch)/gi,
  DESCRIBED_PERSON: /[^\w]appear|described|displayed|examined|exposed|glimpsed|noticed|observed|ogled|seen|spotted|viewed|watched/gi,

  // Matches against the MAIN entry for automatic pronoun detection
  FEMALE: /(^|[^\w])(♀|female|woman|lady|girl|gal|chick|mother)([^\w]|$)/gi,
  MALE: /(^|[^\w])(♂|male|man|gentleman|boy|guy|dude|father)([^\w]|$)/gi,

  // Substitutes she/he etc with the last named entry found that matches pronoun
  HER: /(^|[^\w])?(she|her(self|s)?)([^\w]|$)/gi,
  HIM: /(^|[^\w])?(he|him(self)?|his)([^\w]|$)/gi,
  YOU: /(^|[^\w])?(you)([^\w]|$)/gi,

  // Internally used regex for everything else
  INPUT_CMD: /^> You say "\/(\w+)\s?(.*)?"$|^> You \/(\w+)\s?(.*)?[.]$|^\/(\w+)\s?(.*)?$/,
  WI_REGEX_KEYS: /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g,
  BROKEN_ENCLOSURE: /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g,
  ENCLOSURE: /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g,
  SENTENCE: /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g,
  ESCAPE_REGEX: /[.*+?^${}()|[\]\\]/g,
  MISSING_FORMAT: /^[^\[({<].*[^\])}>]$/g,
  REL_KEYS: /([^,\[]+)(\[([1-5][CAFE][SIX]?)])|([^,]+)/gi
}


/*
 * Paragraph Formatter Plugin
 */
class ParagraphFormatterPlugin {
  constructor() {
    if (!state.paragraphFormatterPlugin) state.paragraphFormatterPlugin = {
      isDisabled: false,
      isSceneBreak: false
    }
    this.state = state.paragraphFormatterPlugin
  }

  inputModifier(text) {
    return this.displayModifier(text)
  }

  outputModifier(text) {
    return this.displayModifier(text)
  }

  displayModifier(text) {
    // Don't run if disabled
    if (this.state.isDisabled || !text) return text
    let modifiedText = text

    // Remove ending newline(s)
    modifiedText = modifiedText.replace(/([^\n])\n+$/g, "$1")

    // Replace starting newline
    modifiedText = modifiedText.replace(/^\n+([^\n])/g, "\n\n$1")

    // Find single newlines and replace with double
    modifiedText = modifiedText.replace(/([^\n])\n([^\n])/g, "$1\n\n$2")

    // Find three or more consecutive newlines and reduce
    modifiedText = modifiedText.replace(/[\n]{3,}/g, "\n\n")

    // Detect scene break at end for next input
    if (modifiedText.endsWith("--")) this.state.isSceneBreak = true
    // If scene break and next input, add newlines
    else if (this.state.isSceneBreak) {
      if (!modifiedText.startsWith("\n\n")) modifiedText = "\n\n" + modifiedText
      this.state.isSceneBreak = false
    }
    // Add whitespace to end if not there
    else modifiedText = modifiedText.replace(/(?<=[!?.])$/g, " ")

    return modifiedText
  }
}


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  sceneBreak = "\n\n--\n\n"
  controlCommands = ["enable", "disable", "show", "hide", "min", "max", "spacing", "reset", "debug"] // Plugin Controls
  contextCommands = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Notes
    "you", "at", "with", // PoV
    "scene", // Scene
    "think", // Think
    "focus" // Focus
  ]
  entryCommands = ["entry", "e"]
  familyCommands = ["family", "f"]
  contactsCommands = ["contacts", "c"]
  youReplacements = [
    ["you is", "you are"],
    ["you was", "you were"],
    ["you has", "you have"],
    [/(^|[^.][.!?]\s+)you /g, "$1You "]
  ]

  constructor() {
    // All state variables scoped to state.simpleContextPlugin
    // for compatibility with other plugins
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      data: Object.assign({}, SC_DEFAULT_DATA || {}),
      sections: {},
      you: {},
      context: this.getContextTemplate(),
      creator: {},
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      isMinimized: false,
      isSpaced: true,
      isVerbose: true
    }
    this.state = state.simpleContextPlugin

    // Create master lists of commands
    this.commands = [...this.controlCommands, ...this.contextCommands]
    this.creatorCommands = [...this.entryCommands, ...this.contactsCommands, ...this.familyCommands]

    // Setup external plugins
    this.paragraphFormatterPlugin = new ParagraphFormatterPlugin()

    // Initialize displayStats if not already done
    if (!state.displayStats) state.displayStats = []

    // Cache expanded world info
    this.worldInfo = this.getExpWorldInfo()
  }

  getExpWorldInfo() {
    const allInfo = []
    for (let i = 0, l = worldInfo.length; i < l; i++) {
      const info = worldInfo[i]
      const data = this.getEntryJson(info.entry)
      const regex = data.label && this.getEntryRegex(info.keys)
      const pattern = regex && this.getRegexPattern(regex)
      if (data.pronoun) data.pronoun = data.pronoun.toUpperCase()
      allInfo.push(Object.assign({ idx: i, regex, pattern, data }, info))
    }
    return allInfo
  }

  getEntryJson(text) {
    let json
    try { json = JSON.parse(text) }
    catch (e) {}

    if (typeof json !== 'object' || Array.isArray(json) || !json[SC_DATA.MAIN]) {
      json = {}
      json[SC_DATA.MAIN] = text
    }

    return json
  }

  getEntryRegex(text) {
    let flags = "g"
    let brokenRegex = false
    let pattern = [...text.matchAll(SC_RE.WI_REGEX_KEYS)].map(match => {
      if (!match[1] && match[0].startsWith("/")) brokenRegex = true
      if (match[2]) flags = match[2].includes("g") ? match[2] : `g${match[2]}`
      return match[1] ? (match[1].includes("|") ? `(${match[1]})` : match[1]) : this.getEscapedRegex(match[0].trim())
    })
    if (brokenRegex) return
    return new RegExp(pattern.join("|"), flags)
  }

  getEscapedRegex(text) {
    return text.replace(SC_RE.ESCAPE_REGEX, '\\$&'); // $& means the whole matched string
  }

  getRegexPattern(regex) {
    return regex.toString().split("/").slice(1, -1).join("/")
  }

  getSentences(text) {
    // Add temporary space to each end of the string for matching start and end enclosures
    let modifiedText = ` ${text} `

    // Fix enclosures with less than 2 characters between them
    modifiedText = modifiedText.replace(SC_RE.BROKEN_ENCLOSURE, "$1$2@$3")

    // Insert all enclosures found into an array and replace existing text with a reference to it's index
    let enclosures = []
    modifiedText = modifiedText.replace(SC_RE.ENCLOSURE, (_, prefix, match, suffix) => {
      if (!prefix || !match || !suffix) return _
      enclosures.push(match)
      return `${prefix === "@" ? "" : prefix}{${enclosures.length - 1}}${suffix}`
    })

    // Remove temporary space at start and end
    modifiedText = modifiedText.slice(1, -1)

    // Split into sentences and insert enclosures to return
    let sentences = modifiedText.match(SC_RE.SENTENCE) || []
    return sentences.map(s => enclosures.reduce((a, c, i) => a.replace(`{${i}}`, c), s))
  }

  getInfoMatch(text) {
    for (let i = 0, l = this.worldInfo.length; i < l; i++) {
      const entry = this.worldInfo[i]
      if (!entry.data.label) continue
      const matches = [...text.matchAll(entry.regex)]
      if (matches.length) return entry
    }
  }

  getPronoun(text) {
    if (!text.includes(":")) text = text.split(".")[0]
    return text.match(SC_RE.FEMALE) ? SC_PRONOUN.HER : (text.match(SC_RE.MALE) ? SC_PRONOUN.HIM : SC_PRONOUN.UNKNOWN)
  }

  getWeight(score, goal) {
    return score !== 0 ? ((score <= goal ? score : goal) / goal) : 0
  }

  getContextTemplate(text) {
    return {
      // Tracking of modified context length to prevent 85% lockout
      sizes: { modified: 0, original: text ? text.length : 0 },
      // Extrapolated matches and relationship data
      metrics: [], relations: [],
      // Grouped sentences by section
      header: [], sentences: [], history: [],
      // Original text stored for parsing outside of contextModifier
      text: text || ""
    }
  }

  getMetricTemplate(type, section, sentence, sentenceIdx, entryIdx, sentenceTotal) {
    return { type, section, sentence, sentenceIdx, entryIdx, matchText: "", weights: { distance: this.getWeight(sentenceIdx + 1, sentenceTotal) } }
  }

  getFormattedEntry(text, sizes, insertNewlineBefore=false, insertNewlineAfter=false, replaceYou=true) {
    if (!text) return

    // You replacement
    if (replaceYou) text = this.replaceYou(text)

    // Encapsulation of entry in brackets
    const match = text.match(SC_RE.MISSING_FORMAT)
    if (match) text = `<< ${this.toTitleCase(this.appendPeriod(text))}>>>>`

    // Final forms
    text = `${insertNewlineBefore ? "\n" : ""}${text}${insertNewlineAfter ? "\n" : ""}`

    // Validate entry for context overflow
    if (!this.isValidEntrySize(sizes.modified, sizes.original, text.length)) return

    // Update modified size counter
    sizes.modified += text.length

    return text
  }

  isValidEntrySize(modifiedSize, originalSize, entrySize) {
    if (originalSize === 0) return false
    const modifiedPercent = (modifiedSize + entrySize) / originalSize
    return modifiedPercent < 0.85
  }

  appendPeriod(content) {
    return !content.endsWith(".") ? content + "." : content
  }

  toTitleCase(content) {
    return content.charAt(0).toUpperCase() + content.slice(1)
  }

  replaceYou(text) {
    if (!this.state.you.id) return text

    // Match contents of /you and if found replace with the text "you"
    const youMatch = new RegExp(`(^|[^\w])${this.state.data.you}('s|s'|s)?([^\w]|$)`, "gi")
    if (text.match(youMatch)) {
      text = text.replace(youMatch, "$1you$3")
      for (let [find, replace] of this.youReplacements) text = text.replace(find, replace)
    }

    return text
  }


  /*
   * CONTEXT MODIFIER
   * - Removes excess newlines so the AI keeps on track
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries, including regex matching of keys where applicable
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   * - Scene break detection
   */
  contextModifier(text) {
    if (this.state.isDisabled || !text) return text;
    this.parseContext(text)
    return this.getModifiedContext()
  }

  parseContext(context) {
    // Store new context if one was passed
    if (context) this.state.context.text = context

    // Split into sectioned sentences, inject custom context information (author's note, pov, scene, think, focus)
    this.splitContext()

    // Match world info found in context
    this.gatherMetrics()

    // Determine relationship tree of matched entries
    this.mapRelations()

    // Gather expanded metrics based on relationship data
    this.gatherExpMetrics()

    // Inject all matched world info and relationship data (keeping within 85% cutoff)
    this.injectInfo()

    // Truncate by full sentence to ensure context is within max length (info.maxChars - info.memoryLength)
    this.truncateContext()

    // Display HUD
    this.displayHUD()

    // Display debug output
    this.displayDebug()
  }

  splitContext() {
    const { sections } = this.state
    const { text } = this.state.context
    
    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const injectedItems = []
    let sceneBreak = false
    let charCount = 0

    // Split on scene break
    const split = this.getSentences(context).reduceRight((result, sentence) => {
      if (!sceneBreak && sentence.startsWith(this.sceneBreak)) {
        result.sentences.unshift(sentence.slice(this.sceneBreak.length))
        result.history.unshift(this.sceneBreak)
        sceneBreak = true
      }
      else if (sceneBreak) result.history.unshift(sentence)
      else result.sentences.unshift(sentence)
      return result
    }, this.getContextTemplate(text))

    // Build author's note entry
    const noteEntry = this.getFormattedEntry(sections.notes, split.sizes)
    if (noteEntry) split.header.push(noteEntry)

    // Build pov entry
    const povEntry = this.getFormattedEntry(sections.pov, split.sizes, true, true, false)
    if (povEntry) split.header.push(povEntry)

    // Do sentence injections (scene, think, focus)
    split.sentences = split.sentences.reduceRight((result, sentence, idx) => {
      charCount += sentence.length
      result.unshift(sentence)

      // Determine whether to put newlines before or after injection
      const insertNewlineBefore = idx !== 0 ? !split.sentences[idx - 1].endsWith("\n") : false
      const insertNewlineAfter = !split.sentences[idx].startsWith("\n")

      // Build focus entry
      if (charCount > SC_SECTION_SIZES.FOCUS && !injectedItems.includes(SC_SECTION.FOCUS)) {
        injectedItems.push(SC_SECTION.FOCUS)
        const focusEntry = this.getFormattedEntry(sections.focus, split.sizes, insertNewlineBefore, insertNewlineAfter)
        if (focusEntry) result.unshift(focusEntry)
      }

      // Build think entry
      else if (charCount > SC_SECTION_SIZES.THINK && !injectedItems.includes(SC_SECTION.THINK)) {
        injectedItems.push(SC_SECTION.THINK)
        const thinkEntry = this.getFormattedEntry(sections.think, split.sizes, insertNewlineBefore, insertNewlineAfter)
        if (thinkEntry) result.unshift(thinkEntry)
      }

      // Build scene entry
      else if (charCount > SC_SECTION_SIZES.SCENE && !injectedItems.includes(SC_SECTION.SCENE)) {
        injectedItems.push(SC_SECTION.SCENE)
        const sceneEntry = this.getFormattedEntry(sections.scene, split.sizes, insertNewlineBefore, insertNewlineAfter)
        if (sceneEntry) result.unshift(sceneEntry)
      }

      return result
    }, [])

    this.state.context = split
  }

  gatherMetrics() {
    const { context } = this.state
    for (let i = 0, l = this.worldInfo.length; i < l; i++) {
      const entry = this.worldInfo[i]
      if (!entry.data.label) continue
      let track = { entry, section: "header", total: context.header.length, pronouns: {} }
      context.metrics = context.header.reduce((a, c, i) => this.reduceMetrics(a, c, i, track), context.metrics)
      track.section = "sentences"
      track.total = context.sentences.length
      context.metrics = context.sentences.reduce((a, c, i) => this.reduceMetrics(a, c, i, track), context.metrics)
    }
  }

  reduceMetrics(metrics, sentence, sentenceIdx, track) {
    const { entry, section, total, pronouns } = track
    const { pronoun } = entry.data
    const { you } = this.state
    const metric = this.getMetricTemplate(SC_DATA.MAIN, section, sentence, sentenceIdx, entry.idx, total)
    const matches = [...sentence.matchAll(entry.regex)]

    // Match found, add main metric and any expanded entries
    if (matches.length) {
      metric.matchText = matches[0][0]
      metrics.push(metric)
      this.matchMetrics(metrics, metric, entry.regex)
    }

    // Track "you" pronoun
    if (you.id === entry.id) pronouns[SC_PRONOUN.YOU] = metric

    // If no match attempt pronoun matching
    for (const pronoun of Object.keys(pronouns)) {
      this.matchMetrics(metrics, pronouns[pronoun], SC_RE[pronoun], [SC_DATA.TOPIC])
    }

    // Assign pronoun to track if known and not "you"
    if (you.id !== entry.id && pronoun !== SC_PRONOUN.UNKNOWN) pronouns[pronoun] = metric

    return metrics
  }

  matchMetrics(metrics, metric, regex, exclude=[]) {
    const entry = this.worldInfo[metric.entryIdx]

    // Get structured entry object, only perform matching if entry key's found
    const pattern = this.getRegexPattern(regex)

    // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
    if (!exclude.includes(SC_DATA.SEEN) && entry.data[SC_DATA.SEEN]) {
      const describe = this.getRegexPattern(SC_RE.DESCRIBE_PERSON)
      const described = this.getRegexPattern(SC_RE.DESCRIBED_PERSON)
      const expRegex = new RegExp(`(${describe}[^,]+${pattern})|(${pattern}[^,]+${described})`, regex.flags)
      const match = metric.sentence.match(expRegex)
      if (match) metrics.push(Object.assign({}, metric, { type: SC_DATA.SEEN, matchText: match[0]  }))
    }

    // determine if match is owner of quotations, ie ".*".*(pattern)  or  (pattern).*".*"
    if (!exclude.includes(SC_DATA.SEEN) && entry.data[SC_DATA.HEARD]) {
      const expRegex = new RegExp(`(((^|[^\w])".*"[^\w]|(^|[^\w])'.*'[^\w]).*${pattern})|(${pattern}.*([^\w]".*"([^\w]|$)|[^\w]'.*'([^\w]|$)))`, regex.flags)
      const match = metric.sentence.match(expRegex)
      if (match) metrics.push(Object.assign({}, metric, { type: SC_DATA.HEARD, matchText: match[0] }))
    }

    // match within quotations, ".*(pattern).*"
    // do NOT do pronoun lookups on this
    if (!exclude.includes(SC_DATA.SEEN) && entry.data[SC_DATA.TOPIC]) {
      const expRegex = new RegExp(`((^|[^\w])".*${pattern}.*"([^\w]|$))|((^|[^\w])'.*${pattern}.*'([^\w]|$))`, regex.flags)
      const match = metric.sentence.match(expRegex)
      if (match) metrics.push(Object.assign({}, metric, { type: SC_DATA.TOPIC, matchText: match[0] }))
    }
  }

  mapRelations() {
    // // Iterate over all injected entries
    // split.relations = split.metrics.reduce((result, metric) => {
    //   return result
    // }, split.relations)
    //
    // const matchGoal = 10
    // const firstPass = this.state.injected.reduce((result, injected) => {
    //   // Check to see if it is an autoInjected key, skip if so
    //   const idx = this.getEntryIndexByIndexLabel(injected.label)
    //   if (idx === -1) return
    //
    //   // Setup pronoun and ensure we don't do relationship lookups for unknown entities
    //   const entryJson = this.getEntryJson(worldInfo[idx].entry)
    //   const pronoun = this.getPronoun(this.getEntryJson(worldInfo[idx].entry))
    //
    //   // Get total matches for this injected entry (factors into weight)
    //   const matchTotal = SC_DATA_ENTRY_KEYS.reduce((a, i) => a + (injected.metrics[i] ? injected.metrics[i].length : 0), 0)
    //   const matchWeight = matchTotal !== 0 ? ((matchTotal <= matchGoal ? matchTotal : matchGoal) / matchGoal) : 0
    //
    //   // Otherwise add it to the list for consideration
    //   return result.concat({
    //     idx, label: injected.label, pronoun, weight: { match: matchWeight },
    //     nodes: this.getExpandedRelationships(entryJson).map(r => {
    //       const entryJson = this.getEntryJson(worldInfo[r.idx].entry)
    //       const pronoun = this.getPronoun(entryJson)
    //       return {
    //         idx: r.idx, label: r.label, pronoun, scope: r.scope, flag: r.flag,
    //         weight: Object.assign({ match: matchWeight }, this.getRelationFlagWeights(r))
    //       }
    //     })
    //   })
    // }, [])
    // if (!firstPass) return []
    //
    // // Cross match top level keys to figure out degrees of separation (how many people know the same people)
    // let degrees = firstPass.reduce((result, branch) => {
    //   if (!result[branch.label]) result[branch.label] = 0
    //   result[branch.label] += 1
    //   for (let node of branch.nodes) {
    //     if (!result[node.label]) result[node.label] = 0
    //     result[node.label] += 1
    //   }
    //   return result
    // }, {})
    //
    // // Update total weights to account for degrees of separation, calculate weight total
    // const degreesGoal = 4
    // const secondPass = firstPass.map(branch => {
    //   branch.weight.degrees = this.getWeight(degrees[branch.label], degreesGoal)
    //   let weight = Object.values(branch.weight)
    //   branch.weight.score = weight.reduce((a, i) => a + i) / weight.length
    //   for (let node of branch.nodes) {
    //     node.weight.degrees = this.getWeight(degrees[node.label], degreesGoal)
    //     weight = Object.values(node.weight)
    //     node.weight.score = weight.reduce((a, i) => a + i) / weight.length
    //   }
    //   return branch
    // })
    // if (!secondPass) return []
    //
    // // Create master list
    // const thirdPass = secondPass && secondPass.reduce((result, branch) => {
    //   return result.concat(branch.nodes.map(node => {
    //     const relations = this.getRelationTitles(node.scope, node.pronoun, node.flag)
    //     if (!relations.length) return
    //     return { score: node.weight.score, source: branch.label, target: node.label, relations }
    //   }).filter(n => !!n))
    // }, [])
    // if (!thirdPass) return []
    //
    // // Sort all branches by total weight score
    // thirdPass.sort((a, b) => b.score - a.score)
    // return thirdPass
  }

  gatherExpMetrics() {

  }

  injectInfo() {

  }

  truncateContext() {
    const { context } = this.state

    let charCount = 0
    let cutoffReached = false
    const headerSize = context.header.join("").length
    const maxSize = info.maxChars - info.memoryLength

    // Sentence reducer
    const reduceSentences = (result, sentence) => {
      if (cutoffReached) return result
      if ((charCount + sentence.length + headerSize) >= maxSize) {
        cutoffReached = true
        return result
      }
      charCount += sentence.length
      result.unshift(sentence)
      return result
    }

    // Reduce sentences and history to be within maxSize
    context.sentences = context.sentences.reduceRight(reduceSentences, [])
    context.history = cutoffReached ? [] : context.history.reduceRight(reduceSentences, [])
  }

  getModifiedContext() {
    const { history, header, sentences, text } = this.state.context
    const contextMemory = (text && info.memoryLength) ? text.slice(0, info.memoryLength) : ""
    return contextMemory + [...history, ...header, ...sentences].join("")
  }


  /*
   * OUTPUT MODIFIER
   * - Handles paragraph formatting.
   */
  outputModifier(text) {
    let modifiedText = text

    // Paragraph formatting
    if (this.state.isSpaced) modifiedText = this.paragraphFormatterPlugin.outputModifier(modifiedText)

    return modifiedText
  }


  /*
   * INPUT MODIFIER
   * - Takes new command and refreshes context and HUD (if visible and enabled)
   * - Updates when valid command is entered into the prompt (ie, `/you John Smith`)
   * - Can clear state by executing the command without any arguments (ie, `/you`)
   * - Paragraph formatting is applied
   * - Scene break detection
   */
  inputModifier(text) {
    let modifiedText = text

    // Check if no input (ie, prompt AI)
    if (!modifiedText) return modifiedText

    // Handle entry and relationship menus
    modifiedText = this.entryHandler(text)
    if (!modifiedText) return modifiedText

    // Detection for multi-line commands, filter out double ups of newlines
    modifiedText = text.split("\n").map(l => this.commandHandler(l)).join("\n")

    // Cleanup for commands
    if (["\n", "\n\n"].includes(modifiedText)) modifiedText = ""

    // Paragraph formatting
    if (this.state.isSpaced) modifiedText = this.paragraphFormatterPlugin.inputModifier(modifiedText)

    return modifiedText
  }

  /*
   * Input Modifier: Default Command Handler
   * - Handles all passed commands such as `/scene`, `/you` etc
   */
  commandHandler(text) {
    const { data, sections } = this.state
    
    // Check if a command was inputted
    let match = SC_RE.INPUT_CMD.exec(text)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Check if the command was valid
    const cmd = match[1].toLowerCase()
    const params = match.length > 2 && match[2] ? match[2].trim() : undefined
    if (!this.commands.includes(cmd)) return text

    // Detect for Controls, handle state and perform actions (ie, hide HUD)
    if (this.controlCommands.includes(cmd)) {
      if (cmd === "debug") {
        this.state.isDebug = !this.state.isDebug
        state.message = this.state.isDebug ? "Enter something into the prompt to start debugging the context.." : ""
      }
      else if (cmd === "enable" || cmd === "disable") this.state.isDisabled = (cmd === "disable")
      else if (cmd === "show" || cmd === "hide") this.state.isHidden = (cmd === "hide")
      else if (cmd === "min" || cmd === "max") this.state.isMinimized = (cmd === "min")
      else if (cmd === "spacing") this.state.isSpaced = !this.state.isSpaced
      else if (cmd === "reset") {
        this.state.sections = {}
        this.state.data = {}
      }
      this.displayHUD()
      return
    } else {
      // If value passed assign it to the data store, otherwise delete it (ie, `/you`)
      if (params) {
        data[cmd] = params
        // Do "you" detection early
        if (cmd === "you") this.state.you = this.getInfoMatch(data.you) || {}
      }
      else delete data[cmd]
    }

    // Notes - Author's Note, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    // Placed at the very end of context.
    const notes = []
    delete sections.notes
    if (data.note) notes.push(`Author's note: ${this.appendPeriod(data.note)}`)
    if (data.title) notes.push(`Title: ${this.appendPeriod(data.title)}`)
    if (data.author) notes.push(`Author: ${this.appendPeriod(data.author)}`)
    if (data.genre) notes.push(`Genre: ${this.appendPeriod(data.genre)}`)
    if (data.setting) notes.push(`Setting: ${this.appendPeriod(data.setting)}`)
    if (data.theme) notes.push(`Theme: ${this.appendPeriod(data.theme)}`)
    if (data.subject) notes.push(`Subject: ${this.appendPeriod(data.subject)}`)
    if (data.style) notes.push(`Writing Style: ${this.appendPeriod(data.style)}`)
    if (data.rating) notes.push(`Rating: ${this.appendPeriod(data.rating)}`)
    if (notes.length) sections.notes = notes.join(" ")

    // POV - Name, location and present company
    // Placed directly under Author's Notes
    const pov = []
    delete sections.pov
    if (data.you) pov.push(`You are ${this.appendPeriod(data.you)}`)
    if (data.at) pov.push(`You are at ${this.appendPeriod(data.at)}`)
    if (data.with) pov.push(`You are with ${this.appendPeriod(data.with)}`)
    if (pov.length) sections.pov = pov.join(" ")

    // Scene - Used to provide the premise for generated context
    // Placed 1000 characters from the front of context
    delete sections.scene
    if (data.scene) sections.scene = this.replaceYou(this.toTitleCase(this.appendPeriod(data.scene)))

    // Think - Use to nudge a story in a certain direction
    // Placed 550 characters from the front of context
    delete sections.think
    if (data.think) sections.think = this.replaceYou(this.toTitleCase(this.appendPeriod(data.think)))

    // Focus - Use to force a narrative or story direction
    // Placed 150 characters from the front of context
    delete sections.focus
    if (data.focus) sections.focus = this.replaceYou(this.toTitleCase(this.appendPeriod(data.focus)))

    this.displayHUD()
    return ""
  }

  /*
   * Input Modifier: Entry and Relationship Command Handler
   * - Used for updating and creating new entries/relationships
   */
  entryHandler(text) {
    const { creator } = this.state
    const modifiedText = text.slice(1)

    // Already processing input
    if (creator.step) {
      // Hints toggling
      if (modifiedText === SC_CMD.HINTS) {
        this.state.isVerbose = !this.state.isVerbose
        const handlerString = `entry${creator.step}Step`
        if (typeof this[handlerString] === 'function') this[handlerString]()
        else this.entryExit()
      }
      // Dynamically execute function based on step
      else {
        const handlerString = `entry${creator.step}Handler`
        if (modifiedText === SC_CMD.CANCEL) this.entryExit()
        else if (typeof this[handlerString] === 'function') this[handlerString](modifiedText)
        else this.entryExit()
      }
      return ""
    }

    // Quick check to return early if possible
    if (!modifiedText.startsWith("/") || modifiedText.includes("\n")) return text

    // Match a command
    let match = SC_RE.INPUT_CMD.exec(modifiedText)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Ensure correct command is passed, grab label if applicable
    let cmd = match[1].toLowerCase()
    if (!this.creatorCommands.includes(cmd)) return text
    let label = match.length > 1 && match[2] && match[2].trim()

    // Shortcuts for "/e you" and "/r you"
    if (!label || label.toLowerCase() === "you") {
      if (this.state.you.id) label = this.state.you.data.label
      else return ""
    }

    const isEntry = this.entryCommands.includes(cmd)
    const isFamily = this.familyCommands.includes(cmd)
    const isContacts = this.contactsCommands.includes(cmd)

    // Setup index and preload entry if found
    this.setEntrySource(this.worldInfo.find(i => i.data.label === label) || label)
    if (!creator.source && (isFamily || isContacts)) return ""

    // Store current message away to restore once done
    creator.previousMessage = state.message

    // Direct to correct menu
    creator.cmd = cmd
    if (isEntry) this.entryKeysStep()
    else if (isFamily) this.entryParentsStep()
    else this.entryContactsStep()
    return ""
  }

  entryLabelStep() {
    const { creator } = this.state

    creator.step = "Label"
    this.displayEntryHUD(`${SC_LABEL.LABEL} Enter the LABEL used to refer to this entry: `)
  }

  entryLabelHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL || text === SC_CMD.BACK) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (creator.source || this.isEntryValid()) return this.entryConfirmStep()
      else return this.entryLabelStep()
    }
    if (text !== SC_CMD.SKIP) {
      // Do check for existing label here.
      if (creator.source) creator.oldLabel = creator.data.label
      creator.data.label = text
    }

    this.entryKeysStep()
  }

  entryKeysStep() {
    const { creator } = this.state

    creator.step = "Keys"
    this.displayEntryHUD(`${SC_LABEL.KEYS} Enter the KEYS used to trigger entry injection:`)
  }

  entryKeysHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL || text === SC_CMD.BACK) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (creator.source || this.isEntryValid()) return this.entryConfirmStep()
      else return this.entryKeysStep()
    }
    if (text === SC_CMD.SKIP) {
      if (creator.source || creator.keys) return this.entryMainStep()
      else return this.entryKeysStep()
    }

    // Ensure valid regex if regex key
    const key = this.getEntryRegex(text)
    if (!key) return this.displayEntryHUD(`${SC_LABEL.ERROR} ERROR! Invalid regex detected in keys, try again: `)

    // Detect conflicting/existing keys and display error
    const existing = this.worldInfo.find(i => i.keys === key.toString())
    const sourceIdx = creator.source ? creator.source.idx : -1
    if (existing && existing.idx !== sourceIdx) {
      if (!creator.source) this.setEntrySource(existing)
      else return this.displayEntryHUD(`${SC_LABEL.ERROR} ERROR! World Info with that key already exists, try again: `)
    }

    // Update keys to regex format
    creator.keys = key.toString()

    // Otherwise proceed to entry input
    this.entryMainStep()
  }

  entryMainStep() {
    const { creator } = this.state

    creator.step = this.toTitleCase(SC_DATA.MAIN)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.MAIN.toUpperCase()]} Enter the MAIN entry to inject when keys found:`)
  }

  entryMainHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (creator.source || this.isEntryValid()) return this.entryConfirmStep()
      else return this.entryMainStep()
    }
    if (text === SC_CMD.BACK) return this.entryKeysStep()
    if (text === SC_CMD.SKIP) {
      if (creator.source || creator.data[SC_DATA.MAIN]) return this.entrySeenStep()
      else return this.entryMainStep()
    }

    this.setEntryJson(creator.data, SC_DATA.MAIN, text)
    creator.data.pronoun = this.getPronoun(creator.data[SC_DATA.MAIN])
    this.entrySeenStep()
  }

  entrySeenStep() {
    const { creator } = this.state

    creator.step = this.toTitleCase(SC_DATA.SEEN)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.SEEN.toUpperCase()]} Enter entry to inject when SEEN (optional):`)
  }

  entrySeenHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryMainStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(creator.data, SC_DATA.SEEN, text)

    this.entryHeardStep()
  }

  entryHeardStep() {
    const { creator } = this.state

    creator.step = this.toTitleCase(SC_DATA.HEARD)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.HEARD.toUpperCase()]} Enter entry to inject when HEARD (optional):`)
  }

  entryHeardHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entrySeenStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(creator.data, SC_DATA.HEARD, text)

    this.entryTopicStep()
  }

  entryTopicStep() {
    const { creator } = this.state

    creator.step = this.toTitleCase(SC_DATA.TOPIC)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.TOPIC.toUpperCase()]} Enter entry to inject when TOPIC of conversation (optional):`)
  }

  entryTopicHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryHeardStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(creator.data, SC_DATA.TOPIC, text)

    this.entryConfirmStep()
  }

  entryParentsStep() {
    const { creator } = this.state

    creator.step = this.toTitleCase(SC_DATA.PARENTS)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.PARENTS.toUpperCase()]} Enter comma separated list of entry PARENTS (optional):`)
  }

  entryParentsHandler(text) {
    const { creator } = this.state

    if (text === SC_CMD.BACK_ALL) return this.entryParentsStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryParentsStep()
    if (text === SC_CMD.DELETE && creator.data[SC_DATA.PARENTS]) delete creator.data[SC_DATA.PARENTS]
    else if (text !== SC_CMD.SKIP) {
      let rel = this.getRelationKeys(SC_DATA.PARENTS, text)
      rel = this.entryRelExclude(rel, creator.data, SC_DATA.CHILDREN)
      this.entryRelExclusive(rel, creator.data, SC_DATA.CONTACTS)
      this.setEntryJson(creator.data, SC_DATA.PARENTS, this.getRelationKeysText(rel))
    }

    this.entryChildrenStep()
  }

  entryChildrenStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.CHILDREN)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.CHILDREN.toUpperCase()]} Enter comma separated list of entry CHILDREN (optional):`)
  }

  entryChildrenHandler(text) {
    const { creator } = this.state
    if (text === SC_CMD.BACK_ALL) return this.entryParentsStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryParentsStep()
    if (text === SC_CMD.DELETE && creator.data[SC_DATA.CHILDREN]) delete creator.data[SC_DATA.CHILDREN]
    else if (text !== SC_CMD.SKIP) {
      let rel = this.getRelationKeys(SC_DATA.CHILDREN, text)
      rel = this.entryRelExclude(rel, creator.data, SC_DATA.PARENTS)
      this.entryRelExclusive(rel, creator.data, SC_DATA.CONTACTS)
      this.setEntryJson(creator.data, SC_DATA.CHILDREN, this.getRelationKeysText(rel))
    }
    this.entryConfirmStep()
  }

  entryContactsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.CONTACTS)
    this.displayEntryHUD(`${SC_LABEL[SC_DATA.CONTACTS.toUpperCase()]} Enter comma separated list of entry KNOWN (optional):`)
  }

  entryContactsHandler(text) {
    const { creator } = this.state
    if (text === SC_CMD.BACK_ALL) return this.entryContactsStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryContactsStep()
    if (text === SC_CMD.DELETE && creator.data[SC_DATA.CONTACTS]) delete creator.data[SC_DATA.CONTACTS]
    else if (text !== SC_CMD.SKIP) {
      let rel = this.getRelationKeys(SC_DATA.CONTACTS, text)
      rel = this.entryRelExclude(rel, creator.data, SC_DATA.PARENTS)
      rel = this.entryRelExclude(rel, creator.data, SC_DATA.CHILDREN)
      this.setEntryJson(creator.data, SC_DATA.CONTACTS, this.getRelationKeysText(rel))
    }
    this.entryConfirmStep()
  }

  entryConfirmStep() {
    const { creator } = this.state
    creator.step = "Confirm"
    this.displayEntryHUD(`${SC_LABEL.CONFIRM} Do you want to save these changes? (y/n)`, false)
  }

  entryConfirmHandler(text) {
    const { creator } = this.state
    
    if (text === SC_CMD.BACK_ALL) {
      if (this.entryCommands.includes(creator.cmd)) return this.entryLabelStep()
      else if (this.familyCommands.includes(creator.cmd)) return this.entryParentsStep()
      else return this.entryContactsStep()
    }
    if ([SC_CMD.SKIP, SC_CMD.SKIP_ALL, SC_CMD.DELETE].includes(text)) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) {
      if (this.entryCommands.includes(creator.cmd)) return this.entryTopicStep()
      else if (this.familyCommands.includes(creator.cmd)) return this.entryChildrenStep()
      else return this.entryContactsStep()
    }

    // Exit without saving if anything other than "y" passed
    if (text.toLowerCase().startsWith("n")) return this.entryExit()
    if (!text.toLowerCase().startsWith("y")) return this.entryConfirmStep()

    // Add missing data
    if (!creator.data.pronoun) creator.data.pronoun = this.getPronoun(creator.data)
    creator.data.pronoun = creator.data.pronoun.toLowerCase()

    // Add new World Info
    const entry = JSON.stringify(creator.data)
    if (!creator.source) {
      addWorldEntry(creator.keys, entry)
      this.worldInfo = this.getExpWorldInfo()
    }

    // Update existing World Info
    else updateWorldEntry(creator.source.id, creator.keys, entry)

    // Update preloaded info
    if (!this.state.you.id) this.state.you = this.getInfoMatch(this.state.data.you) || {}

    // Sync relationships and status
    // this.syncRelations(this.worldInfo.find(i => i.keys === creator.keys))

    // Reset everything back
    this.entryExit()
  }

  entryExit() {
    state.message = this.state.creator.previousMessage
    this.state.creator = {}
    this.displayHUD()
  }

  displayEntryHUD(promptText, hints=true) {
    const output = []
    if (hints && !this.state.isVerbose) output.push(`Hint: Type ${SC_CMD.BACK_ALL} to go to start, ${SC_CMD.BACK} to go back, ${SC_CMD.SKIP} to skip, ${SC_CMD.SKIP_ALL} to skip all, ${SC_CMD.DELETE} to delete, ${SC_CMD.CANCEL} to cancel and ${SC_CMD.HINTS} to toggle hints.\n\n`)
    output.push(`${promptText}`)
    state.message = output.join("\n")
    this.displayHUD()
  }

  setEntrySource(source) {
    const { creator } = this.state
    if (typeof source === "object") {
      creator.source = source
      creator.keys = source.keys
      creator.data = Object.assign({}, source.data)
    }
    else creator.data = { label: source, pronoun: SC_PRONOUN.UNKNOWN, [SC_DATA.MAIN]: "" }
  }

  setEntryJson(json, key, text) {
    if (json[key] && text === SC_CMD.DELETE) delete json[key]
    else json[key] = text
  }

  isEntryValid() {
    return this.state.creator.data[SC_DATA.MAIN] && this.state.creator.keys
  }


  /*
   * UI Rendering
   */
  displayDebug() {
    if (!this.state.isDebug) return

    // Output to AID Script Diagnostics
    console.log(this.state.context)

    // Don't hijack state.message while doing creating/updating a World Info entry
    if (this.state.creator.step) return

    // Output context to state.message with numbered lines
    let debugLines = this.getModifiedContext().split("\n")
    debugLines.reverse()
    debugLines = debugLines.map((l, i) => "(" + (i < 9 ? "0" : "") + `${i + 1}) ${l}`)
    debugLines.reverse()
    state.message = debugLines.join("\n")
  }

  displayHUD() {
    const { creator } = this.state

    // Clear out Simple Context stats, keep stats from other scripts for compatibility
    const labels = Object.values(SC_LABEL)
    state.displayStats = state.displayStats.filter(s => !labels.includes(s.key.replace(SC_LABEL.SELECTED, "")))

    // Get correct stats to display
    let hudStats
    if (this.entryCommands.includes(creator.cmd)) hudStats = this.getEntryStats()
    else if (this.familyCommands.includes(creator.cmd)) hudStats = this.getFamilyStats()
    else if (this.contactsCommands.includes(creator.cmd)) hudStats = this.getContactsStats()
    else hudStats = this.getInfoStats()

    // Display stats
    state.displayStats = [...hudStats, ...state.displayStats]
  }

  getInfoStats() {
    const displayStats = []
    if (this.state.isDisabled || this.state.isHidden) return displayStats
    
    const { metrics }= this.state.context

    // Setup tracking information
    const track = metrics.reduce((result, metric) => {
      const entry = this.worldInfo[metric.entryIdx]
      const existing = result.find(r => r.entry.id === entry.id)
      const item = existing || { entry: entry, injections: [] }
      if (!item.injections.includes(metric.type)) item.injections.push(metric.type)
      if (!existing) result.push(item)
      return result
    }, []).map(item => {
      const injectedEmojis = this.state.isMinimized ? "" : item.injections.filter(i => i !== SC_DATA.MAIN).map(i => SC_LABEL[i.toUpperCase()]).join("")
      return `${this.getPronounEmoji(item.entry)}${item.entry.data.label}${injectedEmojis}`
    })

    // Display World Info injected into context
    if (track.length) displayStats.push({
      key: SC_LABEL.TRACK, color: SC_COLOR.TRACK,
      value: `${track.join(SC_LABEL.SEPARATOR)}${!SC_LABEL.TRACK.trim() ? " :" : ""}\n`
    })

    // Display relevant HUD elements
    const contextKeys = this.state.isMinimized ? ["THINK", "FOCUS"] : ["NOTES", "POV", "SCENE", "THINK", "FOCUS"]
    for (let key of contextKeys) {
      if (this.state.sections[key.toLowerCase()]) displayStats.push({
        key: SC_LABEL[key], color: SC_COLOR[key],
        value: `${this.state.sections[key.toLowerCase()]}\n`
      })
    }

    return displayStats
  }

  getEntryStats() {
    return []
  }

  getFamilyStats() {
    return []
  }

  getContactsStats() {
    return []
  }

  getPronounEmoji(entry) {
    return entry.id === this.state.you.id ? SC_LABEL[SC_PRONOUN.YOU] : SC_LABEL[entry.data.pronoun]
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
