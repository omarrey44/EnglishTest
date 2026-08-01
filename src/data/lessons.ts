import type { TopicId } from "@/types/question";

export interface LessonExample {
  left: string;
  right: string;
  note?: string;
}

export interface LessonSection {
  title: string;
  body?: string;
  bullets?: string[];
  examples?: LessonExample[];
}

export interface Lesson {
  topic: TopicId;
  intro: string;
  sections: LessonSection[];
}

export const LESSONS: Record<TopicId, Lesson> = {
  ordinals: {
    topic: "ordinals",
    intro:
      "Ordinal numbers say the position of something: first, second, third. You need them for every date, from the 1st to the 31st.",
    sections: [
      {
        title: "The three irregular ones",
        body: "Learn these by heart — they do not follow the -th pattern.",
        examples: [
          { left: "1", right: "1st — first" },
          { left: "2", right: "2nd — second" },
          { left: "3", right: "3rd — third" },
        ],
      },
      {
        title: "Everything else adds -th",
        bullets: [
          "4th fourth · 6th sixth · 7th seventh · 10th tenth",
          "Spelling changes: five → fifth, nine → ninth, twelve → twelfth, eight → eighth",
          "11th, 12th and 13th are exceptions: they always take -th (never 11st).",
        ],
      },
      {
        title: "Tens and compounds",
        body: "Numbers ending in -y change to -ieth. In compounds, only the last part is ordinal.",
        examples: [
          { left: "20", right: "20th — twentieth" },
          { left: "21", right: "21st — twenty-first" },
          { left: "22", right: "22nd — twenty-second" },
          { left: "23", right: "23rd — twenty-third" },
          { left: "30", right: "30th — thirtieth" },
          { left: "31", right: "31st — thirty-first" },
        ],
      },
      {
        title: "Quick rule for the ending",
        bullets: [
          "ends in 1 → st (except 11)",
          "ends in 2 → nd (except 12)",
          "ends in 3 → rd (except 13)",
          "everything else → th",
        ],
      },
    ],
  },

  weather: {
    topic: "weather",
    intro:
      "Weather sentences in English always start with the subject \"it\" and the verb \"be\": It's sunny. It was cold.",
    sections: [
      {
        title: "Core vocabulary",
        examples: [
          { left: "sunny", right: "soleado" },
          { left: "cloudy", right: "nublado" },
          { left: "rainy / raining", right: "lluvioso / lloviendo" },
          { left: "snowy / snowing", right: "nevado / nevando" },
          { left: "windy", right: "ventoso" },
          { left: "foggy", right: "con niebla" },
          { left: "stormy", right: "tormentoso" },
          { left: "hot · warm · cool · cold · freezing", right: "caluroso · templado · fresco · frío · helado" },
        ],
      },
      {
        title: "Asking about the weather",
        examples: [
          { left: "How's the weather today?", right: "¿Qué tiempo hace hoy?" },
          { left: "What's the weather like?", right: "¿Cómo está el clima?" },
          { left: "How was the weather yesterday?", right: "¿Qué tiempo hizo ayer?" },
        ],
      },
      {
        title: "Careful with these",
        bullets: [
          "Spanish says \"hace frío\", English says \"it IS cold\" — use the verb to be.",
          "After was/were you need an adjective: It was rainy (not \"It was rain\").",
          "For right now, use the -ing form: It's raining.",
        ],
      },
    ],
  },

  dates: {
    topic: "dates",
    intro:
      "American English writes the month first, then the day as an ordinal number, then a comma and the year.",
    sections: [
      {
        title: "The formula",
        body: "Month + ordinal day + , + year",
        examples: [
          { left: "4 de julio de 2026", right: "July 4th, 2026" },
          { left: "23 de diciembre de 1994", right: "December 23rd, 1994" },
          { left: "1 de marzo de 2020", right: "March 1st, 2020" },
          { left: "22 de septiembre de 2005", right: "September 22nd, 2005" },
          { left: "31 de enero de 2018", right: "January 31st, 2018" },
        ],
      },
      {
        title: "Converting from Spanish numbers",
        body: "Spanish writes day/month/year. American English uses month/day/year.",
        examples: [
          { left: "23/12/1994", right: "December 23rd, 1994", note: "12/23/1994 in numbers" },
          { left: "05/11/2010", right: "November 5th, 2010", note: "11/05/2010 in numbers" },
        ],
      },
      {
        title: "Prepositions",
        bullets: [
          "on + full date: on March 1st, 2000",
          "in + month or year: in March, in 1994",
          "at + time: at 8 o'clock",
        ],
      },
    ],
  },

  years: {
    topic: "years",
    intro:
      "Years are usually said in two halves. The 2000s are the exception — and after 2010 we go back to halves.",
    sections: [
      {
        title: "Before 2000: two pairs",
        examples: [
          { left: "1994", right: "nineteen ninety-four" },
          { left: "1985", right: "nineteen eighty-five" },
          { left: "1776", right: "seventeen seventy-six" },
          { left: "1907", right: "nineteen oh seven", note: "third digit 0 → \"oh\"" },
          { left: "1900", right: "nineteen hundred", note: "ends in 00 → hundred" },
        ],
      },
      {
        title: "2000 – 2009",
        examples: [
          { left: "2000", right: "two thousand" },
          { left: "2005", right: "two thousand five" },
          { left: "2008", right: "two thousand eight" },
        ],
      },
      {
        title: "2010 and later: pairs again",
        examples: [
          { left: "2012", right: "twenty twelve" },
          { left: "2020", right: "twenty twenty" },
          { left: "2026", right: "twenty twenty-six" },
        ],
      },
    ],
  },

  andBut: {
    topic: "andBut",
    intro:
      "Both words join two ideas. The difference is the direction of the second idea.",
    sections: [
      {
        title: "AND adds",
        body: "The two ideas go in the same direction.",
        examples: [
          { left: "It was sunny and warm.", right: "Both are pleasant." },
          { left: "We watched a movie and ate popcorn.", right: "Two activities together." },
        ],
      },
      {
        title: "BUT contrasts",
        body: "The second idea is a surprise or an opposite.",
        examples: [
          { left: "It was cold, but it was sunny.", right: "Cold vs. sunny." },
          { left: "I studied a lot, but the exam was difficult.", right: "Unexpected result." },
          { left: "They were tired but happy.", right: "Opposite feelings." },
        ],
      },
      {
        title: "Signals for BUT",
        bullets: [
          "still: It was raining but we still went out.",
          "anyway: It rained, but we played anyway.",
          "Two adjectives with opposite feelings: tired but happy.",
        ],
      },
    ],
  },

  pastVerbs: {
    topic: "pastVerbs",
    intro:
      "Regular verbs form the past simple with -ed, and the form is the same for every subject: I worked, she worked, they worked.",
    sections: [
      {
        title: "Affirmative",
        examples: [
          { left: "They played soccer yesterday.", right: "Jugaron fútbol ayer." },
          { left: "I studied English last night.", right: "Estudié inglés anoche." },
          { left: "The bus arrived ten minutes late.", right: "El autobús llegó diez minutos tarde." },
        ],
      },
      {
        title: "Negative: didn't + base form",
        body: "\"Didn't\" already carries the past, so the main verb loses the -ed.",
        examples: [
          { left: "We didn't watch TV.", right: "not: didn't watched" },
          { left: "He didn't call me.", right: "not: didn't called" },
        ],
      },
      {
        title: "Questions: Did + subject + base form",
        examples: [
          { left: "Did you call your mother?", right: "not: Did you called...?" },
          { left: "Did they walk to school?", right: "Yes, they did. / No, they didn't." },
        ],
      },
      {
        title: "Time expressions",
        bullets: [
          "yesterday · last night · last week · last Saturday",
          "two days ago · in 2019 · when I was a child",
        ],
      },
    ],
  },

  irregularVerbs: {
    topic: "irregularVerbs",
    intro:
      "Irregular verbs do not take -ed in the past. There is no rule — each one has its own form, and you learn them by heart.",
    sections: [
      {
        title: "The core list",
        body: "These fourteen appear in almost every exam.",
        examples: [
          { left: "begin", right: "began" },
          { left: "buy", right: "bought" },
          { left: "do", right: "did" },
          { left: "get", right: "got" },
          { left: "go", right: "went" },
          { left: "have", right: "had" },
          { left: "know", right: "knew" },
          { left: "lose", right: "lost" },
          { left: "make", right: "made" },
          { left: "see", right: "saw" },
          { left: "spend", right: "spent" },
          { left: "take", right: "took" },
          { left: "think", right: "thought" },
          { left: "write", right: "wrote" },
        ],
      },
      {
        title: "Groups that help you remember",
        bullets: [
          "-ought / -aught: buy → bought, think → thought, bring → brought, teach → taught, catch → caught",
          "-elt / -ept / -ent: feel → felt, sleep → slept, send → sent, spend → spent",
          "i → a → u pattern: begin → began, drink → drank, sing → sang, swim → swam, run → ran",
          "No change at all: put → put, cut → cut, read → read (but the sound changes to /red/)",
        ],
      },
      {
        title: "More you should know",
        examples: [
          { left: "come", right: "came" },
          { left: "eat", right: "ate" },
          { left: "find", right: "found" },
          { left: "give", right: "gave" },
          { left: "leave", right: "left" },
          { left: "meet", right: "met" },
          { left: "pay", right: "paid" },
          { left: "say", right: "said", note: "sounds like /sed/" },
          { left: "sell", right: "sold" },
          { left: "sit", right: "sat" },
          { left: "speak", right: "spoke" },
          { left: "tell", right: "told" },
          { left: "wear", right: "wore" },
          { left: "win", right: "won" },
        ],
      },
      {
        title: "The trap",
        body: "The irregular form is only for the affirmative. After didn't or Did, the verb goes back to the base form.",
        examples: [
          { left: "I went to the party.", right: "I didn't go to the party." },
          { left: "She bought a car.", right: "Did she buy a car?" },
          { left: "not: I didn't went", right: "not: Did she bought?" },
        ],
      },
    ],
  },

  pastNegative: {
    topic: "pastNegative",
    intro:
      "The past negative is always the same: subject + didn't + the base form of the verb. It does not matter whether the verb is regular or irregular.",
    sections: [
      {
        title: "The formula",
        body: "Subject (I, you, he, she, it, we, they) + didn't + base verb.",
        examples: [
          { left: "I didn't have brothers or sisters.", right: "No tenía hermanos ni hermanas." },
          { left: "She didn't work at the studio.", right: "Ella no trabajaba en el estudio." },
          { left: "They didn't arrive on time.", right: "No llegaron a tiempo." },
        ],
      },
      {
        title: "Same form for regular and irregular",
        body: "This is the good news: you do not need the irregular past form in a negative sentence.",
        examples: [
          { left: "I didn't play baseball.", right: "not: I didn't played baseball." },
          { left: "I didn't speak English.", right: "not: I didn't spoke English." },
          { left: "We didn't go home.", right: "not: We didn't went home." },
        ],
      },
      {
        title: "didn't = did not",
        body: "The short form is normal in speech and in most writing. The long form is more formal or emphatic.",
        examples: [
          { left: "He didn't call me.", right: "He did not call me." },
          { left: "It didn't rain.", right: "It did not rain." },
        ],
      },
      {
        title: "One exception: was / were",
        body: "The verb \"be\" does not use didn't. It makes its own negative.",
        examples: [
          { left: "I wasn't at home.", right: "not: I didn't be at home." },
          { left: "They weren't ready.", right: "not: They didn't were ready." },
        ],
      },
    ],
  },

  edSpelling: {
    topic: "edSpelling",
    intro: "Four spelling patterns cover every regular verb in the past.",
    sections: [
      {
        title: "1. Most verbs: + ed",
        examples: [
          { left: "work", right: "worked" },
          { left: "watch", right: "watched" },
          { left: "open", right: "opened" },
        ],
      },
      {
        title: "2. Verb ends in -e: + d",
        examples: [
          { left: "live", right: "lived" },
          { left: "dance", right: "danced" },
          { left: "arrive", right: "arrived" },
        ],
      },
      {
        title: "3. Consonant + y: y → i + ed",
        body: "Only when the letter before the y is a consonant.",
        examples: [
          { left: "study", right: "studied" },
          { left: "cry", right: "cried" },
          { left: "carry", right: "carried" },
          { left: "play (vowel + y)", right: "played", note: "the y stays" },
        ],
      },
      {
        title: "4. Double the last consonant",
        body: "One syllable (or stress on the last syllable) with consonant + vowel + consonant.",
        examples: [
          { left: "stop", right: "stopped" },
          { left: "plan", right: "planned" },
          { left: "prefer", right: "preferred", note: "stress on -FER" },
          { left: "visit", right: "visited", note: "stress on VI- → no double" },
        ],
      },
    ],
  },

  edPronunciation: {
    topic: "edPronunciation",
    intro:
      "The -ed ending has three sounds. What decides is the LAST SOUND of the verb, not the last letter.",
    sections: [
      {
        title: "Why the sound matters, not the letter",
        bullets: [
          "watch ends in the letter h, but the sound is /tʃ/ → watched = /wɑːtʃt/",
          "laugh ends in gh, but the sound is /f/ → laughed = /læft/",
          "study ends in y, but the sound is the vowel /i/ → studied = /ˈstʌdid/",
        ],
      },
      {
        title: "Test it yourself",
        body: "Put your hand on your throat and say the last sound of the verb. If it vibrates, the sound is voiced (→ /d/). If it does not vibrate, it is voiceless (→ /t/). If the verb already ends in /t/ or /d/, you need the extra syllable /ɪd/.",
      },
    ],
  },

  wasWere: {
    topic: "wasWere",
    intro: "Was and were are the past of the verb \"to be\". Everything depends on the subject.",
    sections: [
      {
        title: "Who takes what",
        examples: [
          { left: "I / he / she / it", right: "was" },
          { left: "you / we / they", right: "were" },
          { left: "My brother and I", right: "were", note: "two people = we" },
          { left: "My friends", right: "were", note: "plural" },
        ],
      },
      {
        title: "Affirmative",
        examples: [
          { left: "I was tired.", right: "Yo estaba cansado." },
          { left: "They were at school yesterday.", right: "Ellos estaban en la escuela ayer." },
        ],
      },
      {
        title: "Negative",
        examples: [
          { left: "She wasn't happy.", right: "was + not = wasn't" },
          { left: "We weren't ready.", right: "were + not = weren't" },
        ],
      },
      {
        title: "Questions and short answers",
        examples: [
          { left: "Was she happy?", right: "Yes, she was. / No, she wasn't." },
          { left: "Were they at the restaurant?", right: "Yes, they were. / No, they weren't." },
          { left: "Where were you yesterday?", right: "I was at home." },
        ],
      },
      {
        title: "There was / There were",
        bullets: [
          "There was a problem. (singular)",
          "There were many people. (plural)",
        ],
      },
    ],
  },

  whQuestions: {
    topic: "whQuestions",
    intro:
      "WH questions ask for information. The order is always: WH word + was/were (or did) + subject.",
    sections: [
      {
        title: "The six question words",
        examples: [
          { left: "What", right: "¿Qué?", note: "a thing" },
          { left: "Where", right: "¿Dónde?", note: "a place" },
          { left: "When", right: "¿Cuándo?", note: "a time" },
          { left: "Who", right: "¿Quién?", note: "a person" },
          { left: "Why", right: "¿Por qué?", note: "a reason — answer with because" },
          { left: "How", right: "¿Cómo?", note: "a way or condition" },
        ],
      },
      {
        title: "Word order",
        examples: [
          { left: "Where were you yesterday?", right: "not: Where you were...?" },
          { left: "Why was the store closed?", right: "Because it was a holiday." },
          { left: "How was the weather?", right: "It was cold and windy." },
        ],
      },
      {
        title: "Choosing the word from the answer",
        bullets: [
          "\"I was at the hospital.\" → Where were you?",
          "\"It was on May 3rd.\" → When was it?",
          "\"My sister.\" → Who was with you?",
          "\"Because I was sick.\" → Why were you absent?",
        ],
      },
    ],
  },

  sequenceWords: {
    topic: "sequenceWords",
    intro:
      "Sequence words connect events and show the reader the order they happened in: then, next, after that, later. They turn a list of sentences into a story.",
    sections: [
      {
        title: "The basic four",
        examples: [
          { left: "then", right: "luego — the very next thing" },
          { left: "next", right: "después — the next step in a list" },
          { left: "after that", right: "después de eso — after the previous event" },
          { left: "later", right: "más tarde — some time afterwards" },
        ],
      },
      {
        title: "Where they go, and the comma",
        body: "At the start of a sentence they take a comma. After \"and\" they do not.",
        examples: [
          { left: "After that, I went to the University of Lisbon.", right: "comma after the phrase" },
          { left: "Next, I decided to come to the United States.", right: "comma after the word" },
          { left: "I finished college in 2002, and then I got a job.", right: "no comma after \"then\" here" },
        ],
      },
      {
        title: "Saying how much time passed",
        body: "Use a quantity of time + later. This is the most precise option, so prefer it when you know the dates.",
        examples: [
          { left: "one year later", right: "1979 → 1980" },
          { left: "two years later", right: "2014 → 2016" },
          { left: "one month later", right: "March → April" },
          { left: "Later, in 2014, Lisa and I got married.", right: "later + a specific year" },
        ],
      },
      {
        title: "Opening and closing a story",
        bullets: [
          "First, ... — the first event",
          "Then / Next / After that, ... — the middle events",
          "Finally, ... — the last event",
        ],
      },
    ],
  },

  clothes: {
    topic: "clothes",
    intro:
      "The clothes you wear, and the verbs that go with them. The trap for Spanish speakers is that some words are always plural, and that English uses \"wear\", not \"use\".",
    sections: [
      {
        title: "Basic clothes",
        examples: [
          { left: "shirt", right: "camisa" },
          { left: "T-shirt", right: "playera / camiseta" },
          { left: "pants", right: "pantalones", note: "always plural" },
          { left: "jeans", right: "jeans", note: "always plural" },
          { left: "dress", right: "vestido" },
          { left: "skirt", right: "falda" },
          { left: "jacket", right: "chaqueta" },
          { left: "coat", right: "abrigo" },
          { left: "sweater", right: "suéter" },
          { left: "shoes", right: "zapatos", note: "always plural" },
          { left: "socks", right: "calcetines", note: "always plural" },
          { left: "hat", right: "sombrero / gorro" },
        ],
      },
      {
        title: "Words that have no singular",
        body: "Pants, jeans, shorts, shoes, socks, glasses and gloves come in twos. To count them use \"a pair of\".",
        examples: [
          { left: "a pair of pants", right: "not: a pant" },
          { left: "two pairs of shoes", right: "not: two shoes pairs" },
          { left: "My jeans are new.", right: "not: My jeans is new." },
        ],
      },
      {
        title: "The verbs",
        examples: [
          { left: "wear", right: "llevar puesto — the state", note: "past: wore" },
          { left: "put on", right: "ponerse — the action of starting" },
          { left: "take off", right: "quitarse — the action of removing" },
          { left: "try on", right: "probarse (in a store)" },
          { left: "I wore a blue jacket.", right: "not: I used a blue jacket." },
        ],
      },
      {
        title: "Clothes and the weather",
        bullets: [
          "It was cold → a coat, a sweater, gloves, a scarf",
          "It was hot → shorts, a T-shirt, sandals",
          "It was raining → a raincoat, boots, an umbrella",
          "It was sunny → sunglasses, a hat",
        ],
      },
    ],
  },
};

