// app/api/graph-data/route.ts
import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

export async function GET() {
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)-[r]->(m)
      RETURN n.text AS source, m.type AS target, type(r) AS label
      LIMIT 100
    `);

    const nodes = new Set<string>();
    const links = result.records.map(record => {
      const source = record.get('source');
      const target = record.get('target');
      nodes.add(source);
      nodes.add(target);
      return {
        source,
        target,
        label: record.get('label')
      };
    });

    const graphData = {
      nodes: Array.from(nodes).map(id => ({ id, label: id })),
      links
    };

    return NextResponse.json(graphData);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json({ error: 'Failed to fetch graph data' }, { status: 500 });
  } finally {
    await session.close();
    await driver.close();
  }
}