import { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

const VideoCallApp = () => {
  const videoRef = useRef(null);
  const callFrame = useRef(null);

  useEffect(() => {
    const ROOM_URL = 'https://1st.daily.co/1st';

    // Función asíncrona para manejar la creación
    const initCall = async () => {
      if (!videoRef.current) return;

      // Si ya existe una instancia en el DOM, la eliminamos primero
      if (callFrame.current) {
        await callFrame.current.destroy();
      }

      // Creamos la nueva instancia
      callFrame.current = DailyIframe.createFrame(videoRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '1rem',
        },
        showLeaveButton: true,
      });

      try {
        await callFrame.current.join({ url: ROOM_URL });
      } catch (e) {
        console.error("Error al unirse:", e);
      }
    };

    initCall();

    // Limpieza estricta al desmontar
    return () => {
      if (callFrame.current) {
        callFrame.current.destroy().then(() => {
          callFrame.current = null;
        });
      }
    };
  }, []); // El array vacío es vital aquí

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col font-sans">
      {/* Header Estilo Dashboard */}
      <header className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">NetCall Pro</h1>
          <p className="text-slate-400 text-sm italic">Simulación de Conferencia Grupal</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-600">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
          <span className="text-sm font-medium">Servidor Activo</span>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-grow flex flex-col lg:flex-row gap-4">
        
        {/* Área de Video Real */}
        <div className="flex-[3] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative min-h-[400px]">
          <div ref={videoRef} className="w-full h-full">
            {/* Aquí Daily.co inyectará la videollamada */}
          </div>
        </div>

        {/* Panel Lateral (Para impresionar con la UI) */}
        <div className="flex-[1] bg-slate-800 rounded-2xl border border-slate-700 p-4 shadow-xl">
          <h2 className="font-semibold mb-4 text-slate-300 border-b border-slate-700 pb-2">Participantes</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs">YO</div>
              <span className="text-sm">Tú (Host)</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs">PE</div>
              <span className="text-sm text-slate-400 italic">Esperando a Profe Estricta...</span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="mt-6 text-center text-slate-500 text-xs">
        Arquitectura WebRTC vía Daily SDK | Hosteado en Netlify
      </footer>
    </div>
  );
};

export default VideoCallApp;