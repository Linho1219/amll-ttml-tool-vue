import { computed, type Ref } from 'vue'

function str2num(str: string): number {
  const match = str.match(/^(?:(\d+):)?(\d+)(\.\d{1,3})?$/)
  if (!match) return 0
  const [, strM, strS, strMs] = match
  const m = Number(strM || 0) * 60 * 1000
  const s = Number(strS || 0) * 1000
  const ms = strMs ? Number(strMs) * 1000 : 0
  return m + s + ms
}

function num2str(num: number): string {
  if (num < 0) num = 0
  const m = Math.floor(num / 60000)
    .toString()
    .padStart(2, '0')
  const s = Math.floor((num % 60000) / 1000)
    .toString()
    .padStart(2, '0')
  const ms = (num % 1000).toString().padStart(3, '0')
  return `${m}:${s}.${ms}`
}

type NumericObj<T> = { [K in keyof T]: T[K] extends number ? number : never }

export function timeModel(ref: Ref<number>): Ref<string>
export function timeModel<T extends NumericObj<T>, K extends keyof T>(obj: T, key: K): Ref<string>
export function timeModel(arg1: any, arg2?: any) {
  const getNum = () => (arg2 ? arg1[arg2] : arg1.value) as number
  const setNum = (v: number) => {
    if (arg2) arg1[arg2] = v
    else arg1.value = v
  }
  return computed<string>({
    get: () => num2str(getNum()),
    set: (val: string) => setNum(str2num(val)),
  })
}
