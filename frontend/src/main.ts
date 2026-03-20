import './global.css'

const WELCOME_MESSAGE: string = 'Hola, bienvenido a FitCore. ¿En qué puedo ayudarte hoy?'
const app = document.getElementById('app')!

app.innerHTML =
`
    <div id="chat-container" class="w-full max-w-sm mx-auto h-155 flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

        <header id="chat-header" class="flex items-center gap-3 px-5 py-4 bg-neutral-900 border-b border-neutral-800 opacity-0 animate-header-enter">

            <div id="chat-logo" class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 ease-in-out active:scale-95">

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
                <div class="bg-neutral-950 border border-neutral-700 text-neutral-300 text-sm rounded-xl rounded-bl-sm px-4 py-2.5 leading-relaxed">
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
                class="group w-10 h-10 bg-red-600 active:scale-95 transition-[transform,background-color] duration-150 ease-out rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >

                <svg class="w-4 h-4 fill-white transition-transform duration-150 ease-out group-active:translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/>
                </svg>

            </button>

        </footer>

    </div>
`;