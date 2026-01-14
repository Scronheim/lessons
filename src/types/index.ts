export interface Answer {
  text: string
  correct: boolean
}

export interface Question {
  question: string
  answers: Answer[]
}

export interface TextContent {
  type: 'p' | 'h3'
  content: string
}

export interface Lesson {
  id: number
  title: string
  video: string
  text: TextContent[]
  questions: Question[]
}

export interface UserAnswer {
  questionIndex: number
  answerIndex: number
}
