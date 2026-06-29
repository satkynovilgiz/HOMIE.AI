export const VIDEO_DB = [
  { id: 'NybHckSEQBI', title: "Math isn't hard, it's a language", channel: 'TEDx', subj: 'math', tags: ['math','algebra','numbers'] },
  { id: 'WUvTyaaNkzM', title: 'The Map of Mathematics', channel: 'Domain of Science', subj: 'math', tags: ['math','overview'] },
  { id: 'LPZh9BOjkQs', title: 'Calculus at a Fifth Grade Level', channel: 'Socratica', subj: 'math', tags: ['calculus','derivatives','integrals'] },
  { id: 'OmJ-4B-mS-Y', title: 'What is Linear Algebra?', channel: '3Blue1Brown', subj: 'math', tags: ['linear algebra','vectors','matrices'] },
  { id: 'rfscVS0vtbw', title: 'Learn Python Full Course', channel: 'freeCodeCamp', subj: 'coding', tags: ['python','programming'] },
  { id: 'PkZNo7MFNFg', title: 'Learn JavaScript Full Course', channel: 'freeCodeCamp', subj: 'coding', tags: ['javascript','web','coding'] },
  { id: 'SqcY0GlETPk', title: 'React Tutorial for Beginners', channel: 'Mosh', subj: 'coding', tags: ['react','javascript','frontend'] },
  { id: '9N5VHPJN-Y',  title: 'What is an API?', channel: 'MuleSoft', subj: 'coding', tags: ['api','rest','web'] },
  { id: 'zR3Igc3Rhfg', title: 'What Is Quantum Mechanics?', channel: 'Kurzgesagt', subj: 'science', tags: ['quantum','physics','science'] },
  { id: 'Qe5WT22-AO8', title: 'The Immune System Explained', channel: 'Kurzgesagt', subj: 'science', tags: ['immune system','biology','cells'] },
  { id: 'IFKnq9QM6_A', title: 'How CRISPR lets us edit our DNA', channel: 'TED', subj: 'science', tags: ['crispr','dna','genetics'] },
  { id: 'IuqDzHEh-Sc', title: 'The French Revolution Explained', channel: 'Overly Sarcastic', subj: 'history', tags: ['french revolution','history','europe'] },
  { id: 'xuCn8ux2gbs', title: 'World War II in 7 Minutes', channel: 'History Hit', subj: 'history', tags: ['ww2','war','history'] },
  { id: 'Q10_srZ-pbs', title: 'What is Gravity?', channel: 'Kurzgesagt', subj: 'physics', tags: ['gravity','physics','space'] },
  { id: 'ZJZL-XTK8b4', title: 'Special Relativity in 7 mins', channel: 'Tibees', subj: 'physics', tags: ['relativity','einstein','physics'] },
  { id: 'VEiMpqzqkqk', title: 'How DNA Works', channel: 'Stated Clearly', subj: 'biology', tags: ['dna','genetics','cells'] },
  { id: 's5Lj2Fdfxnk', title: 'How Evolution Works', channel: 'Kurzgesagt', subj: 'biology', tags: ['evolution','darwin'] },
  { id: 'bka20Q9TN6M', title: 'Periodic Table Explained', channel: 'TED-Ed', subj: 'chemistry', tags: ['periodic table','elements','chemistry'] },
  { id: 'FSyAehMdpyI', title: 'Chemical Bonds Explained', channel: 'Professor Dave', subj: 'chemistry', tags: ['bonds','chemistry','molecules'] },
]

export function findVideo(searchTerm) {
  const term = searchTerm.toLowerCase()
  let best = null, bestScore = 0
  for (const v of VIDEO_DB) {
    let score = 0
    for (const t of term.split(' ')) {
      if (v.title.toLowerCase().includes(t)) score += 3
      if (v.subj === t) score += 5
      for (const tag of v.tags) { if (tag.includes(t) || t.includes(tag)) score += 2 }
    }
    if (score > bestScore) { bestScore = score; best = v }
  }
  return bestScore > 0 ? best : VIDEO_DB[Math.floor(Math.random() * VIDEO_DB.length)]
}

export function filterVideos(filter, search) {
  let vids = VIDEO_DB
  if (search) {
    const q = search.toLowerCase()
    vids = vids.filter(v =>
      v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q) ||
      v.subj.includes(q) || v.tags.some(t => t.includes(q) || q.includes(t))
    )
  } else if (filter !== 'all') {
    vids = vids.filter(v => v.subj === filter)
  }
  return vids
}
