import { useState, useEffect, useRef } from 'react';

const VideoCallApp = () => {
  const [roomName, setRoomName] = useState('');
  const [inCall, setInCall] = useState(false);
  const jitsiContainerRef = useRef(null);

  const [error, setError] = useState('');

  const handleJoin = () => {
    if (roomName.length < 5) {
      setError('El ID de la sala debe tener al menos 5 caracteres.');
      return;
    }
    
    setError('');
    setInCall(true);
  };

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

      api.addEventListener('videoConferenceLeft', () => {
        setInCall(false);
      });
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
            {/* ... dentro del bloque del Lobby, debajo del input ... */}
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">ID de la Sala</label>
              <input 
                type="text" 
                placeholder="Escribe el nombre de la sala..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                value={roomName}
                onChange={(e) => {
                  // Aplicamos la limpieza técnica inmediatamente
                  const sanitizedValue = e.target.value
                    .replace(/\s+/g, '-')
                    .replace(/[^a-zA-Z0-9-_]/g, '');
                  
                  setRoomName(sanitizedValue);
                }}
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

              <button 
                onClick={handleCreateRoom}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 rounded-xl border border-slate-600 transition-all"
              >
                Generar nombre de sala nueva
              </button>
            </div>
          </div>

          {/* --- PANEL DE PROTOCOLO Y ESTADO --- */}
          <div className="mt-6 space-y-3">
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 shadow-inner">
              {/* Encabezado del aviso */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Protocolo de Conexión WebRTC
                </span>
              </div>

              {/* Cuerpo del mensaje */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-blue-400">Provisión Automática:</strong> Si el ID ingresado no corresponde a la de ninguna sala activa, el sistema creará una nueva sala automáticamente.
                  </p>
                </div>

                <div className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-amber-500">Jerarquía de Sesión:</strong> Para establecer el enlace entre pares, es obligatorio que un <span className="text-slate-100">Moderador</span> esté presente en la sala. En caso de que no exista, las personas quedarán esperando indefinidamente. Si eres el creador de la sala, inicia sesión y automáticamente te convertirás en <span className="text-slate-100">Moderador</span> y los demás podrán conectarse.
                  </p>
                </div>
              </div>
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