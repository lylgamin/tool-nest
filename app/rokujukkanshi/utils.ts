const JIKKAN       = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const
const JIKKAN_YOMI  = ['きのえ','きのと','ひのえ','ひのと','つちのえ',
                      'つちのと','かのえ','かのと','みずのえ','みずのと'] as const
const JUNISHI      = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const
const JUNISHI_YOMI = ['ね','うし','とら','う','たつ','み',
                      'うま','ひつじ','さる','とり','いぬ','い'] as const

export type KanshiResult = {
  kanshi: string
  yomi: string
  stem: string
  branch: string
  stemYomi: string
  branchYomi: string
  cycleIndex: number
}

// stem  = ((year - 4) % 10 + 10) % 10
// branch= ((year - 4) % 12 + 12) % 12
// cycle = ((year - 4) % 60 + 60) % 60 + 1  (1-60)
export function getKanshi(year: number): KanshiResult {
  const stemIdx   = ((year - 4) % 10 + 10) % 10
  const branchIdx = ((year - 4) % 12 + 12) % 12
  const cycleIndex = ((year - 4) % 60 + 60) % 60 + 1
  return {
    kanshi:     JIKKAN[stemIdx] + JUNISHI[branchIdx],
    yomi:       JIKKAN_YOMI[stemIdx] + JUNISHI_YOMI[branchIdx],
    stem:       JIKKAN[stemIdx],
    branch:     JUNISHI[branchIdx],
    stemYomi:   JIKKAN_YOMI[stemIdx],
    branchYomi: JUNISHI_YOMI[branchIdx],
    cycleIndex,
  }
}

// 全60干支のリストを返す (cycleIndex 1→60)
export function getAllKanshi(): Array<KanshiResult & { baseYear: number }> {
  return Array.from({ length: 60 }, (_, i) => ({
    ...getKanshi(4 + i),
    baseYear: 4 + i,
  }))
}
