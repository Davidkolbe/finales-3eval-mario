/* ===============================
   GENERADOR INFINITO DE EJERCICIOS
   =============================== */

(function(){
  'use strict';

  function rndInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function rndChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function round(n, d){ const f = Math.pow(10,d||2); return Math.round(n*f)/f; }

  // ============= MATEMÁTICAS =============
  const Mate = {
    pitagoras(){
      // Triángulo rectángulo: dados 2 catetos, calcular hipotenusa (o viceversa)
      const tipo = rndChoice(['hip','cat']);
      if(tipo === 'hip'){
        const b = rndInt(3,12), c = rndInt(3,12);
        const a = Math.sqrt(b*b + c*c);
        return {
          enunciado: `Un triángulo rectángulo tiene catetos de <strong>${b} cm</strong> y <strong>${c} cm</strong>. ¿Cuánto mide la hipotenusa? (redondea a 2 decimales)`,
          respuesta: round(a, 2),
          tolerancia: 0.05,
          unidad: 'cm',
          solucion: `Por Pitágoras: a² = b² + c² → a² = ${b}² + ${c}² = ${b*b} + ${c*c} = ${b*b+c*c} → a = √${b*b+c*c} ≈ <strong>${round(a,2)} cm</strong>`
        };
      } else {
        const a = rndInt(10,20), b = rndInt(3,a-2);
        const c = Math.sqrt(a*a - b*b);
        return {
          enunciado: `La hipotenusa de un triángulo rectángulo mide <strong>${a} cm</strong> y un cateto mide <strong>${b} cm</strong>. ¿Cuánto mide el otro cateto? (2 decimales)`,
          respuesta: round(c, 2),
          tolerancia: 0.05,
          unidad: 'cm',
          solucion: `c² = a² − b² = ${a*a} − ${b*b} = ${a*a-b*b} → c = √${a*a-b*b} ≈ <strong>${round(c,2)} cm</strong>`
        };
      }
    },
    conversion(){
      const tipo = rndChoice(['kmh_ms','ms_kmh']);
      if(tipo === 'kmh_ms'){
        const v = rndChoice([18,36,54,72,90,108,126,144]);
        return {
          enunciado: `Convierte <strong>${v} km/h</strong> a m/s.`,
          respuesta: v/3.6,
          tolerancia: 0.05,
          unidad: 'm/s',
          solucion: `${v} ÷ 3,6 = <strong>${round(v/3.6,2)} m/s</strong>`
        };
      } else {
        const v = rndChoice([5,10,15,20,25,30,40]);
        return {
          enunciado: `Convierte <strong>${v} m/s</strong> a km/h.`,
          respuesta: v*3.6,
          tolerancia: 0.05,
          unidad: 'km/h',
          solucion: `${v} × 3,6 = <strong>${round(v*3.6,2)} km/h</strong>`
        };
      }
    },
    vectorModulo(){
      const x = rndInt(-9,9) || 3;
      const y = rndInt(-9,9) || 4;
      const m = Math.sqrt(x*x + y*y);
      return {
        enunciado: `Calcula el módulo del vector <strong>v = (${x}, ${y})</strong>. (2 decimales)`,
        respuesta: round(m, 2),
        tolerancia: 0.05,
        solucion: `|v| = √(${x}² + ${y}²) = √(${x*x} + ${y*y}) = √${x*x+y*y} ≈ <strong>${round(m,2)}</strong>`
      };
    },
    vectorCoord(){
      const ax = rndInt(-5,5), ay = rndInt(-5,5);
      const bx = rndInt(-5,5), by = rndInt(-5,5);
      return {
        enunciado: `Dados los puntos A(${ax}, ${ay}) y B(${bx}, ${by}), ¿cuáles son las coordenadas del vector AB? Responde como "x, y".`,
        respuesta: `${bx-ax},${by-ay}`,
        tipoRespuesta: 'texto',
        validar: (r) => {
          const partes = r.replace(/\s/g,'').split(',');
          return partes.length === 2 && parseInt(partes[0]) === bx-ax && parseInt(partes[1]) === by-ay;
        },
        solucion: `AB = (xB − xA, yB − yA) = (${bx} − ${ax}, ${by} − ${ay}) = <strong>(${bx-ax}, ${by-ay})</strong>`
      };
    },
    areaCubo(){
      const L = rndInt(2,12);
      const A = 6*L*L;
      return {
        enunciado: `Calcula el área TOTAL de un cubo de arista <strong>${L} cm</strong>.`,
        respuesta: A,
        unidad: 'cm²',
        solucion: `Un cubo tiene 6 caras cuadradas. A = 6 · L² = 6 · ${L}² = 6 · ${L*L} = <strong>${A} cm²</strong>`
      };
    },
    volumenCilindro(){
      const r = rndInt(2,8), h = rndInt(5,20);
      const V = Math.PI * r*r * h;
      return {
        enunciado: `Calcula el volumen de un cilindro de radio <strong>${r} cm</strong> y altura <strong>${h} cm</strong>. (1 decimal, usa π = 3,14)`,
        respuesta: round(3.14*r*r*h, 1),
        tolerancia: 1.5,
        unidad: 'cm³',
        solucion: `V = π · r² · h = 3,14 · ${r}² · ${h} = 3,14 · ${r*r*h} ≈ <strong>${round(3.14*r*r*h,1)} cm³</strong>`
      };
    },
    semejanza(){
      const k = rndChoice([2,3,4,5]);
      const tipo = rndChoice(['area','vol']);
      if(tipo === 'area'){
        const A = rndChoice([10,15,20,25,30,50]);
        return {
          enunciado: `Dos figuras son semejantes con razón <strong>k = ${k}</strong>. Si la primera tiene un área de <strong>${A} cm²</strong>, ¿cuánto vale el área de la segunda?`,
          respuesta: A * k * k,
          unidad: 'cm²',
          solucion: `El área se multiplica por k². A' = ${A} · ${k}² = ${A} · ${k*k} = <strong>${A*k*k} cm²</strong>`
        };
      } else {
        const V = rndChoice([5,10,20,30]);
        return {
          enunciado: `Dos cuerpos son semejantes con razón <strong>k = ${k}</strong>. Si el primero tiene un volumen de <strong>${V} cm³</strong>, ¿cuánto vale el volumen del segundo?`,
          respuesta: V * k * k * k,
          unidad: 'cm³',
          solucion: `El volumen se multiplica por k³. V' = ${V} · ${k}³ = ${V} · ${k*k*k} = <strong>${V*k*k*k} cm³</strong>`
        };
      }
    },
    pendiente(){
      const x1 = rndInt(-5,5), y1 = rndInt(-5,5);
      let x2 = rndInt(-5,5);
      while(x2 === x1) x2 = rndInt(-5,5);
      const y2 = rndInt(-5,5);
      const m = (y2-y1)/(x2-x1);
      return {
        enunciado: `Calcula la pendiente de la recta que pasa por P(${x1}, ${y1}) y Q(${x2}, ${y2}). (2 decimales)`,
        respuesta: round(m, 2),
        tolerancia: 0.05,
        solucion: `m = (y₂ − y₁) / (x₂ − x₁) = (${y2} − ${y1}) / (${x2} − ${x1}) = ${y2-y1} / ${x2-x1} ≈ <strong>${round(m,2)}</strong>`
      };
    },
    generadores: ['pitagoras','conversion','vectorModulo','vectorCoord','areaCubo','volumenCilindro','semejanza','pendiente'],
    nombres: {
      pitagoras:'🔺 Pitágoras', conversion:'🔄 Conversiones', vectorModulo:'📏 Módulo de vector',
      vectorCoord:'🧭 Coordenadas vector', areaCubo:'⬛ Área cubo', volumenCilindro:'🥫 Volumen cilindro',
      semejanza:'📐 Semejanza', pendiente:'📈 Pendiente'
    }
  };

  // ============= FÍSICA =============
  const Fisica = {
    mru_distancia(){
      const v = rndChoice([10,15,20,25,30]);
      const t = rndInt(3,30);
      return {
        enunciado: `Un coche se mueve a <strong>${v} m/s</strong> durante <strong>${t} s</strong>. ¿Qué distancia recorre? (MRU)`,
        respuesta: v*t,
        unidad: 'm',
        solucion: `e = v · t = ${v} · ${t} = <strong>${v*t} m</strong>`
      };
    },
    mru_tiempo(){
      const v = rndChoice([10,15,20,25,30]);
      const e = v * rndInt(5,40);
      return {
        enunciado: `Un coche viaja a <strong>${v} m/s</strong> y recorre <strong>${e} m</strong>. ¿Cuánto tiempo tarda?`,
        respuesta: e/v,
        unidad: 's',
        solucion: `t = e / v = ${e} / ${v} = <strong>${e/v} s</strong>`
      };
    },
    aceleracion(){
      const v0 = rndChoice([0,5,10,15,20]);
      const v = v0 + rndInt(5,30);
      const t = rndInt(2,15);
      const a = (v-v0)/t;
      return {
        enunciado: `Un coche pasa de <strong>${v0} m/s</strong> a <strong>${v} m/s</strong> en <strong>${t} segundos</strong>. ¿Cuál es su aceleración? (2 decimales)`,
        respuesta: round(a, 2),
        tolerancia: 0.05,
        unidad: 'm/s²',
        solucion: `a = (v − v₀) / t = (${v} − ${v0}) / ${t} = ${v-v0}/${t} ≈ <strong>${round(a,2)} m/s²</strong>`
      };
    },
    mrua_velocidad(){
      const v0 = rndChoice([0,5,10,15]);
      const a = rndChoice([1,2,3,4,5]);
      const t = rndInt(3,20);
      const v = v0 + a*t;
      return {
        enunciado: `Un cuerpo parte con velocidad inicial <strong>${v0} m/s</strong> y acelera a <strong>${a} m/s²</strong>. ¿Qué velocidad tiene a los <strong>${t} s</strong>?`,
        respuesta: v,
        unidad: 'm/s',
        solucion: `v = v₀ + a · t = ${v0} + ${a} · ${t} = <strong>${v} m/s</strong>`
      };
    },
    caidaLibre(){
      const t = rndChoice([1,2,3,4,5]);
      const h = 0.5 * 10 * t * t; // g=10 simplificado
      return {
        enunciado: `Una piedra cae desde una torre durante <strong>${t} segundos</strong>. ¿Qué altura tiene la torre? (g = 10 m/s²)`,
        respuesta: h,
        unidad: 'm',
        solucion: `h = ½ · g · t² = ½ · 10 · ${t}² = 5 · ${t*t} = <strong>${h} m</strong>`
      };
    },
    tiroVertical(){
      const v0 = rndChoice([10,15,20,25,30]);
      const hMax = (v0*v0)/(2*10);
      return {
        enunciado: `Lanzamos una pelota hacia arriba con velocidad inicial <strong>${v0} m/s</strong>. ¿Qué altura máxima alcanza? (g = 10 m/s²)`,
        respuesta: hMax,
        tolerancia: 0.5,
        unidad: 'm',
        solucion: `h_max = v₀² / (2g) = ${v0}² / 20 = ${v0*v0} / 20 = <strong>${hMax} m</strong>`
      };
    },
    tiempoSubida(){
      const v0 = rndInt(10,40);
      const t = v0/10;
      return {
        enunciado: `Lanzamos una pelota hacia arriba a <strong>${v0} m/s</strong>. ¿Cuánto tarda en alcanzar la altura máxima? (g = 10 m/s²)`,
        respuesta: t,
        tolerancia: 0.05,
        unidad: 's',
        solucion: `t_subida = v₀ / g = ${v0} / 10 = <strong>${t} s</strong>`
      };
    },
    generadores: ['mru_distancia','mru_tiempo','aceleracion','mrua_velocidad','caidaLibre','tiroVertical','tiempoSubida'],
    nombres: {
      mru_distancia:'🚗 MRU - Distancia', mru_tiempo:'⏱️ MRU - Tiempo',
      aceleracion:'⚡ Aceleración', mrua_velocidad:'🚀 MRUA - Velocidad final',
      caidaLibre:'🍎 Caída libre', tiroVertical:'⬆️ Tiro vertical (h_max)',
      tiempoSubida:'⏰ Tiempo de subida'
    }
  };

  // ============= LENGUA =============
  const Lengua = {
    tildes(){
      const palabras = [
        ['canción','aguda terminada en n'],
        ['árbol','llana terminada en consonante distinta de n/s'],
        ['música','esdrújula'],
        ['cantar','aguda terminada en r → no lleva tilde'],
        ['lápiz','llana terminada en z'],
        ['fácil','llana terminada en l'],
        ['también','aguda terminada en n'],
        ['pájaro','esdrújula'],
        ['esdrújula','esdrújula'],
        ['café','aguda terminada en vocal'],
        ['cantábamos','esdrújula'],
        ['ratón','aguda terminada en n']
      ];
      const [palabra, motivo] = rndChoice(palabras);
      const sinTilde = palabra.normalize('NFD').replace(/[̀-ͯ]/g,'');
      const tieneTilde = palabra !== sinTilde;
      return {
        enunciado: `¿La palabra "<strong>${sinTilde}</strong>" lleva tilde? (responde "sí" o "no")`,
        respuesta: tieneTilde ? 'sí' : 'no',
        tipoRespuesta: 'texto',
        validar: (r) => {
          const norm = r.toLowerCase().trim().replace('si','sí');
          return norm === (tieneTilde?'sí':'no');
        },
        solucion: `<strong>${palabra}</strong> ${tieneTilde?'lleva tilde':'NO lleva tilde'} → ${motivo}.`
      };
    },
    diacritica(){
      const pares = [
        {frase: 'Mi padre y ___ amigo (yo) iremos al cine.', ops:['mi','mí'], correcta: 'mí', motivo:'pronombre tras preposición'},
        {frase: '___ casa es bonita. (posesivo)', ops:['Mi','Mí'], correcta: 'Mi', motivo:'posesivo'},
        {frase: '___ que vendrás. (verbo saber)', ops:['Se','Sé'], correcta: 'Sé', motivo:'verbo saber'},
        {frase: '___ lava las manos. (pronombre)', ops:['Se','Sé'], correcta: 'Se', motivo:'pronombre reflexivo'},
        {frase: '___ vienes al cine. (pronombre, sujeto)', ops:['Tu','Tú'], correcta: 'Tú', motivo:'pronombre'},
        {frase: '___ libro está aquí. (posesivo)', ops:['Tu','Tú'], correcta: 'Tu', motivo:'posesivo'},
        {frase: 'Quiero ___ café. (sustantivo)', ops:['te','té'], correcta: 'té', motivo:'sustantivo (bebida)'},
        {frase: '¡___ veo después! (pronombre)', ops:['Te','Té'], correcta: 'Te', motivo:'pronombre'},
        {frase: '¿Vienes ___ no? (= o no, conjunción)', ops:['si','sí'], correcta: 'si', motivo:'conjunción condicional'},
        {frase: '___, quiero ir. (afirmación)', ops:['Si','Sí'], correcta: 'Sí', motivo:'afirmación'},
      ];
      const ej = rndChoice(pares);
      return {
        enunciado: `Completa correctamente: "${ej.frase.replace('___','______')}"`,
        opciones: ej.ops,
        respuesta: ej.correcta,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.correcta}</strong> — ${ej.motivo}.`
      };
    },
    homofonos(){
      const ej = rndChoice([
        {frase:'______ que estudiar mucho.', op:'hay', otros:['ahí','ay'], motivo:'verbo haber, existencia'},
        {frase:'Mi hermano ______ vuelto pronto.', op:'ha', otros:['a','ah'], motivo:'auxiliar haber + participio'},
        {frase:'Voy ______ casa.', op:'a', otros:['ha','ah'], motivo:'preposición'},
        {frase:'El libro está ______.', op:'ahí', otros:['hay','ay'], motivo:'adverbio de lugar'},
        {frase:'¡______, qué dolor!', op:'ay', otros:['ahí','hay'], motivo:'interjección'},
        {frase:'He ______ los deberes.', op:'hecho', otros:['echo'], motivo:'participio del verbo hacer'},
        {frase:'Te ______ de menos.', op:'echo', otros:['hecho'], motivo:'verbo echar'},
        {frase:'Cuando ______ terminado, llámame.', op:'haya', otros:['halla'], motivo:'verbo haber subjuntivo'},
        {frase:'Se ______ en Madrid.', op:'halla', otros:['haya'], motivo:'verbo hallar = encontrarse'}
      ]);
      const opciones = [ej.op, ...ej.otros].sort(() => Math.random()-0.5);
      return {
        enunciado: `Completa: "${ej.frase}"`,
        opciones,
        respuesta: ej.op,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.op}</strong> — ${ej.motivo}.`
      };
    },
    tipoOracion(){
      const ej = rndChoice([
        {frase:'Estudia para que apruebes.', tipo:'Subordinada adverbial final'},
        {frase:'Vino, vio y venció.', tipo:'Coordinada copulativa'},
        {frase:'Aunque llueva, iremos al parque.', tipo:'Subordinada adverbial concesiva'},
        {frase:'Me dijo que llegaría tarde.', tipo:'Subordinada sustantiva (CD)'},
        {frase:'El libro que me prestaste es bueno.', tipo:'Subordinada adjetiva (de relativo)'},
        {frase:'O estudias o repites curso.', tipo:'Coordinada disyuntiva'},
        {frase:'Cuando llegues, llámame.', tipo:'Subordinada adverbial temporal'},
        {frase:'Llegamos pronto; nadie estaba.', tipo:'Yuxtapuesta'},
        {frase:'Si vienes, te invito.', tipo:'Subordinada adverbial condicional'},
        {frase:'Quería ir, pero no pude.', tipo:'Coordinada adversativa'}
      ]);
      const opciones = [ej.tipo, 'Coordinada copulativa', 'Subordinada sustantiva (CD)', 'Yuxtapuesta'].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
      while(opciones.length < 4){
        const extra = rndChoice(['Subordinada adverbial causal','Subordinada adjetiva (de relativo)','Coordinada disyuntiva']);
        if(!opciones.includes(extra)) opciones.push(extra);
      }
      return {
        enunciado: `¿Qué tipo de oración compuesta es?<br><em>"${ej.frase}"</em>`,
        opciones: opciones.sort(()=>Math.random()-0.5),
        respuesta: ej.tipo,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.tipo}</strong>`
      };
    },
    generadores: ['tildes','diacritica','homofonos','tipoOracion'],
    nombres: {
      tildes:'🔤 Tildes', diacritica:'✏️ Tilde diacrítica',
      homofonos:'📝 Homófonos', tipoOracion:'🌳 Tipos de oración'
    }
  };

  // ============= INGLÉS =============
  const Ingles = {
    irregularPast(){
      const verbos = [
        ['go','went'],['eat','ate'],['take','took'],['see','saw'],['write','wrote'],
        ['drink','drank'],['drive','drove'],['speak','spoke'],['know','knew'],
        ['begin','began'],['break','broke'],['buy','bought'],['bring','brought'],
        ['come','came'],['do','did'],['fall','fell'],['find','found'],['get','got'],
        ['give','gave'],['have','had'],['make','made'],['think','thought'],['tell','told']
      ];
      const [inf, past] = rndChoice(verbos);
      return {
        enunciado: `What is the past simple of <strong>"${inf}"</strong>?`,
        respuesta: past,
        tipoRespuesta: 'texto',
        validar: (r) => r.toLowerCase().trim() === past,
        solucion: `<strong>${inf} → ${past}</strong>`
      };
    },
    fillTense(){
      const ej = rndChoice([
        {frase:'I _____ (live) in Madrid for 5 years.', op:'have lived', tense:'present perfect (con "for")'},
        {frase:'She _____ (work) here every day.', op:'works', tense:'present simple (rutina)'},
        {frase:'They _____ (watch) TV when I called.', op:'were watching', tense:'past continuous (interrumpido)'},
        {frase:'Look! It _____ (rain).', op:'is raining', tense:'present continuous (acción ahora)'},
        {frase:'Yesterday I _____ (go) to the park.', op:'went', tense:'past simple'},
        {frase:'When I arrived, the train _____ (already / leave).', op:'had already left', tense:'past perfect'},
        {frase:'Tomorrow I _____ (visit) my grandmother.', op:'am going to visit', tense:'going to (plan)'},
        {frase:'Look at those clouds! It _____ (rain).', op:'is going to rain', tense:'going to (predicción evidencia)'}
      ]);
      const opciones = [ej.op, 'have lived', 'works', 'went', 'is raining'].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
      while(opciones.length < 4){
        const e = rndChoice(['lived','will live','was living','has worked']);
        if(!opciones.includes(e)) opciones.push(e);
      }
      return {
        enunciado: `Complete: "${ej.frase}"`,
        opciones: opciones.sort(()=>Math.random()-0.5),
        respuesta: ej.op,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.op}</strong> — ${ej.tense}.`
      };
    },
    conditional(){
      const ej = rndChoice([
        {frase:'If it _____ tomorrow, we will stay at home.', op:'rains', otros:['will rain','rained','would rain'], tipo:'1st conditional'},
        {frase:'If I _____ rich, I would travel the world.', op:'were', otros:['am','would be','will be'], tipo:'2nd conditional (with "be")'},
        {frase:'If you heat ice, it _____.', op:'melts', otros:['will melt','melted','would melt'], tipo:'0 conditional (verdad general)'},
        {frase:'If she studied more, she _____ pass.', op:'would', otros:['will','can','must'], tipo:'2nd conditional'},
        {frase:'If you don\'t hurry, you _____ miss the bus.', op:'will', otros:['would','can\'t','do'], tipo:'1st conditional'}
      ]);
      const opciones = [ej.op, ...ej.otros].sort(()=>Math.random()-0.5);
      return {
        enunciado: `Complete: "${ej.frase}"`,
        opciones,
        respuesta: ej.op,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.op}</strong> — ${ej.tipo}.`
      };
    },
    modal(){
      const ej = rndChoice([
        {frase:'You _____ smoke here. It\'s prohibited.', op:'mustn\'t', otros:['don\'t have to','should','can']},
        {frase:'It _____ rain. I see dark clouds.', op:'might', otros:['must','can','should']},
        {frase:'You _____ go to bed early. You look tired.', op:'should', otros:['must','can','would']},
        {frase:'I _____ swim very fast.', op:'can', otros:['must','should','have to']},
        {frase:'_____ you help me, please?', op:'Could', otros:['Must','Should','May']}
      ]);
      const opciones = [ej.op, ...ej.otros].sort(()=>Math.random()-0.5);
      return {
        enunciado: `Complete: "${ej.frase}"`,
        opciones,
        respuesta: ej.op,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.op}</strong>`
      };
    },
    generadores: ['irregularPast','fillTense','conditional','modal'],
    nombres: {
      irregularPast:'📝 Past simple irregular', fillTense:'⏰ Verb tenses',
      conditional:'🔀 Conditionals', modal:'🛡️ Modal verbs'
    }
  };

  // ============= HISTORIA =============
  const Historia = {
    glosario(){
      const ej = rndChoice([
        {q:'¿Qué es un latifundio?', op:'Explotación agraria de gran tamaño', otros:['Explotación pequeña','Tipo de paisaje','Ganadería trashumante']},
        {q:'¿En qué consiste el "encasillado"?', op:'Pacto previo de qué diputados saldrían elegidos', otros:['Sistema de votación oficial','Tipo de fraude bancario','Constitución de 1876']},
        {q:'¿Qué supuso la Crisis del 98?', op:'Pérdida de Cuba, Puerto Rico y Filipinas', otros:['Pérdida de Marruecos','Final de la Restauración','Inicio de la Guerra Civil']},
        {q:'¿Quién fundó el PSOE en 1879?', op:'Pablo Iglesias', otros:['Cánovas del Castillo','Sagasta','Joaquín Costa']},
        {q:'¿Qué es la acuicultura?', op:'Cría de especies acuáticas en cautividad', otros:['Pesca lejos de la costa','Ganadería del agua','Tipo de marea']},
        {q:'¿Cuándo fue el Tratado de París que cerró la guerra hispano-americana?', op:'1898', otros:['1874','1885','1902']},
        {q:'¿Quién proclamó rey a Alfonso XII en 1874?', op:'Martínez Campos', otros:['Cánovas','Sagasta','María Cristina']},
        {q:'¿Qué fueron las Desamortizaciones?', op:'Venta forzosa de tierras de la Iglesia y municipios', otros:['Reformas educativas','Pactos políticos','Movimientos artísticos']},
        {q:'¿Qué tipo de energía NO es renovable?', op:'Carbón', otros:['Solar','Eólica','Hidráulica']},
        {q:'¿Qué es la dependencia energética?', op:'Necesidad de importar energía', otros:['Cantidad de electricidad usada','Tipo de central','Acuerdo internacional']}
      ]);
      const opciones = [ej.op, ...ej.otros].sort(()=>Math.random()-0.5);
      return {
        enunciado: ej.q,
        opciones,
        respuesta: ej.op,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.op}</strong>`
      };
    },
    fechas(){
      const ej = rndChoice([
        {q:'Año en que comenzó la Restauración (Alfonso XII proclamado rey)', resp:'1874'},
        {q:'Año de la Constitución española de la Restauración', resp:'1876'},
        {q:'Año en que muere Alfonso XII', resp:'1885'},
        {q:'Año del Tratado de París (pérdida de Cuba, P.Rico y Filipinas)', resp:'1898'},
        {q:'Año de fundación del PSOE', resp:'1879'},
        {q:'Año de la Desamortización de Mendizábal', resp:'1836'},
        {q:'Año de la Desamortización de Madoz', resp:'1855'}
      ]);
      return {
        enunciado: ej.q + ':',
        respuesta: ej.resp,
        tipoRespuesta: 'texto',
        validar: (r) => r.trim() === ej.resp,
        solucion: `<strong>${ej.resp}</strong>`
      };
    },
    generadores: ['glosario','fechas'],
    nombres: {glosario:'📚 Glosario y conceptos', fechas:'📅 Fechas clave'}
  };

  // ============= BIOLOGÍA =============
  const Biologia = {
    quizBio(){
      const ej = rndChoice([
        {q:'¿Cuál es la unidad funcional del riñón?', op:'La nefrona', otros:['El alvéolo','El glóbulo blanco','El uréter']},
        {q:'¿Dónde ocurre la filtración de la sangre?', op:'En el glomérulo', otros:['En el túbulo','En la pelvis','En la vejiga']},
        {q:'¿Qué cavidad bombea la sangre al cuerpo?', op:'Ventrículo izquierdo', otros:['Aurícula derecha','Aurícula izquierda','Ventrículo derecho']},
        {q:'¿La arteria pulmonar lleva sangre con...?', op:'Poco O₂ (rica en CO₂)', otros:['Mucho O₂','Solo plasma','Sin glóbulos rojos']},
        {q:'¿Qué proteína transporta el O₂ en la sangre?', op:'Hemoglobina', otros:['Plasma','Fibrina','Plaquetas']},
        {q:'¿En la espiración, el diafragma...?', op:'Se relaja y sube', otros:['Se contrae y baja','Se queda quieto','Vibra']},
        {q:'¿Cuántos uréteres tiene una persona?', op:'2', otros:['1','3','4']},
        {q:'¿Qué es la reabsorción en la nefrona?', op:'Recuperar sustancias útiles del túbulo a la sangre', otros:['Pasar todo al túbulo','Producir orina en la vejiga','Eliminar el sudor']},
        {q:'¿Dónde se almacena la orina antes de expulsarla?', op:'En la vejiga', otros:['En los riñones','En los uréteres','En la uretra']},
        {q:'¿Cuál es la función principal del aparato respiratorio?', op:'Intercambio gaseoso (O₂/CO₂)', otros:['Transportar O₂ por el cuerpo','Producir energía','Eliminar urea']},
        {q:'En los alvéolos ocurre el intercambio por...', op:'Difusión', otros:['Filtración','Reabsorción','Secreción']}
      ]);
      const opciones = [ej.op, ...ej.otros].sort(()=>Math.random()-0.5);
      return {
        enunciado: ej.q,
        opciones,
        respuesta: ej.op,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${ej.op}</strong>`
      };
    },
    ordenar(){
      const ej = rndChoice([
        {q:'Recorrido del aire al inhalar', orden:['Fosas nasales','Faringe','Laringe','Tráquea','Bronquios','Alvéolos']},
        {q:'Etapas de formación de la orina', orden:['Filtración','Reabsorción','Secreción']},
        {q:'Recorrido de la orina', orden:['Riñón','Uréter','Vejiga','Uretra']},
        {q:'Capas del riñón (de fuera a dentro)', orden:['Cápsula fibrosa','Corteza','Médula','Pelvis renal']}
      ]);
      // Devolvemos un quiz de 4 opciones donde la correcta es la secuencia ordenada
      const correcto = ej.orden.join(' → ');
      const desorden1 = [...ej.orden].sort(()=>Math.random()-0.5).join(' → ');
      const desorden2 = [...ej.orden].reverse().join(' → ');
      const desorden3 = [...ej.orden].sort(()=>Math.random()-0.5).join(' → ');
      const opciones = [correcto, desorden1, desorden2, desorden3].filter((v,i,a)=>a.indexOf(v)===i);
      while(opciones.length < 3) opciones.push(opciones[0]+' (X)');
      return {
        enunciado: `${ej.q}. Ordena correctamente:`,
        opciones: opciones.sort(()=>Math.random()-0.5).slice(0,4),
        respuesta: correcto,
        tipoRespuesta: 'opcion',
        solucion: `<strong>${correcto}</strong>`
      };
    },
    generadores: ['quizBio','ordenar'],
    nombres: {quizBio:'🫁 Conceptos Bio', ordenar:'🔄 Ordenar secuencias'}
  };

  // ============= REGISTRO GLOBAL =============
  window.GeneradorEjercicios = {
    mate: Mate,
    fisica: Fisica,
    lengua: Lengua,
    ingles: Ingles,
    historia: Historia,
    biologia: Biologia
  };
})();
