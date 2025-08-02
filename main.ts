// Re-export main function from src for backwards compatibility and build process
export { main } from "./src/main.ts";

// Run main if this is the entry point
if (import.meta.main) {
  const { main } = await import("./src/main.ts");
  await main();
}
