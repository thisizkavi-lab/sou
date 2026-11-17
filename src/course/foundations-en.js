// English guidance for the existing foundation curriculum. The original
// Japanese sources remain available for a future language edition.
const section = (id, title, paragraphs, extra = {}) => ({ id, title, paragraphs, ...extra })
export const orientation = [
  section('orientation-language', 'Who would you like to talk to?', [
    'Tell a friend about your day, ask someone a question while you’re travelling, or describe a place you love in Hokkaido. Which conversation would you like to have in English?',
  ]),
  section('orientation-english', 'What could English open up for you?', [
    'Learning English is your choice. It can help you meet people while travelling, explore work in other countries, and show the parts of your personality you want people to see.',
  ]),
  section('orientation-answer', 'Start with your own reason.', [
    '**I want to talk to ___ about ___.** Fill in the blanks in Japanese or English. We can choose our first practice from there.',
  ]),
]

export const howItWorks = [
  section('how-philosophy', 'Learn a phrase in a real situation.', [
    'You’re late: **Sorry I’m late.** You missed a call: **Sorry I missed your call.** Listen and try the whole phrase. Then change it to fit what you want to say. We can look at the grammar when it helps.',
  ]),
  section('how-start-line', 'Choose where to begin.', [
    'If the alphabet already feels familiar, start with **Sounds** or a short **tongue twister**. Then try your first everyday conversation with a greeting you can use after work.',
  ]),
  section('how-two-by-two', 'Study and Practice.', [
    '**Study** shows you the situation and the expressions people use.',
    '**Practice** gives you a chance to say them aloud, then answer with your own details. Try **How was your day?** Add one real detail and ask the other person back.',
  ]),
  section('how-chapter-loop', 'Between calls.', [
    'Pick a moment you already have, like after dinner. On a day that works, take **five minutes** to listen, copy one phrase, then put the example away and answer in your own words. We’ll try a similar question next time we talk.',
  ]),
]

