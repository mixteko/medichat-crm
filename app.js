const STORAGE_KEY = "medichat-crm-state-v1";

const today = new Date();
const isoDate = (offset = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const money = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);

const timeLabel = (date, time) => `${date} ${time}`;

const seedState = {
  activeView: "dashboard",
  activeThreadId: "t1",
  cart: [],
  orders: [
    { id: "o1", patientId: "p2", total: 1240, date: isoDate(-1), status: "Entregado" },
  ],
  patients: [
    {
      id: "p1",
      name: "Mariana Lopez",
      phone: "+52 81 2040 1101",
      age: 34,
      condition: "Dermatitis",
      tags: ["Seguimiento", "WhatsApp"],
      lastVisit: isoDate(-14),
      notes: "Prefiere citas por la tarde. Enviar indicaciones por WhatsApp.",
    },
    {
      id: "p2",
      name: "Carlos Herrera",
      phone: "+52 81 1800 4420",
      age: 47,
      condition: "Diabetes tipo 2",
      tags: ["Control mensual", "Tienda"],
      lastVisit: isoDate(-5),
      notes: "Compra tiras reactivas y suplemento cada mes.",
    },
    {
      id: "p3",
      name: "Ana Torres",
      phone: "+52 81 7754 9012",
      age: 29,
      condition: "Consulta general",
      tags: ["Nuevo lead"],
      lastVisit: "Sin visita",
      notes: "Llego por campana de revision preventiva.",
    },
    {
      id: "p4",
      name: "Miguel Santos",
      phone: "+52 81 9900 2210",
      age: 61,
      condition: "Hipertension",
      tags: ["Riesgo", "Confirmar"],
      lastVisit: isoDate(-28),
      notes: "Necesita recordatorio 24 horas antes de cada cita.",
    },
  ],
  appointments: [
    {
      id: "a1",
      patientId: "p1",
      doctor: "Dra. Sofia Rivera",
      date: isoDate(0),
      time: "10:30",
      type: "Seguimiento",
      status: "Confirmada",
      notes: "Revisar evolucion del tratamiento.",
    },
    {
      id: "a2",
      patientId: "p2",
      doctor: "Dr. Andres Molina",
      date: isoDate(0),
      time: "12:00",
      type: "Consulta general",
      status: "Pendiente",
      notes: "Control de glucosa y presion.",
    },
    {
      id: "a3",
      patientId: "p4",
      doctor: "Dra. Laura Chen",
      date: isoDate(1),
      time: "09:00",
      type: "Seguimiento",
      status: "Reprogramar",
      notes: "Paciente pidio opcion mas tarde.",
    },
    {
      id: "a4",
      patientId: "p3",
      doctor: "Dra. Sofia Rivera",
      date: isoDate(3),
      time: "17:30",
      type: "Teleconsulta",
      status: "Confirmada",
      notes: "Enviar enlace 30 min antes.",
    },
  ],
  threads: [
    {
      id: "t1",
      patientId: "p1",
      status: "Abierto",
      intent: "Verificar cita",
      unread: 2,
      messages: [
        { from: "patient", text: "Hola, me puedes confirmar mi cita?", time: "09:12" },
        { from: "bot", text: "Claro, estoy revisando tu agenda medica.", time: "09:12" },
        { from: "patient", text: "Tambien necesito saber si llevo algun estudio.", time: "09:13" },
      ],
    },
    {
      id: "t2",
      patientId: "p2",
      status: "Bot activo",
      intent: "Compra tienda",
      unread: 0,
      messages: [
        { from: "patient", text: "Necesito tiras reactivas y vitaminas.", time: "08:40" },
        {
          from: "bot",
          text: "Tenemos tiras reactivas en stock. Puedo preparar tu pedido.",
          time: "08:41",
        },
      ],
    },
    {
      id: "t3",
      patientId: "p3",
      status: "Lead",
      intent: "Agendar",
      unread: 1,
      messages: [
        { from: "patient", text: "Quiero una consulta esta semana.", time: "Ayer" },
        { from: "bot", text: "Te puedo ofrecer horarios disponibles.", time: "Ayer" },
      ],
    },
  ],
  products: [
    {
      id: "pr1",
      name: "Tiras reactivas glucosa",
      category: "Monitoreo",
      price: 520,
      stock: 8,
      sku: "GLU-50",
    },
    {
      id: "pr2",
      name: "Gel antiseptico 500 ml",
      category: "Cuidado",
      price: 145,
      stock: 18,
      sku: "ANT-500",
    },
    {
      id: "pr3",
      name: "Suplemento vitamina D",
      category: "Suplementos",
      price: 310,
      stock: 5,
      sku: "VIT-D",
    },
    {
      id: "pr4",
      name: "Tensiometro digital",
      category: "Equipo medico",
      price: 980,
      stock: 3,
      sku: "TEN-DIG",
    },
    {
      id: "pr5",
      name: "Cubrebocas quirurgico",
      category: "Insumos",
      price: 95,
      stock: 40,
      sku: "CB-50",
    },
    {
      id: "pr6",
      name: "Termometro infrarrojo",
      category: "Equipo medico",
      price: 390,
      stock: 2,
      sku: "TER-IR",
    },
  ],
};

