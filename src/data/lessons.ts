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

  countable: {
    topic: "countable",
    intro:
      "Some nouns you can count one by one, and some you cannot. English cares about the difference, because it changes the plural, the article, and which words you may put in front.",
    sections: [
      {
        title: "Countable: singular or plural",
        body: "You can put a number in front of them.",
        examples: [
          { left: "an egg", right: "two eggs" },
          { left: "a bed", right: "three beds" },
          { left: "a vegetable", right: "some vegetables" },
        ],
      },
      {
        title: "Uncountable: singular only",
        body: "No plural -s, and never a number in front. They take a singular verb.",
        examples: [
          { left: "bread", right: "not: two breads" },
          { left: "milk", right: "not: milks" },
          { left: "furniture", right: "The furniture is new.", note: "singular verb" },
          { left: "rice · water · money · information · homework", right: "all uncountable" },
        ],
      },
      {
        title: "some in positives, any in negatives",
        body: "This works for uncountable nouns and for plural countable nouns alike.",
        examples: [
          { left: "Jean buys some pasta.", right: "She doesn't have any bread." },
          { left: "She bought some vegetables.", right: "She didn't buy any eggs." },
        ],
      },
      {
        title: "Counting the uncountable",
        body: "When you really need a number, count the container or the piece, not the noun.",
        bullets: [
          "a slice of bread · two slices of bread",
          "a glass of milk · a cup of coffee",
          "a piece of furniture · a piece of information",
          "a bottle of water · a kilo of rice",
        ],
      },
    ],
  },

  quantifiers: {
    topic: "quantifiers",
    intro:
      "How much and How many both ask about quantity. Which one you pick depends only on whether the noun can be counted.",
    sections: [
      {
        title: "The choice",
        examples: [
          { left: "How much furniture does the tent have?", right: "uncountable → How much" },
          { left: "How many beds do we need?", right: "countable → How many" },
        ],
      },
      {
        title: "Answering, from nothing to plenty",
        body: "The same ladder works for both, only the quantifier changes.",
        examples: [
          { left: "It doesn't have any furniture.", right: "We don't need any beds.", note: "none" },
          { left: "Not much. It doesn't have much furniture.", right: "Not many. We don't need many beds.", note: "a little" },
          { left: "It has some furniture.", right: "We need some beds.", note: "a medium amount" },
          { left: "It has a lot of furniture!", right: "We need a lot of beds.", note: "plenty" },
        ],
      },
      {
        title: "a lot of works for both",
        body: "That is why it is the safe one when you are unsure. Much and many are the ones that force you to choose.",
        examples: [
          { left: "a lot of money", right: "uncountable" },
          { left: "a lot of friends", right: "countable" },
        ],
      },
      {
        title: "Where much and many live",
        body: "In everyday English much and many sound most natural in questions and negatives. Positive sentences usually take a lot of.",
        examples: [
          { left: "Do you have much time?", right: "question" },
          { left: "I don't have much time.", right: "negative" },
          { left: "I have a lot of time.", right: "positive — not: I have much time" },
        ],
      },
      {
        title: "a few and a little: a small amount",
        body: "Both are for positive sentences. Again, the noun decides.",
        examples: [
          { left: "I went to the restaurant with a few friends.", right: "a few + countable" },
          { left: "I only have a little time.", right: "a little + uncountable" },
          { left: "There were lots of / a lot of fish around us.", right: "big amount, both kinds" },
        ],
      },
    ],
  },

  wouldLike: {
    topic: "wouldLike",
    intro:
      "Would like is the polite way to say want. It is the same for every subject, and it is what you use to order, to offer, and to ask what somebody wants.",
    sections: [
      {
        title: "The form",
        body: "Would + subject + like + noun or to + verb.",
        examples: [
          { left: "Would you like to meet for dinner?", right: "Yes, please. / No, thanks." },
          { left: "What would you like to do today?", right: "I'd like to see the city." },
          { left: "Would you like some coffee?", right: "noun straight after like" },
        ],
      },
      {
        title: "'d like is the short form",
        body: "Same for I, you, he, she, it, we and they — would never changes.",
        examples: [
          { left: "I'd like to visit the office.", right: "I would like" },
          { left: "Michael would like to show him the city.", right: "he would like" },
          { left: "They'd like a table for two.", right: "they would like" },
        ],
      },
      {
        title: "Would like is not like",
        body: "This is the trap. Like talks about what you enjoy in general; would like talks about what you want right now.",
        examples: [
          { left: "I like coffee.", right: "I enjoy it, always" },
          { left: "I'd like a coffee.", right: "bring me one now" },
        ],
      },
      {
        title: "The mistakes that cost points",
        bullets: [
          "I'd like to go — not: I'd like go (keep the to)",
          "Would you like a coffee? — not: Do you would like",
          "She would like — not: She would likes (would never takes -s)",
          "The negative is I wouldn't like, not I don't would like",
        ],
      },
    ],
  },

  partsOfSpeech: {
    topic: "partsOfSpeech",
    intro:
      "If you know whether a word is a verb, a noun or an adjective, the sentence is easier to understand — and you can often guess a word you have never seen.",
    sections: [
      {
        title: "The three you need",
        examples: [
          { left: "verb", right: "an action: has, eat, grow, kill" },
          { left: "noun", right: "a person, place or thing: bagel, farmer, menu" },
          { left: "adjective", right: "describes a noun: new, fiery, hot" },
        ],
      },
      {
        title: "Subject → verb → object",
        body: "Most English sentences follow this order. The subject and the object are nouns.",
        examples: [
          { left: "Einstein Brothers Bagels", right: "subject (noun)" },
          { left: "has", right: "verb" },
          { left: "a new bagel", right: "object (adjective + noun)" },
        ],
      },
      {
        title: "Position gives it away",
        bullets: [
          "After a / an / the → a noun, or an adjective and then a noun: a new bagel",
          "Before a noun → an adjective: a fiery pepper",
          "After can, don't, did or to → a verb: it can kill you",
          "After very, really, extremely → an adjective: extremely fiery",
        ],
      },
      {
        title: "Guess the meaning from context",
        body: "First decide the part of speech, then use the rest of the sentence.",
        examples: [
          { left: "The soup was so scalding I burned my tongue.", right: "adjective → very hot" },
          { left: "Don't gobble your food. Eat slowly!", right: "verb → eat very fast" },
          { left: "I took a bite. / Dogs can bite.", right: "same word: noun, then verb" },
        ],
      },
    ],
  },

  intensifiers: {
    topic: "intensifiers",
    intro:
      "Quite, very and really go before adjectives to make your writing more interesting. They change how strong the adjective is.",
    sections: [
      {
        title: "very and really: stronger",
        examples: [
          { left: "That restaurant is very expensive.", right: "= really expensive" },
          { left: "We'll spend hundreds of dollars!", right: "more than normal" },
        ],
      },
      {
        title: "quite: less strong",
        examples: [
          { left: "The atmosphere was quite relaxed.", right: "relaxed, but not extremely" },
          { left: "The movie was quite good.", right: "good, not great" },
        ],
      },
      {
        title: "The position",
        body: "The adverb goes right before the adjective. With a noun, a / an comes first.",
        examples: [
          { left: "The food was very good.", right: "not: good very" },
          { left: "We had a really good meal.", right: "not: really a good meal" },
        ],
      },
      {
        title: "Small traps",
        bullets: [
          "One adverb is enough: very slow — not quite very slow",
          "Really can also go before a verb: I really like it. Very cannot — never I very like it",
        ],
      },
    ],
  },

  thereIsAre: {
    topic: "thereIsAre",
    intro:
      "There is and There are say that something exists in a place — the English for hay. Use There is with singular nouns and There are with plural nouns.",
    sections: [
      {
        title: "Positive and negative",
        examples: [
          { left: "There's a curved wall in every room.", right: "There isn't a corner in the whole house!" },
          { left: "There are trees on the roof.", right: "There aren't any corners in the house." },
        ],
      },
      {
        title: "Questions and short answers",
        body: "Swap the two words. Positive short answers never use the short form.",
        examples: [
          { left: "Is there a curved wall in every room?", right: "Yes, there is. / No, there isn't." },
          { left: "Are there any corners in the house?", right: "Yes, there are. / No, there aren't." },
        ],
      },
      {
        title: "Remember",
        bullets: [
          "There's = There is. Yes, there is — not Yes, there's",
          "some in positives, any in negatives and questions",
          "Uncountable nouns take There is: There is some milk, There is a lot of furniture",
          "There (hay) · their (de ellos) · they're (they are)",
        ],
      },
    ],
  },

  presentContinuous: {
    topic: "presentContinuous",
    intro:
      "The present continuous talks about actions happening now, or about the situation around now: am / is / are + verb-ing.",
    sections: [
      {
        title: "The form",
        examples: [
          { left: "I'm making a dress.", right: "I am" },
          { left: "She's learning to bake.", right: "he / she / it is" },
          { left: "We're starting to make our own things.", right: "we / you / they are" },
        ],
      },
      {
        title: "Wh- questions",
        body: "Question word + be + subject + -ing.",
        examples: [
          { left: "What are you making right now?", right: "I'm making a dress for my daughter." },
          { left: "Why is she crying?", right: "She's watching a sad movie." },
        ],
      },
      {
        title: "Yes / no questions",
        body: "Short answers use be — and the full form in positives.",
        examples: [
          { left: "Is your brother learning how to bake?", right: "Yes, he is. / No, he isn't." },
          { left: "Are you working today?", right: "Yes, I am. / No, I'm not." },
        ],
      },
      {
        title: "-ing spelling",
        bullets: [
          "Most verbs add -ing: work → working, study → studying",
          "Ending in -e: drop the e → make → making, write → writing",
          "Consonant + vowel + consonant: double it → run → running, sit → sitting, swim → swimming",
        ],
      },
    ],
  },

  toInfinitive: {
    topic: "toInfinitive",
    intro:
      "Sometimes a second verb follows the main verb. After verbs like want, need and plan, the second verb takes to.",
    sections: [
      {
        title: "Subject + verb + to + verb",
        examples: [
          { left: "I would like to study computer programming.", right: "would like to" },
          { left: "He wants to take cooking classes.", right: "wants to" },
          { left: "We needed to improve our writing skills.", right: "needed to" },
        ],
      },
      {
        title: "Only the first verb changes",
        body: "The first verb changes with the subject or the tense. The to verb never changes.",
        examples: [
          { left: "She wants to learn.", right: "not: She wants to learns" },
          { left: "We decided to go.", right: "not: We decided to went" },
        ],
      },
      {
        title: "Verbs that often take to",
        bullets: ["want · like · would like · need · plan · decide"],
      },
      {
        title: "Not with can, should, must",
        body: "These go straight to the verb, with no to.",
        examples: [
          { left: "You can come with us.", right: "not: can to come" },
          { left: "You should study.", right: "not: should to study" },
        ],
      },
    ],
  },

  presentVsContinuous: {
    topic: "presentVsContinuous",
    intro:
      "Both tenses talk about the present, but not the same present. The simple present is for what is always true or happens regularly; the present continuous is for what is happening now.",
    sections: [
      {
        title: "The difference",
        examples: [
          { left: "People often pay a lot of money for paintings.", right: "fact, habit, routine → simple present" },
          { left: "Today we're talking about expensive paintings.", right: "now or around now → present continuous" },
          { left: "She works in a bank, but this week she's working from home.", right: "both in one sentence" },
        ],
      },
      {
        title: "Time expressions: simple present",
        body: "These usually go before the main verb.",
        bullets: ["always · usually · often · sometimes · never", "She always walks to school."],
      },
      {
        title: "Time expressions: present continuous",
        bullets: ["right now · at the moment · Look! · Listen!", "I'm studying for an exam at the moment."],
      },
      {
        title: "Time expressions: both",
        bullets: ["now · these days · today"],
      },
    ],
  },

  haveTo: {
    topic: "haveTo",
    intro:
      "Have to talks about rules, or about things that are necessary. Don't have to means there is a choice — it is not necessary, but you can if you want.",
    sections: [
      {
        title: "Positive",
        examples: [
          { left: "I have to go to the ATM.", right: "I / you / we / they have to" },
          { left: "He has to work tonight.", right: "he / she / it has to" },
        ],
      },
      {
        title: "Negative: not necessary",
        examples: [
          { left: "I don't have to work until later.", right: "I / you / we / they" },
          { left: "She doesn't have to study tonight.", right: "he / she / it" },
        ],
      },
      {
        title: "Questions use do / does",
        examples: [
          { left: "Do you have to study tonight?", right: "Yes, I do." },
          { left: "Does she have to work tonight?", right: "No, she doesn't." },
        ],
      },
      {
        title: "The mistakes that cost points",
        bullets: [
          "After doesn't or does, it is have again: She doesn't have to — not doesn't has to",
          "Have to + base verb: have to go — not have to going",
          "Questions need do: Do you have to…? — not Have you to…?",
          "Don't have to ≠ prohibited. It only means not necessary",
        ],
      },
    ],
  },

  should: {
    topic: "should",
    intro:
      "Should and shouldn't ask for advice and give it. Should is the same for every subject and goes straight to the verb, with no to.",
    sections: [
      {
        title: "Giving advice",
        examples: [
          { left: "You should visit Monaco if you love languages.", right: "good idea" },
          { left: "You shouldn't visit in the winter. It rains a lot.", right: "bad idea" },
        ],
      },
      {
        title: "Asking for advice",
        examples: [
          { left: "Should I bring a jacket?", right: "Yes, you should. It's always cool in the evening." },
          { left: "What should I do?", right: "You should call the embassy." },
        ],
      },
      {
        title: "Should or have to?",
        body: "Should is a recommendation. Have to is a rule.",
        examples: [
          { left: "You should try the local food.", right: "advice" },
          { left: "You have to show your passport.", right: "rule" },
        ],
      },
      {
        title: "The mistakes that cost points",
        bullets: [
          "should + base verb: You should study — not should to study, not should studies",
          "Negative: shouldn't — not don't should",
          "Question: Should I…? — not Do I should…?",
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
