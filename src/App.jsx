import { useState, useEffect, useRef } from "react";

const VideoCallApp = () => {
  const [roomName, setRoomName] = useState("");
  const [copied, setCopied] = useState(false);
  const [inCall, setInCall] = useState(false);
  const jitsiContainerRef = useRef(null);

  // Función para generar un ID de sala aleatorio
  const handleCreateRoom = () => {
    const prefixes = ["ingenieria", "clase", "grupo", "proyecto", "reunion"];
    const suffixes = ["optativa", "redes", "alpha", "beta", "final"];
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const generatedID = `${
      prefixes[Math.floor(Math.random() * prefixes.length)]
    }-${suffixes[Math.floor(Math.random() * suffixes.length)]}-${randomNum}`;

    setRoomName(generatedID);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Solo actuamos si el usuario decidió entrar a la llamada
    if (!inCall) return;

    let api = null;

    const startConference = () => {
      const domain = "meet.jit.si";
      const options = {
        roomName: `UNHSJM_2026_${roomName.trim().replaceAll(" ", "_")}`,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          disableDeepLinking: true,
        },
      };

      // Limpiamos el contenedor por si quedó algún rastro de un intento previo
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = "";
      }

      api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener("videoConferenceLeft", () => {
        setInCall(false);
      });

      // Cuando el moderador entra, activamos la sala de espera automáticamente
      api.addEventListener("videoConferenceJoined", () => {
        // Por defecto en la versión gratuita, el primero en llegar es moderador
        api.executeCommand("toggleLobby", true);
      });
    };

    // Verificamos si el script externo de Jitsi ya está en el DOM
    if (window.JitsiMeetExternalAPI) {
      startConference();
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
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
            <h1 className="text-3xl font-extrabold text-blue-400">
              PS3 <span className="text-white">Optativa II</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Simulación de llamada grupal
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">
                ID de la Sala
              </label>
              <input
                type="text"
                placeholder="Escribe el nombre de la sala..."
                className={`w-full bg-slate-900 border ${
                  roomName.length > 0 && roomName.length < 5
                    ? "border-amber-500"
                    : "border-slate-700"
                } rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono`}
                value={roomName}
                onChange={(e) => {
                  const sanitizedValue = e.target.value
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9-_]/g, "");
                  setRoomName(sanitizedValue);
                }}
              />

              {roomName.length > 0 && roomName.length < 5 && (
                <p className="text-[10px] text-amber-500 mt-2 ml-1 animate-pulse">
                  El ID debe tener al menos 5 caracteres.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={roomName.length < 5}
                onClick={() => setInCall(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40"
              >
                Unirse a la llamada
              </button>

              <button
                onClick={handleCreateRoom}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 rounded-xl border border-slate-500 transition-all shadow-md"
              >
                Generar nombre de sala nueva
              </button>
            </div>
          </div>

          {/* --- Explicación del funcionamiento --- */}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-blue-400">
                      Provisión Automática:
                    </strong>{" "}
                    Si el ID ingresado no corresponde a la de ninguna sala
                    activa, el sistema creará una nueva sala automáticamente.
                  </p>
                </div>

                <div className="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-amber-500">
                      Jerarquía de Sesión:
                    </strong>{" "}
                    Para establecer el enlace entre pares, es obligatorio que un{" "}
                    <span className="text-amber-400 font-bold">Moderador</span>{" "}
                    esté presente en la sala. En caso de que no exista, las
                    personas quedarán esperando indefinidamente. Si eres el
                    creador de la sala, inicia sesión y automáticamente te
                    convertirás en{" "}
                    <span className="text-amber-400 font-bold">Moderador</span>{" "}
                    y los demás podrán conectarse.
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

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">
              En Línea
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-mono text-sm font-bold uppercase tracking-wider">
              ID: {roomName}
            </span>

            <button
              onClick={copyToClipboard}
              className={`ml-2 p-1.5 rounded-lg transition-all border ${
                copied
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
              title="Copiar ID de la sala"
            >
              {copied ? (
                <div className="flex items-center gap-1 px-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[10px] font-bold uppercase">
                    Copiado
                  </span>
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>
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