declare module 'hero-patterns' {
  /** Each pattern takes a fill colour and opacity and returns a CSS `url(...)` value. */
  const patterns: Record<string, (fill: string, opacity: number) => string>;
  export default patterns;
}
