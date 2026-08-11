export type ReadingLength = "long" | "short";

export interface Reading {
  id: string;
  title: string;
  /** What the passage drills, shown as the eyebrow. */
  focus: string;
  level: 1 | 2 | 3;
  /** Long ones are stories to read through; short ones drill one rule. */
  length: ReadingLength;
  text: string;
}

/**
 * Each passage tells one small story from start to finish, and leans on the
 * grammar the exam covers, so reading it out loud doubles as revision.
 *
 * ponytail: the recogniser stops on a long silence, so ~120 words is the
 * practical ceiling per passage. Split them further if readers start timing
 * out mid-paragraph.
 */
export const READINGS: Reading[] = [
  {
    id: "rea-01",
    title: "A Saturday at home",
    focus: "Regular past verbs and -ed endings",
    level: 1,
    length: "long",
    text: "Last Saturday I woke up early and started my day slowly. First, I cleaned my room and washed all the windows. After that, I cooked breakfast for my family and we talked for almost an hour. Later, I walked to the park with my sister and we played soccer with her friends. We stayed there until six o'clock. When we arrived home, my mother had already prepared dinner. I helped her in the kitchen, and then we watched an old movie together. I really enjoyed that day, because it was simple and quiet.",
  },
  {
    id: "rea-02",
    title: "The week of bad weather",
    focus: "Weather, was and were",
    level: 1,
    length: "long",
    text: "Last week the weather was terrible in my city. On Monday it was cloudy and cold, and there was a lot of wind in the afternoon. On Tuesday it was raining from morning until night, so the streets were full of water. My brother and I were at home all day, and we were very bored. On Wednesday it was foggy and we couldn't see the mountains at all. Finally, on Saturday the sky was clear and it was sunny again. My friends were at the beach that afternoon, and they were extremely happy.",
  },
  {
    id: "rea-03",
    title: "Our trip to the mountains",
    focus: "Irregular past verbs",
    level: 2,
    length: "long",
    text: "Last July my family and I went to the mountains for a week. We took the early bus and we got there before lunch. My father bought a small map at the station, and my mother made sandwiches for everybody. On the first day we saw three lakes and we ate near the river. I lost my hat on the second morning, but I found it again in the car. In the evenings my brother wrote in his notebook and I read a long book about birds. We spent very little money, and we came home tired but happy.",
  },
  {
    id: "rea-04",
    title: "Dinner for two",
    focus: "Would like, quantifiers and countable nouns",
    level: 2,
    length: "long",
    text: "Good evening. I'd like a table for two, near the window if that is possible. Thank you. We would like some water first, and a lot of bread, please. How much is the pasta with vegetables? And how many pieces of chicken come with the second plate? My friend doesn't eat any meat, so she'd like the soup instead. We don't need much rice, just a little. Would you like to see the dessert menu later? No, thanks, we don't want any dessert tonight, but I'd like a coffee at the end.",
  },
  {
    id: "rea-05",
    title: "The dates I remember",
    focus: "Dates, ordinals and years",
    level: 2,
    length: "long",
    text: "There are four dates that I will never forget. My mother was born on March first, nineteen seventy-two, in a very small town. My father was born on August twentieth, nineteen sixty-nine. They got married on December twenty-third, nineteen ninety-four, and it was the coldest day of that winter. I was born two years later, on May third, nineteen ninety-six. My sister arrived on September twenty-first, two thousand one. Every year we celebrate all five birthdays together on the same weekend, usually the first Saturday of July.",
  },
  {
    id: "rea-06",
    title: "How I learned English",
    focus: "Sequence words with the past simple",
    level: 3,
    length: "long",
    text: "I finished high school in two thousand eighteen, and I didn't know what to do next. First, I worked for six months in a small shop near my house. After that, I moved to another city and looked for a better job. One year later, I started English classes at night, after work. At the beginning it was very difficult, because I didn't understand anything and I was afraid to speak. Then I met a teacher who changed everything for me. She never laughed at my mistakes. Two years later, I passed my first exam. Finally, I understood that slow progress is still progress.",
  },
  {
    id: "rea-07",
    title: "The night before the exam",
    focus: "Past negative with didn't",
    level: 3,
    length: "long",
    text: "I didn't sleep well the night before my exam. I didn't study enough during the week, because I didn't have any free time. On Thursday I didn't go out with my friends and I didn't watch television, but I still didn't finish the last two chapters. My sister didn't help me either, because she wasn't at home. I didn't eat dinner and I didn't call anybody. At two in the morning I closed the book and I went to bed. I didn't feel ready, but the next day the exam wasn't as hard as I expected.",
  },
  {
    id: "rea-08",
    title: "The coldest morning",
    focus: "Clothes, countable and uncountable nouns",
    level: 3,
    length: "long",
    text: "It was snowing when I woke up, so I put on a heavy coat, a thick sweater and two pairs of socks. I looked for my black boots, but I didn't find them, and I didn't have any gloves either. I drank a cup of coffee and I ate two slices of bread very quickly. There wasn't much time left. I took an umbrella, because there was a lot of snow outside, and I left the house at seven. My hands were freezing all morning, and I promised myself that I would buy some gloves that same afternoon.",
  },

  /* ---- Short drills: two or three sentences on a single rule ----------- */

  {
    id: "rea-s1",
    title: "Ordering politely",
    focus: "Would like",
    level: 1,
    length: "short",
    text: "I'd like a table for two, please. Would you like some water? No, thanks.",
  },
  {
    id: "rea-s2",
    title: "In the kitchen",
    focus: "Countable and uncountable nouns",
    level: 1,
    length: "short",
    text: "She bought some bread, two eggs and a bottle of milk. She didn't buy any cheese.",
  },
  {
    id: "rea-s3",
    title: "Asking about quantity",
    focus: "How much and how many",
    level: 1,
    length: "short",
    text: "How much furniture does the tent have? How many beds do we need? Not many.",
  },
  {
    id: "rea-s4",
    title: "Saying no to everything",
    focus: "Past negative",
    level: 2,
    length: "short",
    text: "I didn't play baseball and I didn't speak English. She didn't work at the studio.",
  },
  {
    id: "rea-s5",
    title: "Six verbs that break the rule",
    focus: "Irregular past verbs",
    level: 2,
    length: "short",
    text: "I went, I bought, I saw, I took, I thought and I wrote. None of them end in -ed.",
  },
  {
    id: "rea-s6",
    title: "One thing after another",
    focus: "Sequence words",
    level: 2,
    length: "short",
    text: "First, I finished school. After that, I moved away. One year later, I found a job.",
  },
  {
    id: "rea-s7",
    title: "The three -ed sounds",
    focus: "-ed pronunciation",
    level: 3,
    length: "short",
    text: "Worked, helped and washed. Wanted, needed and visited. Played, cleaned and lived.",
  },
  {
    id: "rea-s8",
    title: "Asking the right question",
    focus: "WH questions",
    level: 3,
    length: "short",
    text: "Where were you yesterday? When was your birthday? Why were you late? Who called you?",
  },
];
