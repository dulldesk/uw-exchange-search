const exclude_dest = ['Australia']

export const DEFAULT_PARAMS = {
  term: 'Winter',
  faculty: ['5'],
  louder: false,
  courses: false,
}

export const filters = {
  exclude: {
    dest: exclude_dest,
  },
  include: {
    fall: {
      startMonths: ['August', 'September', 'October'],
      endMonths: ['November', 'December'],
    },
    winter: {
      startMonths: ['January', 'February'],
      endMonths: ['March', 'April', 'May'],
    },
  },
}

export const QUERY_OPTIONS = {
  'Faculty': {
    'Health': 1,
    'Arts': 2,
    'Engineering': 3,
    'Environment': 4,
    'Mathematics': 5,
    'Science': 6,
    'Engineering-G': 7,
  },
  'Type': {
    'Exchange': '"0060"'
  }
}

/*
destination codes:
---
AU
AT
BB
CN
CZ
DK
3  (england)
FI
FR
DE
GR
HK
IN
IE (ireland)
IT
JM
JP
MY
NL
4 (northern ireland)
NO
15 (scotland)
SG
32 (south korea)
ES
SE (sweden)
CH
17 (taiwan)
TT
TR
VN (vietnam)
*/
