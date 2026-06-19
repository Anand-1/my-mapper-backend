const { Client } = require("pg");

async function test() {
  const attempts = [
    // Try Unix socket (no host = socket)
    { user: process.env.USER, database: process.env.USER },
    { user: process.env.USER, database: "postgres" },
    { user: "postgres", database: "postgres" },
    { user: "postgres", database: process.env.USER },
    // With host via socket dir
    { host: "/tmp", user: process.env.USER, database: process.env.USER },
    { host: "/tmp", user: process.env.USER, database: "postgres" },
    { host: "/tmp", user: "postgres", database: "postgres" },
  ];

  for (const opts of attempts) {
    const client = new Client(opts);
    try {
      await client.connect();
      const res = await client.query("SELECT current_database(), version()");
      console.log("Connected:", JSON.stringify(res.rows));
      const tables = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
      );
      console.log("Tables:", tables.rows.map((r) => r.table_name));
      await client.end();
      process.exit(0);
    } catch (e) {
      console.log(`Failed ${JSON.stringify(opts)}: ${e.message}`);
    }
  }
  process.exit(1);
}
test();
