import { useState, useEffect, useRef } from 'react';

const VideoCallApp = () => {
  const [roomName, setRoomName] = useState('');
  const [inCall, setInCall] = useState(false);
  const jitsiContainerRef = useRef(null);

  // Función para generar un ID de sala aleatorio y legible
  const handleCreateRoom = () => {
    const prefixes = ['ingenieria', 'clase', 'grupo', 'proyecto', 'reunion'];
    const suffixes = ['optativa', 'redes', 'alpha', 'beta', 'final'];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    const generatedID = `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${suffixes[Math.floor(Math.random() * suffixes.length)]}-${randomNum}`;
    
    setRoomName(generatedID);
  };

  useEffect(() => {
    // Solo actuamos si el usuario decidió entrar a la llamada
    if (!inCall) return;

    let api = null;

    const startConference = () => {
      const domain = 'meet.jit.si';
      const options = {
        roomName: `UNHSJM_2026_${roomName.trim().replaceAll(' ', '_')}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'hangup', 'chat'],
        },
      };

      // Limpiamos el contenedor por si quedó algún rastro de un intento previo
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }

      api = new window.JitsiMeetExternalAPI(domain, options);
    };

    // Verificamos si el script externo de Jitsi ya está en el DOM
    if (window.JitsiMeetExternalAPI) {
      startConference();
    } else {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = startConference;
      document.body.appendChild(script);
    }

    // Cleanup: Destruimos la instancia al salir de la llamada o desmontar
    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [inCall, roomName]); // Dependencias críticas

  if (!inCall) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-400">PS3 <span className="text-white">Optativa II</span></h1>
            <p className="text-slate-400 text-sm mt-2">Simulación de llamada grupal</p>
          </div>
          
          <div className="space-y-6">
            {/* Input de Sala */}
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">ID de la Sala</label>
              <input 
                type="text" 
                placeholder="Escribe el nombre de la sala..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            
            {/* Botones de Acción */}
            <div className="flex flex-col gap-3">
              <button 
                disabled={!roomName}
                onClick={() => setInCall(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                Unirse a la llamada
              </button>

              <div className="flex items-center gap-2 my-1">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="text-slate-600 text-xs font-bold uppercase">ó</span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>

              <button 
                onClick={handleCreateRoom}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 rounded-xl border border-slate-600 transition-all"
              >
                Generar nombre de sala nueva
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest">
            Ingeniería de Computación • UNHSJM
          </p>
        </div>
      </div>
    );
  }

  // --- VISTA DE LA LLAMADA (Sin cambios) ---
  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 font-mono text-sm uppercase tracking-wider">Nombre de la sala: {roomName}</span>
        </div>
        <button 
          onClick={() => setInCall(false)}
          className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 hover:bg-red-500 hover:text-white transition-all uppercase tracking-tighter"
        >
          Finalizar Sesión
        </button>
      </div>
      <div ref={jitsiContainerRef} className="flex-grow w-full" />
    </div>
  );
};

export default VideoCallApp;