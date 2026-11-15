export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "development") {
    const { tick } = await import("@/lib/background");
    setInterval(() => {
      tick(new Date()).catch((e) => console.error('tick failed', e));
    }, 60_000);
    console.log("dev tick loop started");
  }
}