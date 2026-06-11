export default function DocumentationPage() {
  return (
    <>
      <a href="#main-content" className="skip-link" aria-label="Saltar al contenido principal">
        Saltar al contenido principal
      </a>
      <main id="main-content">
        <section className="doc-section" aria-label="Documentación del proyecto">
          <div className="container">
            <h1 className="section-title">Sobre el Proyecto</h1>
            <p className="doc-desc">Todo lo que necesitas saber sobre HistoriaVE.</p>
            <div className="doc-divider" aria-hidden="true"></div>
            <div className="doc-grid">
              <div className="doc-card">
                <p className="doc-card-question">Nombre del proyecto</p>
                <p className="doc-card-answer">
                  <strong>HistoriaVE</strong> — Línea de Tiempo Interactiva de Venezuela
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">¿Qué estamos construyendo?</p>
                <p className="doc-card-answer">
                  Una plataforma web interactiva que presenta la historia de Venezuela organizada en eras, con una línea de tiempo visual, eventos clave y un diseño moderno y accesible.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">¿Para quién es?</p>
                <p className="doc-card-answer">
                  Estudiantes, educadores, entusiastas de la historia y cualquier persona interesada en conocer los hitos que han forjado a Venezuela.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">¿Qué problema resuelve?</p>
                <p className="doc-card-answer">
                  Centraliza y presenta de forma clara, atractiva y accesible los principales acontecimientos históricos de Venezuela, facilitando el aprendizaje y la consulta rápida sin tener que buscar en múltiples fuentes dispersas.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">¿Cuál es la acción principal de la app?</p>
                <p className="doc-card-answer">
                  Explorar las eras históricas a través de una línea de tiempo interactiva tipo acordeón, donde el usuario puede expandir cada era para leer su resumen y los eventos más importantes.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">¿Cuál es la versión mínima que vamos a terminar?</p>
                <p className="doc-card-answer">
                  MVP funcional con 5 eras históricas, navegación fluida, diseño responsivo (oscuro, con colores Solana), despliegue en Vercel, menú con scroll spy y soporte básico de accesibilidad.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">Estado actual</p>
                <p className="doc-card-answer">
                  Versión inicial desplegada con estructura base funcional: línea de tiempo con 5 eras, navegación, scroll suave y diseño responsivo.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">Próximos pasos</p>
                <p className="doc-card-answer">
                  Ampliar contenido histórico, agregar búsqueda o filtros, mejorar la accesibilidad, soporte multilenguaje y nuevas visualizaciones interactivas.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">Pasaporte Histórico</p>
                <p className="doc-card-answer">
                  Es un registro de tu progreso educativo asociado a tu wallet de Solana. Conecta tu wallet con el botón en el navbar, completa los cuestionarios y reclama sellos históricos en la blockchain para desbloquear nuevas eras. Puedes ver tu progreso desde <strong>Mi Pasaporte</strong> en el navbar.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">¿Cómo funcionan los sellos?</p>
                <p className="doc-card-answer">
                  Cada era histórica tiene un cuestionario. Si obtienes <strong>70% o más</strong>, puedes reclamar un <strong>Sello Histórico</strong> en Solana Devnet. Al reclamarlo se envía una transacción simbólica de 0.000001 SOL a la treasury del proyecto, registrando tu logro en la blockchain. El sello no se otorga automáticamente: debes presionar el botón <strong>"Reclamar Sello Histórico"</strong> y firmar la transacción con tu wallet.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">Desbloqueo progresivo</p>
                <p className="doc-card-answer">
                  Las eras se desbloquean de forma secuencial. Solo la <strong>Era Prehispánica</strong> está disponible al inicio. Para desbloquear la siguiente era debes: aprobar el cuestionario con 70%+ <strong>y</strong> reclamar el sello en Solana. Sin el sello reclamado en la blockchain, la siguiente era permanece bloqueada.
                </p>
              </div>
              <div className="doc-card">
                <p className="doc-card-question">Equipo / roles</p>
                <p className="doc-card-answer">
                  <strong>David Mijares</strong> — Desarrollador
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
