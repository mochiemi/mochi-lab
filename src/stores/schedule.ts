import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ClassItem {
  day: string
  time: string
  subject: string
  code: string
  practicalClass?: string
  room: string
  professor: string
  period: number
  type: 'required' | 'elective' | 'optional'
  details?: {
    credits: string
    description: string
  }
}

export const useScheduleStore = defineStore('schedule', () => {
  const allClasses = ref<ClassItem[]>([

    {
      day: 'Segunda',
      time: '16:00 - 17:00',
      subject: 'Metodologia Científica aplicada à saúde',
      code: 'DF228',
      practicalClass: 'A',
      room: 'AL-V-303 (02/03/2026 a 13/07/2026, semanalmente)',
      professor: 'Luiz Carlos do Nascimento', 
      period: 3,
      type: 'required',
      details: {
        credits: '1 crédito',
        description: 'Introdução à metodologia científica aplicada à área da saúde. Elaboração de projetos de pesquisa, normas técnicas, busca bibliográfica e análise crítica de artigos científicos.'
      }
    },
    {
      day: 'Terça',
      time: '13:00 - 14:00',
      subject: 'Físico-química',
      code: 'DF227',
      practicalClass: 'A',
      room: 'AL-PCA-203 (03/03/2026 a 14/07/2026, semanalmente)',
      professor: 'Yara Luiza Coelho Zampier',
      period: 3,
      type: 'required',
      details: {
        credits: '5 créditos (2T + 3P)',
        description: 'Termodinâmica, equilíbrio químico, cinética química, fenômenos de superfície e sistemas dispersos.'
      }
    },
    {
      day: 'Terça',
      time: '14:00 - 15:00',
      subject: 'Físico-química',
      code: 'DF227',
      practicalClass: 'A',
      room: 'AL-PCA-203 (03/03/2026 a 14/07/2026, semanalmente)',
      professor: 'Yara Luiza Coelho Zampier',
      period: 3,
      type: 'required',
      details: {
        credits: '5 créditos (2T + 3P)',
        description: 'Termodinâmica, equilíbrio químico, cinética química, fenômenos de superfície e sistemas dispersos.'
      }
    },
    {
      day: 'Quarta',
      time: '07:00 - 08:00',
      subject: 'Físico-química',
      code: 'DF227',
      practicalClass: 'A',
      room: 'AL-PCA-204 (04/03/2026 a 15/07/2026, semanalmente)',
      professor: 'Yara Luiza Coelho Zampier',
      period: 3,
      type: 'required',
      details: {
        credits: '5 créditos (2T + 3P)',
        description: 'Termodinâmica, equilíbrio químico, cinética química, fenômenos de superfície e sistemas dispersos.'
      }
    },
    {
      day: 'Quarta',
      time: '15:00 - 16:00',
      subject: 'Físico-química - Prática T2',
      code: 'DF227',
      practicalClass: 'A',
      room: 'AL-Q-208 (04/03/2026 a 15/07/2026, semanalmente)',
      professor: 'Luciano Sindra Virtuoso',
      period: 3,
      type: 'required',
      details: {
        credits: '5 créditos (2T + 3P)',
        description: 'Termodinâmica, equilíbrio químico, cinética química, fenômenos de superfície e sistemas dispersos.'
      }
    },
    {
      day: 'Quarta',
      time: '16:00 - 17:00',
      subject: 'Físico-química - Prática T2',
      code: 'DF227',
      practicalClass: 'A',
      room: 'AL-Q-208 (04/03/2026 a 15/07/2026, semanalmente)',
      professor: 'Luciano Sindra Virtuoso',
      period: 3,
      type: 'required',
      details: {
        credits: '5 créditos (2T + 3P)',
        description: 'Termodinâmica, equilíbrio químico, cinética química, fenômenos de superfície e sistemas dispersos.'
      }
    },
    {
      day: 'Sexta',
      time: '09:00 - 10:00',
      subject: 'Deontologia e Legislação Farmacêutica',
      code: 'DF223',
      practicalClass: 'A',
      room: 'AL-PCA-204 (06/03/2026 a 10/07/2026, semanalmente)',
      professor: 'Luciene Alves Moreira Marques',
      period: 3,
      type: 'required',
      details: {
        credits: '2 créditos',
        description: 'Ética profissional, legislação farmacêutica, código de ética, direitos e deveres do farmacêutico.'
      }
    },
    {
      day: 'Sexta',
      time: '10:00 - 11:00',
      subject: 'Deontologia e Legislação Farmacêutica',
      code: 'DF223',
      practicalClass: 'A',
      room: 'AL-PCA-204 (06/03/2026 a 10/07/2026, semanalmente)',
      professor: 'Luciene Alves Moreira Marques',
      period: 3,
      type: 'required',
      details: {
        credits: '2 créditos',
        description: 'Ética profissional, legislação farmacêutica, código de ética, direitos e deveres do farmacêutico.'
      }
    },
    {
      day: 'Quinta',
      time: '15:00 - 16:00',
      subject: 'Química Analítica',
      code: 'DCE415',
      practicalClass: 'A',
      room: 'AL-PCA-204 (05/03/2026 a 16/07/2026, semanalmente)',
      professor: 'Mariane Gonçalves Santos',
      period: 4,
      type: 'required',
      details: {
        credits: '4 créditos',
        description: 'Equilíbrio químico em soluções, métodos clássicos de análise, volumetria e gravimetria.'
      }
    },
    {
      day: 'Quinta',
      time: '16:00 - 17:00',
      subject: 'Química Analítica',
      code: 'DCE415',
      practicalClass: 'A',
      room: 'AL-PCA-204 (05/03/2026 a 16/07/2026, semanalmente)',
      professor: 'Mariane Gonçalves Santos',
      period: 4,
      type: 'required',
      details: {
        credits: '4 créditos',
        description: 'Equilíbrio químico em soluções, métodos clássicos de análise, volumetria e gravimetria.'
      }
    },
    {
      day: 'Sexta',
      time: '13:00 - 14:00',
      subject: 'Química Analítica',
      code: 'DCE415',
      practicalClass: 'A',
      room: 'AL-PCA-203 (06/03/2026 a 10/07/2026, semanalmente)',
      professor: 'Mariane Gonçalves Santos',
      period: 4,
      type: 'required',
      details: {
        credits: '4 créditos',
        description: 'Equilíbrio químico em soluções, métodos clássicos de análise, volumetria e gravimetria.'
      }
    },
    {
      day: 'Sexta',
      time: '14:00 - 15:00',
      subject: 'Química Analítica',
      code: 'DCE415',
      practicalClass: 'A',
      room: 'AL-PCA-203 (06/03/2026 a 10/07/2026, semanalmente)',
      professor: 'Mariane Gonçalves Santos',
      period: 4,
      type: 'required',
      details: {
        credits: '4 créditos',
        description: 'Equilíbrio químico em soluções, métodos clássicos de análise, volumetria e gravimetria.'
      }
    },
    {
      day: 'Terça',
      time: '09:00 - 10:00',
      subject: 'Bromatologia',
      code: 'DF239',
      practicalClass: 'A',
      room: 'AL-PCA-301 (03/03/2026 a 14/07/2026, semanalmente)',
      professor: 'Ana Lúcia Leite Moraes<br>Sarah Magalhães Ribeiro Mata',
      period: 6,
      type: 'required',
      details: {
        credits: '4 créditos (2T + 2P)',
        description: 'Análise de alimentos, composição centesimal, valor nutricional, adulterantes e fraudes.'
      }
    },
    {
      day: 'Terça',
      time: '10:00 - 11:00',
      subject: 'Bromatologia',
      code: 'DF239',
      practicalClass: 'A',
      room: 'AL-PCA-301 (03/03/2026 a 14/07/2026, semanalmente)',
      professor: 'Ana Lúcia Leite Moraes<br>Sarah Magalhães Ribeiro Mata',
      period: 6,
      type: 'required',
      details: {
        credits: '4 créditos (2T + 2P)',
        description: 'Análise de alimentos, composição centesimal, valor nutricional, adulterantes e fraudes.'
      }
    },
    {
      day: 'Quinta',
      time: '13:00 - 14:00',
      subject: 'Bromatologia - Prática',
      code: 'DF239',
      practicalClass: 'A',
      room: 'AL-S-209 (05/03/2026 a 16/07/2026, semanalmente)',
      professor: 'Ana Lúcia Leite Moraes<br>Sarah Magalhães Ribeiro Mata',
      period: 6,
      type: 'required',
      details: {
        credits: '4 créditos (2T + 2P)',
        description: 'Análise de alimentos, composição centesimal, valor nutricional, adulterantes e fraudes.'
      }
    },
    {
      day: 'Quinta',
      time: '14:00 - 15:00',
      subject: 'Bromatologia - Prática',
      code: 'DF239',
      practicalClass: 'A',
      room: 'AL-S-209 (05/03/2026 a 16/07/2026, semanalmente)',
      professor: 'Ana Lúcia Leite Moraes<br>Sarah Magalhães Ribeiro Mata',
      period: 6,
      type: 'required',
      details: {
        credits: '4 créditos (2T + 2P)',
        description: 'Análise de alimentos, composição centesimal, valor nutricional, adulterantes e fraudes.'
      }
    },
    {
      day: 'Quarta',
      time: '09:00 - 10:00',
      subject: 'Tecnologia de Alimentos',
      code: 'DF240',
      practicalClass: 'A',
      room: 'AL-PCA-301 (04/03/2026 a 15/07/2026, semanalmente)',
      professor: 'Sílvia Silveira Clarêto',
      period: 6,
      type: 'required',
      details: {
        credits: '2 créditos',
        description: 'Processamento e conservação de alimentos, operações unitárias, embalagens e aditivos.'
      }
    },
    {
      day: 'Quarta',
      time: '10:00 - 11:00',
      subject: 'Tecnologia de Alimentos',
      code: 'DF240',
      practicalClass: 'A',
      room: 'AL-PCA-301 (04/03/2026 a 15/07/2026, semanalmente)',
      professor: 'Sílvia Silveira Clarêto',
      period: 6,
      type: 'required',
      details: {
        credits: '2 créditos',
        description: 'Processamento e conservação de alimentos, operações unitárias, embalagens e aditivos.'
      }
    },
    {
      day: 'Terça',
      time: '16:00 - 17:00',
      subject: 'Farmácia Integrada - Acompanhamento Didático',
      code: 'DF309',
      practicalClass: 'T1',
      room: 'AL-O-312 (03/03/2026 a 14/07/2026, semanalmente)',
      professor: 'Angélica Rosa Faria',
      period: 0,
      type: 'elective',
      details: {
        credits: '1 crédito',
        description: 'Integração de conteúdos farmacêuticos, estudos de casos clínicos, acompanhamento didático.'
      }
    }
  ])

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  const getClassesByPeriod = (period: number | 'all' = 'all'): ClassItem[] => {
    if (period === 'all') return allClasses.value
    return allClasses.value.filter(c => c.period === period)
  }

  const getClassesByType = (type: 'required' | 'elective' | 'optional'): ClassItem[] => {
    return allClasses.value.filter(c => c.type === type)
  }

  const classesByDay = computed((): Map<string, ClassItem[]> => {
    const map = new Map<string, ClassItem[]>()
    weekDays.forEach(day => map.set(day, []))
    
    allClasses.value.forEach(c => {
      const dayClasses = map.get(c.day)
      if (dayClasses) {
        dayClasses.push(c)
      }
    })

    // Ordenar por horário
    map.forEach((classes) => {
      classes.sort((a, b) => a.time.localeCompare(b.time))
    })

    return map
  })

  const allTimeSlots = computed((): string[] => {
    const slots = new Set<string>()
    allClasses.value.forEach(c => slots.add(c.time))
    return Array.from(slots).sort((a, b) => {
      const hourA = parseInt(a.split(':')[0] || '0')
      const hourB = parseInt(b.split(':')[0] || '0')
      return hourA - hourB
    })
  })

  const classMatrix = computed((): Record<string, Record<string, ClassItem | null>> => {
    const matrix: Record<string, Record<string, ClassItem | null>> = {}
    
    weekDays.forEach(day => {
      matrix[day] = {}
      allTimeSlots.value.forEach(slot => {
        matrix[day]![slot] = null
      })
    })

    allClasses.value.forEach(c => {
      if (matrix[c.day] && matrix[c.day]![c.time] === null) {
        matrix[c.day]![c.time] = c
      }
    })
    
    return matrix
  })

  const getClassesByDay = (day: string): ClassItem[] => {
    return classesByDay.value.get(day) || []
  }

  const getClassAtTimeSlot = (day: string, timeSlot: string): ClassItem | null => {
    const dayMatrix = classMatrix.value[day]
    if (!dayMatrix) return null
    return dayMatrix[timeSlot] || null
  }

  const totalClasses = computed((): number => allClasses.value.length)
  
  const totalSubjects = computed((): number => {
    const subjects = new Set(allClasses.value.map(c => c.code))
    return subjects.size
  })

  const getTodayClasses = (): ClassItem[] => {
    const today = new Date()
    const weekDaysMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const todayName = weekDaysMap[today.getDay()] || 'Domingo'
    return getClassesByDay(todayName)
  }

  const getNextClass = (): ClassItem | null => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    const weekDaysMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const todayName = weekDaysMap[now.getDay()] || 'Domingo'
    const todayClasses = getClassesByDay(todayName)
    
    // Encontrar próxima aula de hoje
    const nextToday = todayClasses.find(c => c.time > currentTimeStr)
    if (nextToday) return nextToday

    const todayIndex = weekDaysMap.indexOf(todayName)
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7
      const nextDayName = weekDaysMap[nextDayIndex] || 'Domingo'
      const nextDayClasses = getClassesByDay(nextDayName)
      if (nextDayClasses.length > 0) {
        return nextDayClasses[0] || null 
      }
    }

    return null
  }

  const getRemainingToday = (): number => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    const todayClasses = getTodayClasses()
    return todayClasses.filter(c => c.time > currentTimeStr).length
  }

  return {
    allClasses,
    weekDays,
    classesByDay,
    allTimeSlots,
    classMatrix,
    getClassesByPeriod,
    getClassesByType,
    getClassesByDay,
    getClassAtTimeSlot,
    getTodayClasses,
    getNextClass,
    getRemainingToday,
    totalClasses,
    totalSubjects
  }
})