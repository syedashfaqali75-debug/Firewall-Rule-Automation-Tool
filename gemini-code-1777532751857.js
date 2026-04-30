if (process.getuid() !== 0) {
  console.error("This tool requires root privileges.");
  process.exit(1);
}