/** The three -ed sounds, used by the ED Sound Trainer. */
export const ED_SOUND_RULES = [
  {
    sound: "/ɪd/",
    tone: "warning" as const,
    after: "After the sounds /t/ and /d/",
    detail: "This is the only one that adds an extra syllable.",
    examples: [
      { verb: "wanted", ipa: "/ˈwɑːntɪd/", why: "want ends in /t/" },
      { verb: "needed", ipa: "/ˈniːdɪd/", why: "need ends in /d/" },
      { verb: "started", ipa: "/ˈstɑːrtɪd/", why: "start ends in /t/" },
      { verb: "decided", ipa: "/dɪˈsaɪdɪd/", why: "decide ends in /d/" },
    ],
  },
  {
    sound: "/t/",
    tone: "danger" as const,
    after: "After voiceless sounds: /p/ /k/ /f/ /s/ /ʃ/ /tʃ/",
    detail: "No vibration in your throat, no extra syllable.",
    examples: [
      { verb: "worked", ipa: "/wɜːrkt/", why: "work ends in /k/" },
      { verb: "helped", ipa: "/helpt/", why: "help ends in /p/" },
      { verb: "watched", ipa: "/wɑːtʃt/", why: "watch ends in /tʃ/" },
      { verb: "kissed", ipa: "/kɪst/", why: "kiss ends in /s/" },
      { verb: "washed", ipa: "/wɑːʃt/", why: "wash ends in /ʃ/" },
      { verb: "laughed", ipa: "/læft/", why: "laugh ends in /f/" },
    ],
  },
  {
    sound: "/d/",
    tone: "success" as const,
    after: "After vowels and voiced sounds (except /d/)",
    detail: "Your throat vibrates, and there is no extra syllable.",
    examples: [
      { verb: "played", ipa: "/pleɪd/", why: "play ends in a vowel sound" },
      { verb: "cleaned", ipa: "/kliːnd/", why: "clean ends in /n/" },
      { verb: "called", ipa: "/kɔːld/", why: "call ends in /l/" },
      { verb: "lived", ipa: "/lɪvd/", why: "live ends in /v/" },
      { verb: "opened", ipa: "/ˈoʊpənd/", why: "open ends in /n/" },
    ],
  },
];
