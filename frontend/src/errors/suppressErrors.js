// Função para suprimir erros e avisos específicos no console
export const setupErrorSuppression = () => {
  // Salvar as funções originais
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Substituir console.error
  console.error = function filterErrors(msg, ...args) {
    if (typeof msg === 'string') {
      // Suprimir erro específico que estamos enfrentando
      if (msg.includes('No ticket found with this ID')) {
        return;
      }
      
      // Outros erros que podemos querer suprimir
      if (
        msg.includes('findDOMNode') || 
        msg.includes('validateDOMNesting') ||
        msg.includes('Failed prop type')
      ) {
        return;
      }
    }
    originalConsoleError(msg, ...args);
  };

  // Substituir console.warn
  console.warn = function filterWarnings(msg, ...args) {
    if (typeof msg === 'string') {
      // Suprimir avisos específicos
      if (
        msg.includes('Material-UI') || 
        msg.includes('ReactDOM.render') ||
        msg.includes('findDOMNode') ||
        msg.includes('validateDOMNesting') ||
        msg.includes('defaultProps')
      ) {
        return;
      }
    }
    originalConsoleWarn(msg, ...args);
  };
}; 