export const foundationReading = {
  orientation: {
    title: 'What would you like to say in English?',
    subtitle: 'For Sou. Let’s find one conversation you’d like to have in English.',
    sections: orientation,
  },
  'how-it-works': {
    title: 'How we’ll practise',
    subtitle: 'Hear a short phrase and make it your own.',
    sections: howItWorks,
  },
  letters: {
    title: 'The Alphabet',
    subtitle: 'Meet the 26 letters. See them, hear them, and give them a try.',
    sections: [
      section('letters-start', 'Welcome to the very start of English.', [
        'Every word you write in English is built from just 26 letters. That’s it. Twenty-six symbols, two shapes each — capital and small.',
        'These letters weren’t born in England. They traveled. The English alphabet came through Latin, which developed from earlier alphabets, including Greek and Phoenician. Every time you write a letter, you’re using a piece of history passed down for thousands of years.',
        'Think of letters like bricks. Alone, they’re small and simple. Put them together, and you can build anything — names, jokes, songs, stories, even entire worlds.',
        'Today, we’ll start with the 26 letters of English. You’ll see them, hear their names, say them, and get to know their shapes. Once they feel familiar, the rest will be easier to explore.',
        '**Let’s meet them all first…**',
      ]),
      section('letters-board', 'Meet all 26 letters.', [
        'Each letter has an uppercase (capital) and a lowercase (small) form. Select any letter to hear its name. The sound comes from your device’s English voice.',
      ], { widget: 'alphabet' }),
      section('letters-try', 'Watch. Say. Write.', [
        'You have met the letters. Now give them a try in three simple steps.',
        'A letter’s name is not always the sound it makes inside a word. We’ll explore those sounds later.',
      ], {
        video: [
          'MgmIHtp-ZQM',
          'The Alphabet Song | Lower Case Letters | Super Simple ABCs',
          'Super Simple ABCs / Super Simple Songs',
          20,
        ],
        items: [
          'Watch — Play the alphabet song and follow A to Z with your eyes.',
          'Say — Watch again, sing or speak along, then try a few letters without the video.',
          'Write — On paper, copy a few capital and small letters. Look away and try them once more.',
        ],
      }),
    ],
  },
  write: {
    title: 'Write the alphabet',
    subtitle: 'Give the shapes a little time on paper.',
    sections: [
      section('write-start', 'Let your hand learn the shape.', [
        'Listening and singing can help you recognize the alphabet. Writing makes you look closely at where a line begins, which direction it moves, and how a letter is formed.',
        'The aim is a clear, familiar shape. You do not need beautiful handwriting or speed. Use a pencil, an eraser, and lined paper; a guide sheet can help.',
      ]),
      section(
        'write-model',
        'Watch. Trace. Try it yourself.',
        [
          'Watch how the letters are formed, then try them on paper. Trace a letter a few times, copy it, and finally write it without looking. Practice uppercase and lowercase forms.',
        ],
        {
          items: [
            'Trace the shape a few times.',
            'Write it from memory and compare.',
            'Try both uppercase and lowercase.',
            'Add a familiar word: A, a, apple.',
          ],
        },
      ),
      section('write-names', 'Write names that mean something to you.', [
        'Begin with your own name. Names usually start with capital letters. Name order differs between languages and contexts; learn to recognize the forms you will use.',
        'Next, write a few family members’ names and the names of three to five friends. Say each name and spell it letter by letter.',
        'These are words you will use in introductions, reservations, forms, and accounts. Your letters are already doing something useful.',
      ]),
      section(
        'write-materials',
        'Keep it simple.',
        [
          'A pencil makes corrections easy. Lined paper or a beginner’s guide sheet helps you judge size and position. Typing and tapping do not replace this particular handwriting exercise.',
          'Focus on ordinary print letters first. Cursive connects letters in a flowing style, but it is optional and can come later.',
          'Do not rush toward a fixed deadline. Return for short sessions and aim for clear, recognizable forms.',
          'In Practice, you can open printable A–Z, letter tracing, and word writing worksheets. Print at 100% on A4 paper.',
        ],
      ),
    ],
  },
  sounds: {
    title: 'Letters & sounds',
    subtitle: 'You know what English looks like. Now discover what it sounds like.',
    sections: [
      section('sounds-difference', 'A letter is not a sound.', [
        'English has **26 letters**. We use them to write words. But when we speak, we use **sounds** — and there are more sounds than letters.',
        'A letter does not always make the same sound. Sometimes, two letters work together to make just one.',
        'So knowing the alphabet is only the beginning. To speak and understand English, we also need to get to know its sounds.',
      ], {
        examples: [
          ['cat / city', 'The letter c represents different sounds.'],
          ['ship', 'The letters sh represent one sound.'],
          ['know', 'We write k, but we do not pronounce it.'],
        ],
      }),
      section('sounds-reference', 'Which English sounds will we learn?', [
        'English is spoken in many countries, and people do not all pronounce it in exactly the same way. Even within the United States, pronunciation can vary from one speaker or region to another.',
        'We use **General American English** — a broad, widely recognizable pattern of American pronunciation. It gives us one clear reference to learn from and practise consistently.',
        'This does not mean every American sounds identical, or that other accents are wrong. We are simply **choosing one model to guide our learning**.',
      ]),
      section('sounds-ipa', 'How do we write a sound?', [
        'The ordinary alphabet tells us how to **spell** a word. It does not always tell us how to **pronounce** it.',
        'That is where the **International Phonetic Alphabet (IPA)** comes in. IPA uses symbols to represent speech sounds. For example, the first sound in **ship** is /ʃ/, and the first sound in **thin** is /θ/. The marks / / tell us we are looking at a sound, not a spelling.',
        '**Why do some symbols look so strange?** Some IPA symbols are familiar Latin letters. Others come from or are adapted from other alphabets, or were shaped to represent particular sounds. They are not new English letters. They simply help us write down what we hear.',
        'The sound /ʃ/ appears in **ship**, **sugar**, and **machine**, even though those words spell it differently. IPA can also show when the same word is pronounced differently in another accent.',
        'You do not need to memorize every symbol now. Think of IPA as a **map**: each symbol helps you recognize a sound when you hear it.',
      ]),
      section('sounds-listen', 'The sounds we will explore.', [
        'The chart shows **consonants** and **vowels** side by side. Vowel glides are included under Vowels; two less-common sounds appear below.',
        'There are **24 consonant entries**, **15 vowel entries**, and **2 less-common entries** — 41 rows to explore. This is a learning reference, not a claim that every American has exactly 41 distinct sounds.',
        'Click the blue speaker icon to hear the first word, or click an example to hear that entire word. The green letters highlight one spelling of the sound.',
      ]),
      section('sounds-routine', 'Listen, notice, and try.', [
        'You do not need to master every sound today. Start with one example word. Listen, say it aloud, then try another word with a similar sound.',
        'For example, compare **seat** and **sit**, or **thin** and **this**. Focus on the small difference you hear.',
        'These sounds are our starting point. As you continue, you will also learn how sounds work together in words and sentences — through **syllables, stress, rhythm, and connected speech**.',
        '**For now, let us get familiar with the sounds themselves.**',
      ]),
    ],
  },
  'tongue-intro': {
    title: 'Why tongue twisters?',
    subtitle: 'Short phrases. Careful movements. Clearer speech.',
    sections: [
      section('tongue-purpose', 'Practice one difficult movement.', [
        'A tongue twister puts similar or difficult sounds close together. That gives your tongue, lips, jaw, and airflow a repeated coordination task.',
        'A short, clear repetition is more useful than racing through a blurred sentence. These exercises support pronunciation; they do not replace listening and conversation.',
      ]),
      section(
        'tongue-contrasts',
        'Let your ear and mouth notice the difference.',
        [
          'Some contrasts may be unfamiliar in your first language. Right and light, road and load, or rice and lice can initially sound or feel alike.',
          'Give the difference time and attention. This course also includes S / SH, TH / F, word endings, consonant clusters, and rhythm.',
        ],
        {
          examples: [
            ['right / light', 'Two different initial sounds.'],
            ['road / load', 'Notice where your tongue goes.'],
            ['rice / lice', 'Keep the contrast clear before speeding up.'],
          ],
        },
      ),
      section(
        'tongue-collection',
        'A small, purposeful collection.',
        [
          'Each phrase has a target. Listen to the existing sample, notice that target, and try the phrase once or twice. You can use Practice to build it in smaller steps.',
        ],
        { widget: 'twisters' },
      ),
      section('tongue-transfer', 'Bring the movement back to everyday words.', [
        'You do not need hundreds of tongue twisters. Return to a few useful patterns and then use their movements in ordinary phrases.',
        'Listen, notice, and try. When you feel comfortable, practice L and R in one short sentence in the next lesson.',
      ]),
    ],
  },
}
export const twisterGuidance = {
  'red-lorry': [
    'Keep R and L distinct.',
    'For L, touch the ridge behind your upper front teeth. For American R, keep the tongue tip from tapping that ridge.',
  ],
  seashells: [
    'Switch between S and SH.',
    'For S, keep a narrow stream of air. For SH, draw the tongue slightly back and round the lips a little.',
  ],
  'free-throws': [
    'Move between TH and F.',
    'For TH, bring the tongue to the teeth. For F, lightly touch the lower lip to the upper teeth.',
  ],
  'peter-piper': [
    'Make a clear P without an extra vowel.',
    'Close the lips and release them. Keep the word ending short and clear.',
  ],
  'big-black-bug': [
    'Keep B and the word endings clear.',
    'Use your voice as the lips open for B. Notice where each final consonant ends.',
  ],
  'two-witches': [
    'Keep W and CH clear through a longer phrase.',
    'Round your lips for W. Release CH as a short stop followed by friction.',
  ],
  'ice-cream': [
    'Connect the consonants in SCR.',
    'Move from S to K and directly into R, without adding a vowel between them.',
  ],
  'slippery-snails': [
    'Join S to L or N.',
    'Pass straight from the S airflow into the next consonant. Keep the cluster together.',
  ],
  'fresh-flesh': [
    'Keep FR and FL distinct.',
    'Move from F into R without a tongue-tip tap; move from F into L with tongue-tip contact.',
  ],
  'betty-botter': [
    'Notice changing vowels and stronger beats.',
    'Give the important words clear stress. Let shorter words fit between them.',
  ],
  woodchuck: [
    'Fit repeated sounds into a steady rhythm.',
    'Notice the stronger content words and let the shorter connecting words stay light.',
  ],
  'unique-new-york': [
    'Move clearly from the end of unique to new.',
    'Keep the K closure, then move into N without inserting an extra vowel.',
  ],
}