let state = loadState();

const titles = {
  dashboard: ["Operacion diaria", "Panel clinico"],
  inbox: ["Mensajeria y chatbot", "WhatsApp CRM"],
  agenda: ["Calendario medico", "Agenda de citas"],
  patients: ["Expedientes ligeros", "Pacientes"],
  store: ["Venta asistida", "Tienda medica"],
  automation: ["Flujos conversacionales", "Bot y experimentos"],
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const uid = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const normalize = (value) => String(value || "").toLowerCase().trim();

function loadState() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) return structuredClone(seedState);

  try {
    return { ...structuredClone(seedState), ...JSON.parse(cached) };
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function patientById(id) {
  return state.patients.find((patient) => patient.id === id);
}

function appointmentByPatient(patientId) {
  return state.appointments
    .filter((appointment) => appointment.patientId === patientId)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function matchesSearch(text) {
  const query = normalize(qs("#globalSearch").value);
  return !query || normalize(text).includes(query);
}

function render() {
  renderChrome();
  renderDashboard();
  renderInbox();
  renderAgenda();
  renderPatients();
  renderStore();
  renderAutomation();
  saveState();
}

function renderChrome() {
  qsa(".nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === state.activeView);
  });

  qsa(".view").forEach((view) => view.classList.remove("is-visible"));
  qs(`#${state.activeView}View`).classList.add("is-visible");
  const [eyebrow, title] = titles[state.activeView];
  qs("#viewEyebrow").textContent = eyebrow;
  qs("#viewTitle").textContent = title;

  const patientSelect = qs('#appointmentForm select[name="patientId"]');
  patientSelect.innerHTML = state.patients
    .map((patient) => `<option value="${patient.id}">${patient.name}</option>`)
    .join("");
}

function renderDashboard() {
  const todayAppointments = state.appointments.filter((item) => item.date === isoDate(0));
  const openThreads = state.threads.filter((thread) => thread.status !== "Cerrado");
  const lowStock = state.products.filter((product) => product.stock <= 5);
  const sales = state.orders.reduce((sum, order) => sum + order.total, 0);
  const nextAppointments = state.appointments
    .filter((appointment) => `${appointment.date} ${appointment.time}` >= `${isoDate(0)} 00:00`)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);

  qs("#dashboardView").innerHTML = `
    <div class="grid dashboard-grid">
      ${statCard("Citas hoy", todayAppointments.length, "Agenda preparada para recepcion")}
      ${statCard("Chats activos", openThreads.length, "WhatsApp, bot y asesores")}
      ${statCard("Stock bajo", lowStock.length, "Productos que requieren compra")}
      ${statCard("Ventas", money(sales), "Pedidos registrados")}
    </div>

    <div class="grid two-col" style="margin-top:16px">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Proximas citas</h2>
            <p>Ordenadas por fecha y hora</p>
          </div>
          <button class="ghost" data-action="open-appointment">Nueva cita</button>
        </div>
        <div class="list">
          ${nextAppointments.map(appointmentItem).join("") || empty("No hay citas proximas.")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Alertas operativas</h2>
            <p>Lo que conviene atender primero</p>
          </div>
        </div>
        <div class="list">
          ${openThreads
            .filter((thread) => thread.unread > 0)
            .map((thread) => {
              const patient = patientById(thread.patientId);
              return `<article class="list-item">
                <div class="list-top"><strong>${patient.name}</strong><span class="tag amber">${thread.unread} nuevo</span></div>
                <div class="meta-row"><span>${thread.intent}</span><span>${patient.phone}</span></div>
              </article>`;
            })
            .join("")}
          ${lowStock
            .map(
              (product) => `<article class="list-item">
                <div class="list-top"><strong>${product.name}</strong><span class="tag red">${product.stock} pzs</span></div>
                <div class="meta-row"><span>${product.category}</span><span>${product.sku}</span></div>
              </article>`,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function statCard(label, value, hint) {
  return `<article class="stat"><p>${label}</p><strong>${value}</strong><small>${hint}</small></article>`;
}

function appointmentItem(appointment) {
  const patient = patientById(appointment.patientId);
  return `<article class="list-item">
    <div class="list-top">
      <strong>${patient?.name || "Paciente"}</strong>
      ${statusTag(appointment.status)}
    </div>
    <div class="meta-row">
      <span>${timeLabel(appointment.date, appointment.time)}</span>
      <span>${appointment.doctor}</span>
      <span>${appointment.type}</span>
    </div>
    <p class="muted">${appointment.notes || "Sin notas"}</p>
    <div class="meta-row">
      <button class="compact" data-action="confirm-appointment" data-id="${appointment.id}">Confirmar</button>
      <button class="compact" data-action="reschedule-appointment" data-id="${appointment.id}">Reprogramar</button>
      <button class="compact" data-action="message-patient" data-patient="${appointment.patientId}">WhatsApp</button>
    </div>
  </article>`;
}

function statusTag(status) {
  const type = status === "Confirmada" ? "" : status === "Pendiente" ? "amber" : "red";
  return `<span class="tag ${type}">${status}</span>`;
}

function empty(text) {
  return `<div class="empty">${text}</div>`;
}

function renderInbox() {
  const threads = state.threads.filter((thread) => {
    const patient = patientById(thread.patientId);
    return matchesSearch(`${patient?.name} ${patient?.phone} ${thread.intent}`);
  });
  const activeThread = state.threads.find((thread) => thread.id === state.activeThreadId) || state.threads[0];
  const patient = patientById(activeThread?.patientId);
  const appointments = patient ? appointmentByPatient(patient.id) : [];

  qs("#inboxView").innerHTML = `
    <div class="inbox-layout">
      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Conversaciones</h2>
            <p>Inbox tipo WhatsApp</p>
          </div>
        </div>
        <div class="contact-list">
          ${
            threads
              .map((thread) => {
                const itemPatient = patientById(thread.patientId);
                const last = thread.messages[thread.messages.length - 1];
                return `<button class="contact-row ${thread.id === activeThread?.id ? "is-active" : ""}" data-action="select-thread" data-id="${thread.id}">
                  <span class="avatar">${initials(itemPatient.name)}</span>
                  <span>
                    <strong>${itemPatient.name}</strong>
                    <span>${last.text}</span>
                  </span>
                  ${thread.unread ? `<span class="tag amber">${thread.unread}</span>` : `<span class="tag">${thread.status}</span>`}
                </button>`;
              })
              .join("") || empty("No hay conversaciones con ese filtro.")
          }
        </div>
      </aside>

      <section class="panel chat-panel">
        <div class="chat-header">
          <div class="list-top">
            <div>
              <h2>${patient?.name || "Sin conversacion"}</h2>
              <p class="muted">${patient?.phone || ""} · ${activeThread?.intent || ""}</p>
            </div>
            ${activeThread ? `<span class="tag blue">${activeThread.status}</span>` : ""}
          </div>
        </div>
        <div class="chat-window" id="chatWindow">
          ${
            activeThread
              ? activeThread.messages
                  .map(
                    (message) => `<div class="bubble ${message.from === "patient" ? "" : "agent"}">
                      ${message.text}
                      <small>${message.from === "patient" ? "Paciente" : message.from === "bot" ? "Bot" : "Asesor"} · ${message.time}</small>
                    </div>`,
                  )
                  .join("")
              : empty("Selecciona una conversacion.")
          }
        </div>
        <div class="composer">
          <form class="composer-form" id="messageForm">
            <input name="message" autocomplete="off" placeholder="Escribe una respuesta..." ${activeThread ? "" : "disabled"} />
            <button class="primary" type="submit" ${activeThread ? "" : "disabled"}>Enviar</button>
          </form>
          <div class="quick-replies">
            <button class="compact" data-action="verify-appointment">Verificar cita</button>
            <button class="compact" data-action="send-prep">Indicaciones</button>
            <button class="compact" data-action="offer-slots">Horarios</button>
            <button class="compact" data-action="close-thread">Cerrar</button>
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Ficha rapida</h2>
            <p>Contexto para responder</p>
          </div>
        </div>
        ${
          patient
            ? `<div class="detail-stack">
              <article class="list-item">
                <strong>${patient.name}</strong>
                <div class="meta-row"><span>${patient.age} anos</span><span>${patient.condition}</span></div>
                <p class="muted">${patient.notes}</p>
              </article>
              <article class="list-item">
                <strong>Citas</strong>
                ${appointments.map((item) => `<div class="meta-row"><span>${timeLabel(item.date, item.time)}</span><span>${item.status}</span></div>`).join("") || "<p class='muted'>Sin citas</p>"}
              </article>
              <button class="primary" data-action="open-appointment" data-patient="${patient.id}">Agendar cita</button>
            </div>`
            : empty("Sin ficha activa.")
        }
      </aside>
    </div>
  `;

  const chatWindow = qs("#chatWindow");
  if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderAgenda() {
  const query = normalize(qs("#globalSearch").value);
  const appointments = state.appointments
    .filter((appointment) => {
      const patient = patientById(appointment.patientId);
      return !query || normalize(`${patient?.name} ${appointment.doctor} ${appointment.status} ${appointment.type}`).includes(query);
    })
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  qs("#agendaView").innerHTML = `
    <section class="panel">
      <div class="agenda-toolbar">
        <div>
          <h2>Calendario operativo</h2>
          <p class="muted">Gestiona confirmaciones, reprogramaciones y mensajes.</p>
        </div>
        <button class="primary" data-action="open-appointment">Nueva cita</button>
      </div>
      <div class="list">
        ${appointments.map(appointmentItem).join("") || empty("No hay citas con ese filtro.")}
      </div>
    </section>
  `;
}

function renderPatients() {
  const patients = state.patients.filter((patient) =>
    matchesSearch(`${patient.name} ${patient.phone} ${patient.condition} ${patient.tags.join(" ")}`),
  );

  qs("#patientsView").innerHTML = `
    <div class="grid two-col">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Directorio de pacientes</h2>
            <p>Base ligera lista para expediente completo.</p>
          </div>
        </div>
        <table class="patient-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Telefono</th>
              <th>Condicion</th>
              <th>Etiquetas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${
              patients
                .map(
                  (patient) => `<tr>
                    <td><strong>${patient.name}</strong><br><span class="muted">${patient.age} anos</span></td>
                    <td>${patient.phone}</td>
                    <td>${patient.condition}</td>
                    <td>${patient.tags.map((tag) => `<span class="tag">${tag}</span>`).join(" ")}</td>
                    <td><button class="compact" data-action="message-patient" data-patient="${patient.id}">WhatsApp</button></td>
                  </tr>`,
                )
                .join("") || `<tr><td colspan="5">${empty("Sin pacientes con ese filtro.")}</td></tr>`
            }
          </tbody>
        </table>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Alta rapida</h2>
            <p>Registra un paciente y abre su canal.</p>
          </div>
        </div>
        <form class="form-grid" id="patientForm">
          <label>Nombre<input name="name" required placeholder="Nombre completo"></label>
          <label>Telefono<input name="phone" required placeholder="+52 ..."></label>
          <label>Edad<input name="age" type="number" min="0" max="120" required></label>
          <label>Condicion<input name="condition" required placeholder="Motivo o diagnostico"></label>
          <label class="full">Notas<textarea name="notes" rows="4" placeholder="Preferencias, observaciones, recordatorios"></textarea></label>
          <button class="primary full" type="submit">Guardar paciente</button>
        </form>
      </section>
    </div>
  `;
}

function renderStore() {
  const products = state.products.filter((product) =>
    matchesSearch(`${product.name} ${product.category} ${product.sku}`),
  );
  const total = state.cart.reduce((sum, item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    return sum + (product?.price || 0) * item.qty;
  }, 0);

  qs("#storeView").innerHTML = `
    <div class="grid two-col">
      <section class="panel">
        <div class="store-toolbar">
          <div>
            <h2>Catalogo medico</h2>
            <p class="muted">Productos pequenos para venta asistida por chat.</p>
          </div>
        </div>
        <div class="products-grid">
          ${
            products
              .map(
                (product) => `<article class="product">
                  <div class="product-visual">${product.sku.split("-")[0]}</div>
                  <strong>${product.name}</strong>
                  <div class="meta-row"><span>${product.category}</span><span>${product.sku}</span></div>
                  <div class="list-top">
                    <span>${money(product.price)}</span>
                    <span class="tag ${product.stock <= 5 ? "red" : ""}">${product.stock} stock</span>
                  </div>
                  <button class="primary" data-action="add-cart" data-id="${product.id}" ${product.stock < 1 ? "disabled" : ""}>Agregar</button>
                </article>`,
              )
              .join("") || empty("No hay productos con ese filtro.")
          }
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Pedido actual</h2>
            <p>Puede enviarse al paciente por WhatsApp.</p>
          </div>
        </div>
        <div>
          ${
            state.cart.length
              ? state.cart
                  .map((item) => {
                    const product = state.products.find((entry) => entry.id === item.productId);
                    return `<div class="cart-line">
                      <div><strong>${product.name}</strong><br><span class="muted">${item.qty} x ${money(product.price)}</span></div>
                      <button class="icon-button" data-action="remove-cart" data-id="${item.productId}" aria-label="Quitar">x</button>
                    </div>`;
                  })
                  .join("")
              : empty("Agrega productos para crear un pedido.")
          }
        </div>
        <div class="total-row"><span>Total</span><span>${money(total)}</span></div>
        <div class="form-grid" style="margin-top:14px">
          <label class="full">Paciente
            <select id="orderPatient">
              ${state.patients.map((patient) => `<option value="${patient.id}">${patient.name}</option>`).join("")}
            </select>
          </label>
          <button class="primary full" data-action="complete-order" ${state.cart.length ? "" : "disabled"}>Registrar pedido</button>
        </div>
      </aside>
    </div>
  `;
}

function renderAutomation() {
  const flows = [
    {
      title: "Verificar cita",
      goal: "Responde fecha, hora, medico e indicaciones usando la agenda.",
      steps: ["Detectar telefono o nombre", "Buscar cita activa", "Enviar confirmacion y notas"],
      action: "verify-appointment",
    },
    {
      title: "Agendar consulta",
      goal: "Captura motivo, preferencia de horario y crea cita pendiente.",
      steps: ["Preguntar especialidad", "Ofrecer horarios", "Crear cita y notificar recepcion"],
      action: "offer-slots",
    },
    {
      title: "Venta por WhatsApp",
      goal: "Sugiere productos, valida stock y arma pedido.",
      steps: ["Identificar producto", "Confirmar disponibilidad", "Registrar pedido"],
      action: "store-demo",
    },
  ];

  qs("#automationView").innerHTML = `
    <div class="grid three-col">
      ${flows
        .map(
          (flow) => `<section class="panel flow-card">
            <div>
              <h2>${flow.title}</h2>
              <p class="muted">${flow.goal}</p>
            </div>
            <ol class="flow-steps">
              ${flow.steps.map((step, index) => `<li><span>${index + 1}</span>${step}</li>`).join("")}
            </ol>
            <button class="primary" data-action="${flow.action}">Probar flujo</button>
          </section>`,
        )
        .join("")}
    </div>

    <section class="panel" style="margin-top:16px">
      <div class="panel-header">
        <div>
          <h2>Reglas base del bot</h2>
          <p>Este prototipo separa la logica para despues conectarla a WhatsApp Business API.</p>
        </div>
      </div>
      <div class="grid three-col">
        <article class="list-item"><strong>Agenda</strong><p class="muted">Nunca confirma si la cita esta marcada como reprogramar. Pide autorizacion humana.</p></article>
        <article class="list-item"><strong>Privacidad</strong><p class="muted">Evita diagnosticos en automatico. Solo comparte datos administrativos.</p></article>
        <article class="list-item"><strong>Tienda</strong><p class="muted">Reserva stock cuando se registra pedido y avisa si quedan pocas piezas.</p></article>
      </div>
    </section>
  `;
}

function activeThread() {
  return state.threads.find((thread) => thread.id === state.activeThreadId);
}

function addMessage(threadId, from, text) {
  const thread = state.threads.find((item) => item.id === threadId);
  if (!thread) return;
  thread.messages.push({ from, text, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) });
  if (from !== "patient") thread.unread = 0;
}

function botVerifyAppointment(thread = activeThread()) {
  if (!thread) return;
  const patient = patientById(thread.patientId);
  const next = appointmentByPatient(patient.id).find((item) => item.status !== "Cancelada");
  const text = next
    ? `Tu proxima cita es ${timeLabel(next.date, next.time)} con ${next.doctor}. Estado: ${next.status}. ${next.notes || ""}`
    : "No encuentro una cita activa. Te paso con recepcion para ayudarte a agendar.";
  addMessage(thread.id, "bot", text);
  thread.intent = "Verificar cita";
}

function botOfferSlots(thread = activeThread()) {
  if (!thread) return;
  addMessage(
    thread.id,
    "bot",
    `Tengo espacios disponibles ${isoDate(1)} a las 09:00, ${isoDate(2)} a las 12:30 y ${isoDate(3)} a las 17:30. Cual prefieres?`,
  );
  thread.intent = "Agendar";
}

function openAppointment(patientId) {
  const dialog = qs("#appointmentDialog");
  const form = qs("#appointmentForm");
  form.reset();
  form.elements.date.value = isoDate(1);
  form.elements.time.value = "10:00";
  if (patientId) form.elements.patientId.value = patientId;
  dialog.showModal();
}

document.addEventListener("click", (event) => {
  const navItem = event.target.closest(".nav-item");
  if (navItem) {
    state.activeView = navItem.dataset.view;
    render();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const id = actionButton.dataset.id;
  const patientId = actionButton.dataset.patient;

  if (action === "open-appointment") openAppointment(patientId);
  if (action === "select-thread") {
    state.activeThreadId = id;
    const thread = activeThread();
    if (thread) thread.unread = 0;
    render();
  }
  if (action === "verify-appointment") {
    botVerifyAppointment();
    state.activeView = "inbox";
    render();
  }
  if (action === "send-prep") {
    const thread = activeThread();
    if (thread) addMessage(thread.id, "bot", "Indicaciones: llega 10 minutos antes, trae identificacion y estudios recientes si los tienes.");
    render();
  }
  if (action === "offer-slots") {
    botOfferSlots();
    state.activeView = "inbox";
    render();
  }
  if (action === "close-thread") {
    const thread = activeThread();
    if (thread) thread.status = "Cerrado";
    render();
  }
  if (action === "confirm-appointment") {
    const appointment = state.appointments.find((item) => item.id === id);
    if (appointment) appointment.status = "Confirmada";
    render();
  }
  if (action === "reschedule-appointment") {
    const appointment = state.appointments.find((item) => item.id === id);
    if (appointment) appointment.status = "Reprogramar";
    render();
  }
  if (action === "message-patient") {
    let thread = state.threads.find((item) => item.patientId === patientId);
    if (!thread) {
      thread = { id: uid("t"), patientId, status: "Abierto", intent: "Atencion", unread: 0, messages: [] };
      state.threads.unshift(thread);
    }
    state.activeThreadId = thread.id;
    state.activeView = "inbox";
    render();
  }
  if (action === "add-cart") {
    const line = state.cart.find((item) => item.productId === id);
    if (line) line.qty += 1;
    else state.cart.push({ productId: id, qty: 1 });
    render();
  }
  if (action === "remove-cart") {
    state.cart = state.cart.filter((item) => item.productId !== id);
    render();
  }
  if (action === "complete-order") completeOrder();
  if (action === "store-demo") {
    state.activeView = "store";
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "messageForm") {
    event.preventDefault();
    const thread = activeThread();
    const message = new FormData(event.target).get("message").trim();
    if (thread && message) {
      addMessage(thread.id, "agent", message);
      event.target.reset();
      render();
    }
  }

  if (event.target.id === "patientForm") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const patient = {
      id: uid("p"),
      name: data.name.trim(),
      phone: data.phone.trim(),
      age: Number(data.age),
      condition: data.condition.trim(),
      tags: ["Nuevo"],
      lastVisit: "Sin visita",
      notes: data.notes.trim() || "Sin notas.",
    };
    state.patients.unshift(patient);
    state.threads.unshift({
      id: uid("t"),
      patientId: patient.id,
      status: "Lead",
      intent: "Nuevo paciente",
      unread: 0,
      messages: [{ from: "bot", text: "Canal creado para seguimiento inicial.", time: "Ahora" }],
    });
    event.target.reset();
    render();
  }
});

qs("#appointmentForm").addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (submitter?.value === "cancel") return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  state.appointments.push({
    id: uid("a"),
    patientId: data.patientId,
    doctor: data.doctor,
    date: data.date,
    time: data.time,
    type: data.type,
    status: data.status,
    notes: data.notes.trim(),
  });
  qs("#appointmentDialog").close();
  state.activeView = "agenda";
  render();
});

qs("#quickAppointmentBtn").addEventListener("click", () => openAppointment());
qs("#globalSearch").addEventListener("input", render);

function completeOrder() {
  if (!state.cart.length) return;
  const patientId = qs("#orderPatient").value;
  let total = 0;
  const lines = state.cart.map((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    total += product.price * item.qty;
    product.stock = Math.max(0, product.stock - item.qty);
    return `${item.qty} x ${product.name}`;
  });

  state.orders.unshift({ id: uid("o"), patientId, total, date: isoDate(0), status: "Registrado" });
  let thread = state.threads.find((item) => item.patientId === patientId);
  if (!thread) {
    thread = { id: uid("t"), patientId, status: "Abierto", intent: "Pedido tienda", unread: 0, messages: [] };
    state.threads.unshift(thread);
  }
  addMessage(thread.id, "bot", `Pedido registrado: ${lines.join(", ")}. Total ${money(total)}. Podemos coordinar entrega o pickup.`);
  state.cart = [];
  state.activeThreadId = thread.id;
  state.activeView = "inbox";
  render();
}

render();
