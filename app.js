/* ===============================
   APP MARIO — Sistema universal
   Gamificación + Pomodoro + Audio + Modo examen
   =============================== */

(function(){
  'use strict';

  // ============= CONFIG =============
  const CONFIG = {
    asignaturas: {
      mate:    {nombre:'Matemáticas',     emoji:'📐', color:'#3b82f6'},
      lengua:  {nombre:'Lengua',          emoji:'📖', color:'#a855f7'},
      fisica:  {nombre:'Física y Química',emoji:'⚡', color:'#ef4444'},
      ingles:  {nombre:'Inglés',          emoji:'🇬🇧', color:'#10b981'},
      historia:{nombre:'Historia',        emoji:'🌍', color:'#f59e0b'},
      biologia:{nombre:'Biología',        emoji:'🫁', color:'#14b8a6'}
    },
    nivelesUmbral: [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500],
    pageToAsig: {
      'mate.html':'mate', 'lengua.html':'lengua', 'fisica.html':'fisica',
      'ingles.html':'ingles', 'historia.html':'historia', 'biologia.html':'biologia'
    }
  };

  // ============= ESTADO =============
  const KEY = 'mario_progreso_v1';
  function defaultEstado(){
    return {
      nombre:'Mario',
      puntosTotal: 0,
      asignaturas: Object.fromEntries(Object.keys(CONFIG.asignaturas).map(k=>[k,{puntos:0,ejerciciosOK:0,ejerciciosKO:0,quizOK:0,quizKO:0,simulacrosCompletados:0,tiempoEstudio:0}])),
      racha: 0,
      ultimaSesion: null,
      logros: [],
      ejerciciosResueltos: {}, // id → {ok:bool, fecha:timestamp, intentos:n}
      tiempoSesionHoy: 0,
      sesionesPomodoro: 0
    };
  }
  let estado = null;
  function cargar(){
    try{
      const raw = localStorage.getItem(KEY);
      estado = raw ? JSON.parse(raw) : defaultEstado();
      // Asegurarnos de que no falten campos nuevos
      const def = defaultEstado();
      for(const k in def) if(!(k in estado)) estado[k] = def[k];
      for(const a in def.asignaturas) if(!(a in estado.asignaturas)) estado.asignaturas[a] = def.asignaturas[a];
    }catch(e){ estado = defaultEstado(); }
  }
  function guardar(){
    try{ localStorage.setItem(KEY, JSON.stringify(estado)); }catch(e){}
  }

  // ============= GAMIFICACIÓN =============
  function nivelDe(puntos){
    for(let i=CONFIG.nivelesUmbral.length-1;i>=0;i--){
      if(puntos >= CONFIG.nivelesUmbral[i]) return i+1;
    }
    return 1;
  }
  function progresoNivel(puntos){
    const nivel = nivelDe(puntos);
    const min = CONFIG.nivelesUmbral[nivel-1] || 0;
    const max = CONFIG.nivelesUmbral[nivel] || (min + 1000);
    return {nivel, min, max, pct: Math.min(100, ((puntos-min)/(max-min))*100)};
  }

  function detectarAsignaturaActual(){
    const url = window.location.pathname.split('/').pop();
    return CONFIG.pageToAsig[url] || null;
  }

  function sumarPuntos(asig, puntos, motivo){
    if(!estado.asignaturas[asig]) return;
    const nivelAntes = nivelDe(estado.asignaturas[asig].puntos);
    estado.asignaturas[asig].puntos += puntos;
    estado.puntosTotal += puntos;
    const nivelDespues = nivelDe(estado.asignaturas[asig].puntos);
    if(nivelDespues > nivelAntes){
      desbloquearLogro(`nivel_${asig}_${nivelDespues}`, `Nivel ${nivelDespues} en ${CONFIG.asignaturas[asig].nombre}`, '🎉');
      mostrarToast(`🎉 ¡Subiste a Nivel ${nivelDespues} en ${CONFIG.asignaturas[asig].nombre}!`, 'good', 4000);
    } else if(motivo){
      mostrarToast(`+${puntos} pts ${motivo}`, 'good', 1800);
    }
    guardar();
    actualizarBadge();
  }

  function registrarEjercicio(id, ok){
    const asig = detectarAsignaturaActual();
    if(!asig) return;
    if(!estado.ejerciciosResueltos[id]) estado.ejerciciosResueltos[id] = {ok:false, intentos:0};
    estado.ejerciciosResueltos[id].intentos++;
    estado.ejerciciosResueltos[id].fecha = Date.now();
    if(ok){
      estado.ejerciciosResueltos[id].ok = true;
      estado.asignaturas[asig].ejerciciosOK++;
      sumarPuntos(asig, 5, 'ejercicio bien');
    } else {
      estado.asignaturas[asig].ejerciciosKO++;
      sumarPuntos(asig, 1, '');
    }
    chequearLogros();
    guardar();
  }

  function registrarQuiz(ok){
    const asig = detectarAsignaturaActual();
    if(!asig) return;
    if(ok){
      estado.asignaturas[asig].quizOK++;
      sumarPuntos(asig, 3, 'pregunta acertada');
    } else {
      estado.asignaturas[asig].quizKO++;
      sumarPuntos(asig, 0, '');
    }
    chequearLogros();
    guardar();
  }

  function registrarSimulacro(){
    const asig = detectarAsignaturaActual();
    if(!asig) return;
    estado.asignaturas[asig].simulacrosCompletados++;
    sumarPuntos(asig, 50, '¡Simulacro completado!');
    desbloquearLogro(`simulacro_${asig}`, `Primer simulacro de ${CONFIG.asignaturas[asig].nombre}`, '📝');
    guardar();
  }

  function chequearRacha(){
    const hoy = new Date().toDateString();
    const ult = estado.ultimaSesion ? new Date(estado.ultimaSesion).toDateString() : null;
    if(ult === hoy) return; // ya contada hoy
    if(ult){
      const ayer = new Date(); ayer.setDate(ayer.getDate()-1);
      if(new Date(estado.ultimaSesion).toDateString() === ayer.toDateString()){
        estado.racha++;
      } else {
        estado.racha = 1;
      }
    } else {
      estado.racha = 1;
    }
    estado.ultimaSesion = Date.now();
    if(estado.racha === 3) desbloquearLogro('racha_3','3 días seguidos','🔥');
    if(estado.racha === 7) desbloquearLogro('racha_7','¡Una semana seguida!','🔥🔥');
    if(estado.racha === 12) desbloquearLogro('racha_12','¡12 días! Imparable','🏆');
    guardar();
  }

  function desbloquearLogro(id, nombre, emoji){
    if(estado.logros.find(l=>l.id===id)) return;
    estado.logros.push({id, nombre, emoji, fecha: Date.now()});
    mostrarToast(`${emoji} Logro desbloqueado: ${nombre}`, 'gold', 5000);
    guardar();
  }

  function chequearLogros(){
    // Logros por cantidad de ejercicios
    let totalOK = 0;
    Object.values(estado.asignaturas).forEach(a => totalOK += a.ejerciciosOK + a.quizOK);
    if(totalOK >= 10)  desbloquearLogro('e10','10 ejercicios bien','✅');
    if(totalOK >= 50)  desbloquearLogro('e50','50 ejercicios bien','💪');
    if(totalOK >= 100) desbloquearLogro('e100','¡100 ejercicios bien!','🏆');
    if(totalOK >= 250) desbloquearLogro('e250','¡250 ejercicios bien!','👑');
    // Por puntos totales
    if(estado.puntosTotal >= 500)  desbloquearLogro('p500','500 puntos','⭐');
    if(estado.puntosTotal >= 1000) desbloquearLogro('p1000','1000 puntos','🌟');
    if(estado.puntosTotal >= 2000) desbloquearLogro('p2000','2000 puntos','💫');
  }

  // ============= BADGE FLOTANTE =============
  let badgeEl = null;
  function crearBadge(){
    if(badgeEl) return;
    badgeEl = document.createElement('div');
    badgeEl.id = 'mario-badge';
    badgeEl.style.cssText = `
      position:fixed; bottom:18px; right:18px; z-index:9999;
      background:linear-gradient(135deg,#1e293b,#4c1d95); color:#fff;
      padding:10px 14px; border-radius:14px; font-family:-apple-system,sans-serif;
      font-size:.85em; box-shadow:0 8px 24px rgba(0,0,0,.5);
      cursor:pointer; border:2px solid #fbbf24; user-select:none;
      transition:transform .2s; min-width:160px;
    `;
    badgeEl.onclick = () => window.location.href = 'progreso.html';
    document.body.appendChild(badgeEl);
    actualizarBadge();
  }
  function actualizarBadge(){
    if(!badgeEl) return;
    const p = progresoNivel(estado.puntosTotal);
    const racha = estado.racha || 0;
    const fuego = racha > 0 ? `🔥${racha}` : '';
    badgeEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;font-weight:700">
        <span style="font-size:1.4em">⭐</span>
        <span>Nivel ${p.nivel} · ${estado.puntosTotal} pts</span>
      </div>
      <div style="background:#0f172a;height:5px;border-radius:3px;margin-top:5px;overflow:hidden">
        <div style="background:#fbbf24;height:100%;width:${p.pct}%;transition:width .4s"></div>
      </div>
      <div style="font-size:.78em;color:#fde68a;margin-top:4px">${fuego} Click para ver progreso</div>
    `;
  }

  // ============= TOAST =============
  function mostrarToast(texto, tipo, duracion){
    const t = document.createElement('div');
    const colores = {good:'#22c55e', bad:'#ef4444', gold:'#fbbf24', info:'#3b82f6'};
    t.style.cssText = `
      position:fixed; top:20px; left:50%; transform:translateX(-50%) translateY(-80px);
      background:${colores[tipo]||'#1e293b'}; color:#0f172a; font-weight:700;
      padding:12px 22px; border-radius:30px; z-index:10000;
      box-shadow:0 10px 30px rgba(0,0,0,.4); font-family:-apple-system,sans-serif;
      transition:transform .35s; max-width:90vw; text-align:center;
    `;
    t.textContent = texto;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.transform = 'translateX(-50%) translateY(0)');
    setTimeout(() => {
      t.style.transform = 'translateX(-50%) translateY(-80px)';
      setTimeout(() => t.remove(), 400);
    }, duracion || 3000);
  }

  // ============= POMODORO =============
  const Pomodoro = {
    el: null,
    interval: null,
    tiempoRestante: 50*60,
    fase: 'estudio', // 'estudio' o 'descanso'
    activo: false,
    crear(){
      if(this.el) return;
      const el = document.createElement('div');
      el.id = 'mario-pomodoro';
      el.style.cssText = `
        position:fixed; bottom:18px; left:18px; z-index:9999;
        background:linear-gradient(135deg,#0f172a,#7c2d12); color:#fff;
        padding:10px 14px; border-radius:14px; font-family:-apple-system,sans-serif;
        font-size:.85em; box-shadow:0 8px 24px rgba(0,0,0,.5);
        border:2px solid #ef4444; user-select:none; min-width:160px;
      `;
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;font-weight:700;margin-bottom:6px">
          <span style="font-size:1.3em">🍅</span>
          <span id="pomo-fase">Estudio</span>
        </div>
        <div id="pomo-tiempo" style="font-size:1.3em;font-weight:800;text-align:center;color:#fbbf24;margin:4px 0">50:00</div>
        <div style="display:flex;gap:4px;justify-content:center">
          <button id="pomo-toggle" style="flex:1;background:#ef4444;color:#fff;border:0;padding:6px;border-radius:6px;cursor:pointer;font-size:.78em;font-weight:700">▶ Iniciar</button>
          <button id="pomo-reset" style="background:#475569;color:#fff;border:0;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:.78em">↺</button>
        </div>
      `;
      document.body.appendChild(el);
      this.el = el;
      document.getElementById('pomo-toggle').onclick = () => this.toggle();
      document.getElementById('pomo-reset').onclick = () => this.reset();
      this.actualizar();
    },
    toggle(){
      this.activo = !this.activo;
      const btn = document.getElementById('pomo-toggle');
      if(this.activo){
        btn.textContent = '⏸ Pausa';
        this.interval = setInterval(() => this.tick(), 1000);
      } else {
        btn.textContent = '▶ Reanudar';
        clearInterval(this.interval);
      }
    },
    tick(){
      this.tiempoRestante--;
      this.actualizar();
      if(this.tiempoRestante <= 0){
        clearInterval(this.interval);
        this.activo = false;
        if(this.fase === 'estudio'){
          this.fase = 'descanso'; this.tiempoRestante = 10*60;
          estado.sesionesPomodoro++;
          sumarPuntos(detectarAsignaturaActual()||'mate', 20, '¡Pomodoro completado!');
          mostrarToast('🍅 ¡50 min de estudio! Toca descanso de 10 min', 'good', 6000);
          if(window.AudioMario) window.AudioMario.beep();
        } else {
          this.fase = 'estudio'; this.tiempoRestante = 50*60;
          mostrarToast('💪 Vuelta al estudio. ¡A por otros 50 min!', 'info', 5000);
          if(window.AudioMario) window.AudioMario.beep();
        }
        this.actualizar();
        document.getElementById('pomo-toggle').textContent = '▶ Iniciar';
      }
    },
    reset(){
      this.activo = false;
      clearInterval(this.interval);
      this.fase = 'estudio';
      this.tiempoRestante = 50*60;
      this.actualizar();
      document.getElementById('pomo-toggle').textContent = '▶ Iniciar';
    },
    actualizar(){
      const min = Math.floor(this.tiempoRestante/60);
      const seg = this.tiempoRestante%60;
      const tEl = document.getElementById('pomo-tiempo');
      const fEl = document.getElementById('pomo-fase');
      if(tEl) tEl.textContent = `${String(min).padStart(2,'0')}:${String(seg).padStart(2,'0')}`;
      if(fEl) fEl.textContent = this.fase === 'estudio' ? '📚 Estudio' : '☕ Descanso';
    }
  };

  // ============= AUDIO (Web Speech API) =============
  const AudioMario = {
    voces: [],
    vozEs: null,
    vozEn: null,
    cargarVoces(){
      this.voces = window.speechSynthesis.getVoices();
      this.vozEs = this.voces.find(v => v.lang.startsWith('es') && v.localService) ||
                   this.voces.find(v => v.lang.startsWith('es')) ||
                   this.voces[0];
      this.vozEn = this.voces.find(v => v.lang.startsWith('en') && v.localService) ||
                   this.voces.find(v => v.lang.startsWith('en'));
    },
    hablar(texto, idioma){
      if(!('speechSynthesis' in window)){ alert('Tu navegador no soporta audio'); return; }
      this.detener();
      const utter = new SpeechSynthesisUtterance(texto);
      utter.voice = idioma === 'en' ? this.vozEn : this.vozEs;
      utter.lang = idioma === 'en' ? 'en-US' : 'es-ES';
      utter.rate = 0.95;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    },
    detener(){ window.speechSynthesis.cancel(); },
    beep(){
      try {
        const ctx = new (window.AudioContext||window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 880; g.gain.value = .15;
        o.start(); o.stop(ctx.currentTime+.3);
      } catch(e){}
    },
    // Añade botones automáticamente a párrafos largos / blockquotes / sections
    inyectarBotones(){
      const idioma = window.location.pathname.includes('ingles') ? 'en' : 'es';
      // Botón en cada h2 de sección
      document.querySelectorAll('section h2').forEach(h2 => {
        if(h2.querySelector('.btn-audio')) return;
        const btn = document.createElement('button');
        btn.className = 'btn-audio';
        btn.innerHTML = '🎧';
        btn.title = 'Escuchar sección';
        btn.style.cssText = `
          background:rgba(251,191,36,.2); color:#fbbf24; border:1px solid #fbbf24;
          border-radius:50%; width:34px; height:34px; cursor:pointer; margin-left:10px;
          font-size:.95em; vertical-align:middle; transition:all .2s;
        `;
        btn.onmouseenter = () => btn.style.background='#fbbf24', btn.style.color='#0f172a';
        btn.onmouseleave = () => btn.style.background='rgba(251,191,36,.2)', btn.style.color='#fbbf24';
        btn.onclick = (e) => {
          e.stopPropagation();
          const section = h2.closest('section');
          // Extraer todo el texto de la sección menos los botones
          const texto = section.textContent
            .replace(/🎧/g,'').replace(/▶|⏸|↺/g,'')
            .replace(/\s+/g,' ').trim().substring(0,4500);
          this.hablar(texto, idioma);
          mostrarToast('🎧 Reproduciendo… (clic de nuevo para parar)','info',2000);
        };
        // Wrap para que el click no choque con event listeners
        btn.onclick = btn.onclick.bind(this);
        h2.appendChild(btn);
      });
    }
  };
  window.AudioMario = AudioMario;

  // ============= MODO EXAMEN =============
  const ModoExamen = {
    activo: false,
    inicio: null,
    interval: null,
    tiempoEl: null,
    iniciar(minutos){
      const sim = document.getElementById('simulacro');
      if(!sim){ alert('No se ha encontrado el simulacro en esta página'); return; }
      // Ocultar TODAS las secciones excepto la del simulacro
      document.querySelectorAll('section').forEach(s => {
        if(s.id !== 'simulacro') s.style.display = 'none';
      });
      sim.style.display = 'block';
      // Ocultar botones de soluciones
      sim.querySelectorAll('.toggle-sol, .solucion').forEach(e => e.style.display = 'none');
      // Crear barra superior con cronómetro
      const barra = document.createElement('div');
      barra.id = 'examen-barra';
      barra.style.cssText = `
        position:fixed; top:0; left:0; right:0; z-index:10000;
        background:linear-gradient(135deg,#7c2d12,#ef4444); color:#fff;
        padding:14px 20px; display:flex; justify-content:space-between; align-items:center;
        box-shadow:0 4px 14px rgba(0,0,0,.5); font-family:-apple-system,sans-serif;
      `;
      barra.innerHTML = `
        <div style="font-weight:700;font-size:1.05em">📝 MODO EXAMEN ACTIVO</div>
        <div id="examen-cronometro" style="font-size:1.6em;font-weight:800;color:#fbbf24;font-family:monospace">${this.fmt(minutos*60)}</div>
        <button id="examen-terminar" style="background:#0f172a;color:#fff;border:2px solid #fbbf24;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:700">Terminar</button>
      `;
      document.body.appendChild(barra);
      document.body.style.paddingTop = '70px';
      this.tiempoEl = document.getElementById('examen-cronometro');
      this.activo = true;
      this.inicio = Date.now();
      this.fin = Date.now() + minutos*60*1000;
      this.interval = setInterval(() => this.tick(), 1000);
      document.getElementById('examen-terminar').onclick = () => this.terminar();
      // Pantalla completa si se puede
      try { document.documentElement.requestFullscreen?.(); } catch(e){}
    },
    fmt(seg){
      const m = Math.floor(seg/60), s = seg%60;
      return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    },
    tick(){
      const restante = Math.max(0, Math.floor((this.fin - Date.now())/1000));
      if(this.tiempoEl) this.tiempoEl.textContent = this.fmt(restante);
      if(restante < 60 && this.tiempoEl) this.tiempoEl.style.color = '#ef4444';
      if(restante <= 0){
        clearInterval(this.interval);
        this.terminar(true);
      }
    },
    terminar(porTiempo){
      const minutos = Math.round((Date.now()-this.inicio)/60000);
      clearInterval(this.interval);
      // Mostrar todo lo oculto
      document.querySelectorAll('section').forEach(s => s.style.display = '');
      const sim = document.getElementById('simulacro');
      if(sim) sim.querySelectorAll('.toggle-sol, .solucion').forEach(e => e.style.display = '');
      const barra = document.getElementById('examen-barra');
      if(barra) barra.remove();
      document.body.style.paddingTop = '';
      try { document.exitFullscreen?.(); } catch(e){}
      this.activo = false;
      registrarSimulacro();
      const msg = porTiempo
        ? `⏰ ¡Tiempo agotado! Estudiaste ${minutos} min en modo examen. Ahora puedes ver las soluciones.`
        : `✅ Simulacro completado en ${minutos} min. ¡Bien hecho! Ahora puedes ver las soluciones para autocorregirte.`;
      mostrarToast(msg, 'good', 7000);
    }
  };

  // ============= INTERCEPTAR LAS FUNCIONES EXISTENTES =============
  // Las páginas ya tienen funciones chk(btn,ok) y toggleSol(btn).
  // Las envolvemos para registrar progreso sin romper nada.
  function interceptar(){
    if(typeof window.chk === 'function'){
      const orig = window.chk;
      window.chk = function(btn, ok){
        orig(btn, ok);
        registrarQuiz(ok);
      };
    }
    if(typeof window.toggleSol === 'function'){
      const orig = window.toggleSol;
      window.toggleSol = function(btn){
        orig(btn);
        // Si abren la solución por primera vez, dar 1 punto (interactúan)
        const sol = btn.nextElementSibling;
        if(sol && sol.classList.contains('show')){
          const id = btn.parentElement?.querySelector('.num')?.textContent || Math.random().toString();
          if(!estado.ejerciciosResueltos[id]){
            // Han abierto la solución sin marcar bien/mal
            registrarEjercicio(id, true); // asumimos que lo hicieron
          }
        }
      };
    }
  }

  // ============= BOTÓN MODO EXAMEN =============
  function inyectarBotonExamen(){
    const sim = document.getElementById('simulacro');
    if(!sim) return;
    if(sim.querySelector('.btn-modo-examen')) return;
    const btn = document.createElement('button');
    btn.className = 'btn-modo-examen';
    btn.innerHTML = '🔥 Iniciar Modo Examen Real';
    btn.style.cssText = `
      display:block; margin:20px auto; padding:14px 28px; background:linear-gradient(135deg,#ef4444,#7c2d12);
      color:#fff; border:none; border-radius:30px; font-size:1em; font-weight:700;
      cursor:pointer; box-shadow:0 6px 20px rgba(239,68,68,.4); font-family:inherit;
      transition:transform .15s;
    `;
    btn.onmouseenter = () => btn.style.transform='scale(1.04)';
    btn.onmouseleave = () => btn.style.transform='scale(1)';
    btn.onclick = () => {
      // Estimar tiempo del simulacro (default 50 min)
      const titulo = sim.querySelector('h2')?.textContent || '';
      const m = titulo.match(/(\d+)\s*min/i);
      const minutos = m ? parseInt(m[1]) : 50;
      if(confirm(`Vas a iniciar el simulacro en MODO EXAMEN durante ${minutos} minutos.\n\n• Se ocultarán TODAS las soluciones\n• Pantalla completa\n• Cronómetro visible\n• Al terminar, podrás autocorregirte\n\n¿Empezamos?`)){
        ModoExamen.iniciar(minutos);
      }
    };
    sim.insertBefore(btn, sim.children[1] || sim.firstChild);
  }

  // ============= TUTOR IA (botón flotante que abre Claude) =============
  const TutorIA = {
    crear(){
      if(document.getElementById('mario-tutor')) return;
      const el = document.createElement('button');
      el.id = 'mario-tutor';
      el.innerHTML = '🤖';
      el.title = 'Pregúntale a Claude (Tutor IA)';
      el.style.cssText = `
        position:fixed; top:18px; right:18px; z-index:9999;
        background:linear-gradient(135deg,#7c2d12,#fbbf24); color:#fff;
        width:54px; height:54px; border-radius:50%; border:3px solid #fbbf24;
        cursor:pointer; font-size:1.7em; box-shadow:0 8px 24px rgba(0,0,0,.5);
        transition:transform .2s; padding:0;
      `;
      el.onmouseenter = () => el.style.transform='scale(1.1) rotate(10deg)';
      el.onmouseleave = () => el.style.transform='scale(1) rotate(0)';
      el.onclick = () => this.abrirChat();
      document.body.appendChild(el);
    },
    detectarContexto(){
      const asig = detectarAsignaturaActual();
      const cfg = CONFIG.asignaturas[asig];
      let tema = '';
      // Detectar sección visible
      const sec = document.querySelector('section.active');
      if(sec){
        const h2 = sec.querySelector('h2');
        if(h2) tema = h2.textContent.replace(/[🎧📋📖✏️🎯📝⚡🔥🚗🚀🍎❤️💧🫁🔄🩺📅🇪🇺🇪🇸🌾🏭🚚🌱👑🏛️📚📐⏰🛡️🔀🇬🇧✒️⚔️🔤✍️🎭]/g,'').trim();
      }
      return {asig, asigNombre: cfg?.nombre || 'estudios', tema};
    },
    abrirChat(){
      const ctx = this.detectarContexto();
      const promptUser = prompt(`🤖 ¡Hola Mario! Soy tu tutor IA.\n\nEstás en: ${ctx.asigNombre}${ctx.tema ? ' · ' + ctx.tema : ''}\n\n¿Qué duda tienes? Te abriré una conversación con Claude (gratis):`);
      if(!promptUser) return;
      const fullPrompt = `Soy Mario, estudiante de 3º ESO en el Colegio Zola Villafranca. Estoy estudiando ${ctx.asigNombre}${ctx.tema ? ' (tema: ' + ctx.tema + ')' : ''}.\n\nMi duda es: ${promptUser}\n\nExplícamelo de forma clara y adaptada a 3º ESO, con ejemplos si hace falta.`;
      const url = 'https://claude.ai/new?q=' + encodeURIComponent(fullPrompt);
      window.open(url, '_blank');
      sumarPuntos(ctx.asig || 'mate', 2, 'pregunta al tutor IA');
    }
  };

  // ============= INIT =============
  function init(){
    cargar();
    chequearRacha();
    crearBadge();
    Pomodoro.crear();
    TutorIA.crear();
    if('speechSynthesis' in window){
      AudioMario.cargarVoces();
      window.speechSynthesis.onvoiceschanged = () => AudioMario.cargarVoces();
      AudioMario.inyectarBotones();
    }
    interceptar();
    inyectarBotonExamen();
    actualizarBadge();
    // Exponer API
    window.MarioApp = {
      estado, sumarPuntos, registrarEjercicio, registrarQuiz, registrarSimulacro,
      desbloquearLogro, mostrarToast, AudioMario, Pomodoro, ModoExamen,
      progresoNivel, nivelDe, CONFIG, guardar, recargar: cargar
    };
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
