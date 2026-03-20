import './global.css'

const WELCOME_MESSAGE = 'Hola, bienvenido a FitCore. ¿En qué puedo ayudarte hoy?'
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const history: Message[] = []

const app = document.getElementById('app')
if (!app) throw new Error('Missing #app element')

app.innerHTML =
`
    <div id="chat-container" class="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto h-155 flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

        <header id="chat-header" class="flex items-center gap-3 px-5 py-4 bg-neutral-900 border-b border-neutral-800 opacity-0 animate-header-enter">

            <div id="chat-logo" class="chat-logo w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 ease-in-out active:scale-95">

                <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/>
                </svg>

            </div>

            <div id="chat-title">

                <p class="font-['Barlow_Condensed'] font-black text-lg text-white uppercase tracking-wide leading-none">FitCore</p>
                <p class="text-xs text-neutral-500 uppercase tracking-widest mt-0.5">Asistente virtual</p>

            </div>

            <div class="ml-auto flex items-center justify-center gap-x-1">

                <div class="relative flex items-center justify-center w-4 h-4">

                    <div id="chat-status" class="w-2.5 h-2.5 bg-green-500 rounded-full relative z-10"></div>
                    <div class="absolute w-2.5 h-2.5 bg-green-500 rounded-full animate-status-pulse"></div>

                </div>

                <span class="text-xs text-neutral-500 uppercase tracking-widest">Disponible</span>

            </div>

        </header>

        <div id="chat-messages" class="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-neutral-700">

            <div class="self-start max-w-[85%] opacity-0 animate-welcome-enter">

                <span class="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-600/10 px-2 py-0.5 rounded mb-1 inline-block">FitBot</span>
                <div class="bg-neutral-950 border border-neutral-700 text-neutral-300 text-sm md:text-base rounded-xl rounded-bl-sm px-4 py-2.5 leading-relaxed">
                    ${WELCOME_MESSAGE}
                </div>

            </div>

        </div>

        <footer id="chat-footer" class="flex items-center gap-2.5 px-4 py-3 bg-neutral-900 border-t border-neutral-800 opacity-0 animate-footer-enter">

            <input
                id="chat-input"
                type="text"
                placeholder="Escribí tu consulta..."
                class="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-300 placeholder-neutral-500 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-[border-color,box-shadow] duration-200 ease-out"
            />

            <button
                id="chat-send"
                class="chat-send group w-10 h-10 bg-red-600 active:scale-95 transition-[transform,background-color] duration-150 ease-out rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >

                <svg class="w-4 h-4 fill-white transition-transform duration-150 ease-out group-active:translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/>
                </svg>

            </button>

        </footer>

    </div>
`

const messagesElement = document.getElementById('chat-messages')!
const inputElement = document.getElementById('chat-input') as HTMLInputElement
const sendElement = document.getElementById('chat-send')!

if (!messagesElement || !inputElement || !sendElement) {
    throw new Error('Missing required DOM elements')
}

function appendMessage(role: 'user' | 'assistant', content: string): void {
    const wrapper = document.createElement('div')
    wrapper.className = role === 'user' ? 
    'self-end max-w-[85%] opacity-0 animate-message-enter'
    : 
    'self-start max-w-[85%] opacity-0 animate-message-enter'
   
    if (role === 'assistant') {
        const label = document.createElement('span');
        label.className = 'text-xs font-bold uppercase tracking-widest text-red-600 bg-red-600/10 px-2 py-0.5 rounded mb-1 inline-block'
        label.textContent = 'FitBot'
        wrapper.appendChild(label)
    }

    const bubble = document.createElement('div');
    bubble.className = role === 'user' ? 
    'bg-red-600 text-white text-sm md:text-base rounded-xl rounded-br-sm px-4 py-2.5 leading-relaxed'
    : 
    'bg-neutral-950 border border-neutral-700 text-neutral-300 text-sm md:text-base rounded-xl rounded-bl-sm px-4 py-2.5 leading-relaxed'; 

    // Line breaks handling for agent responses
    content.split('\n').forEach((line, i, arr) => {
        const span = document.createElement('span')
        span.textContent = line
        bubble.appendChild(span)
        if (i < arr.length - 1) bubble.appendChild(document.createElement('br'))
    })

    wrapper.appendChild(bubble)
    messagesElement.appendChild(wrapper)
    messagesElement.scrollTop = messagesElement.scrollHeight
}

function appendTyping(): HTMLDivElement {
    const wrapper = document.createElement('div')
    wrapper.className = 'self-start max-w-[85%] opacity-0 animate-message-enter'
    wrapper.id = 'typing-indicator'

    const label = document.createElement('span')
    label.className = 'text-xs font-bold uppercase tracking-widest text-red-600 bg-red-600/10 px-2 py-0.5 rounded mb-1 inline-block'
    label.textContent = 'FitBot'

    const bubble = document.createElement('div')
    bubble.className = 'bg-neutral-950 border border-neutral-700 text-neutral-300 text-sm md:text-base rounded-xl rounded-bl-sm px-4 py-2.5 leading-relaxed flex gap-1 items-center'

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span')
        dot.className = 'w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce'
        dot.style.animationDelay = `${i * 150}ms`
        bubble.appendChild(dot)
    }

    wrapper.appendChild(label)
    wrapper.appendChild(bubble)

    messagesElement.appendChild(wrapper)
    messagesElement.scrollTop = messagesElement.scrollHeight
    return wrapper
}

function setLoading(loading: boolean): void {
    inputElement.disabled = loading
    loading ? sendElement.setAttribute('disabled', '') : sendElement.removeAttribute('disabled')
    sendElement.classList.toggle('opacity-50', loading)
    sendElement.classList.toggle('cursor-not-allowed', loading)
    sendElement.classList.toggle('cursor-pointer', !loading)
}

async function sendMessage(): Promise<void> {
    const message = inputElement.value.trim()
    if (!message) return

    inputElement.value = ''
    setLoading(true)
    appendMessage('user', message)

    const typing = appendTyping()

    try {
        const response = await fetch(`${API_URL}/api/v1/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history }),
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json() as { response: string }

        history.push({ role: 'user', content: message })
        history.push({ role: 'assistant', content: data.response })
        typing.remove()
        appendMessage('assistant', data.response)
    } 
    catch {
        typing.remove()
        appendMessage('assistant', 'Hubo un error al conectar con el servidor. Intentá de nuevo.')
    } 
    finally {
        setLoading(false)
    }
}

sendElement.addEventListener('click', sendMessage)

inputElement.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        if (!inputElement.disabled) sendMessage()
    }
})