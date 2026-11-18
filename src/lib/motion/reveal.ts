/** Document-scoped activation only; CSS owns all timing and interpolation. */
export function setupReveals(root: Document = document): () => void {
  const view = root.defaultView;
  if (!view || !('IntersectionObserver' in view)) return () => {};
  const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>('[data-motion]'),
  );
  const completed = new WeakSet<Element>();
  const seen = new WeakSet<Element>();
  let observer: IntersectionObserver | undefined;
  const reset = () => {
    observer?.disconnect();
    observer = undefined;
    elements.forEach((element) => delete element.dataset.motionState);
  };
  const start = () => {
    reset();
    if (preference.matches) return;
    try {
      observer = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const element = entry.target as HTMLElement;
            const first = !seen.has(element);
            seen.add(element);
            if (entry.isIntersecting) {
              // Initially visible content paints immediately, including the LCP.
              if (!first) element.dataset.motionState = 'active';
              if (element.dataset.motionRepeat !== 'true') {
                completed.add(element);
                element.dataset.motionComplete = 'true';
                observer?.unobserve(element);
              }
            } else if (element.dataset.motionRepeat === 'true' || first) {
              delete element.dataset.motionState;
            }
          }
        },
        { threshold: 0 },
      );
      elements.forEach((element) => {
        if (
          !completed.has(element) &&
          element.dataset.motionComplete !== 'true'
        )
          observer?.observe(element);
      });
    } catch {
      reset();
    }
  };
  // Keyboard users never wait for an entrance or its stagger delay.
  const focus = (event: FocusEvent) => {
    if (!(event.target instanceof Element)) return;
    for (const element of elements) {
      if (element.contains(event.target)) {
        completed.add(element);
        element.dataset.motionComplete = 'true';
        observer?.unobserve(element);
        delete element.dataset.motionState;
      }
    }
  };
  root.addEventListener('focusin', focus);
  preference.addEventListener('change', start);
  start();
  return () => {
    reset();
    preference.removeEventListener('change', start);
    root.removeEventListener('focusin', focus);
  };
}
