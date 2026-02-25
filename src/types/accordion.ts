export interface AccordionItem {
  id?: string | number
  title: string
  content?: string
  icon?: string
  disabled?: boolean
  [key: string]: any // Permite propriedades adicionais
}