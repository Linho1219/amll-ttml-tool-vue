import mitt from 'mitt'
import type { HotkeyCmd } from './hotkey'
const globalEmit = mitt<{ [K in HotkeyCmd]: undefined }>()
export default globalEmit
