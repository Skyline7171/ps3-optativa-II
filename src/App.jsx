import { useEffect, useRef } from 'react';

const VideoCallApp = () => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const domain = 'meet.jit.si';
    let api = null;

    const loadJitsi = () => {
      // Creamos un nombre de sala único para evitar colisiones
      const roomName = `Tarea_Ingenieria_UNHSJM_${Math.floor(Math.random() * 10000)}`;
      
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          disableDeepLinking: true, // Evita que intente abrir la app en el celular
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'hangup', 'chat'],
        },
      };

      // Si ya existe una instancia (por el Strict Mode), la limpiamos antes
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }

      api = new window.JitsiMeetExternalAPI(domain, options);
    };

    // Verificamos si el script ya está en el documento
    if (window.JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = loadJitsi;
      document.body.appendChild(script);
    }

    return () => {
      if (api) api.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col font-sans">
      <header className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">NetCall Open</h1>
          <p className="text-slate-400 text-sm italic">Protocolo WebRTC - Jitsi Engine</p>
        </div>
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/50 px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs font-mono text-green-400 font-bold uppercase">Conexión Segura</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row gap-4">
        {/* Contenedor de Video */}
        <div className="flex-[3] bg-black rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative min-h-[500px]">
          <div ref={jitsiContainerRef} className="w-full h-full" />
        </div>

        {/* Info de la Tarea para la Profe */}
        <div className="flex-[1] bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="font-bold mb-4 text-slate-100 uppercase text-xs tracking-widest">Detalles Técnicos</h2>
            <div className="space-y-4">
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="text-xs text-blue-400 mb-1">Tecnología:</p>
                <p className="text-sm font-mono text-slate-300">WebRTC / SFU</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="text-xs text-blue-400 mb-1">Despliegue:</p>
                <p className="text-sm font-mono text-slate-300">Netlify CI/CD</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            Optimizado para Ingeniería de Software - 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default VideoCallApp;